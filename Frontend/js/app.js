 
// var apiRoute = 'http://vimedo.gunsha.c9users.io:8080';
// var client = "http://vimedo.gunsha.c9users.io:8081";
var apiRoute = 'http://localhost:3000';
var client = "http://localhost:3001";

angular.module('vimedo', ['ui.router', 'angular-jwt', 'angular-growl', 'angular-table','ngAvatar','blockUI','ngMap'])
    .run(['$rootScope', '$state', 'authManager', 'jwtHelper', '$anchorScroll', 'growl', function(r, s, authManager, jwtHelper, $anchorScroll, growl) {
        r.hideNav = false;
        r.navTitle = '';
        r.active = s.current.name;
        if (authManager.isAuthenticated() && !r.user) {
            r.user = jwtHelper.decodeToken(localStorage.getItem('id_token')).sub.usuario;
        }

        r.setStorage = function(name, obj) {
            localStorage.setItem(name, JSON.stringify(obj));
        };

        r.getStorage = function(name) {
            return JSON.parse(localStorage.getItem(name));
        };

        r.logout = function() {
            localStorage.removeItem('id_token');
            localStorage.removeItem('profile');
            r.user = false;
            s.go('app.login');
        };

        r.hasRole = function(role) {
            if (r.user && r.user.rolName) {
                if (typeof r.user.rolName === "string") {
                    return r.user.rolName === role;
                } else {
                    for (var i in r.user.rolName) {
                        if (r.user.rolName[i] === role)
                            return true;
                    }
                }
            }
            return false;
        };

        r.hasAnyRole = function(roles) {
            if (r.user && r.user.rolName) {
                for (var e in roles) {
                    if (typeof r.user.rolName === "string") {
                        return r.user.rolName === roles[e];
                    } else {
                        for (var i in r.user.rolName) {
                            if (r.user.rolName[i] === roles[e])
                                return true;
                        }
                    }
                }
            }
            return false;
        };
        r.findByAttr = function(a, q, attr) {
            return a.filter(function(i) {
                if (i[attr] === q) {
                    return i;
                }
                return false;
            })[0];
        };
        authManager.checkAuthOnRefresh();
        authManager.redirectWhenUnauthenticated();
        r.$on('tokenHasExpired', function() {
            r.logout();
        });

        r.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            r.profile = r.getStorage('profile');
            r.hideNav = false;
            r.hideGrowl = toState.data && toState.data.hideGrowl;
            if (toState.data && toState.data.requiresLogin && !r.user || (toState.data && toState.data.requiresRole && !r.hasAnyRole(toState.data.requiresRole))) {
                growl.error('acceso no autorizado');
                event.preventDefault();
                console.log('error')
                // if (s.current !== 'app.login') {
                    s.go('app.login');
                    $('.modal').modal('hide');
                // }
            }
            $anchorScroll(0);
        });

        r.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            if (toState.data && toState.data.pageTitle)
                r.navTitle = toState.data.pageTitle;
            r.active = s.current.name;
            $('body').removeClass('sidebar-open');
            if(!r.user)
                s.go('app.login');
        });

        r.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
            console.log(unfoundState.to);
            console.log(unfoundState.toParams);
            console.log(unfoundState.options);
            s.go('app');
        });

        r.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            console.log(error);
            s.go('app');
        });

        r.showWait = function() {
            r.loading = true;
        };
        r.dismissWait = function() {
            r.loading = false;
        };
    }])
    .factory('httpInerceptor', ['$q', 'growl', '$rootScope', function($q, growl, r) {
        return {
            response: function(response) {
                if (response.data.status !== 406 && response.data.message)
                    growl.success(response.data.message);
                r.block = false;
                return response || $q.when(response);
            },
            responseError: function(response) {
                var msg;
                if (response.status == 406) {
                    msg = response.data;
                } else if (response.status == 403) {
                    r.logout();
                } else {
                    msg = "Ocurrio un error inesperado.";
                }
                growl.error(msg);
                return $q.reject(response);
            }
        };
    }])
    .config(['$httpProvider', 'jwtOptionsProvider', 'growlProvider','blockUIConfig',
        function($httpProvider, jwtOptionsProvider, growlProvider,blockUIConfig) {
            jwtOptionsProvider.config({
                whiteListedDomains: ['localhost'],
                unauthenticatedRedirectPath: '/login',
                tokenGetter: ['options', function(options) {
                    // Skip authentication for any requests ending in .html
                    if (options && options.url && options.url.substr(options.url.length - 5) == '.html') {
                        return null;
                    }
                    return localStorage.getItem('id_token');
                }]
            });
            $httpProvider.interceptors.push('jwtInterceptor');
            $httpProvider.interceptors.push('httpInerceptor');
            growlProvider.globalTimeToLive(3000);
            growlProvider.globalDisableCountDown(true);
            growlProvider.globalDisableIcons(true);
            blockUIConfig.template = '<div class="cssload-container"><div class="cssload-speeding-wheel"></div></div>';

        }
    ])
    .filter('unsafe', ['$sce', function($sce) {
        return $sce.trustAsHtml;
    }])
    .filter('splitComma', function() {
        return function(input) {
            var text = typeof input === 'string' ? input.split(',') : input;
            var count = 0;
            var rText = '';
            text.map(function(i) {
                rText += i.charAt(0).toUpperCase() + i.slice(1).toLowerCase() + ',';
                if (count % 2 == 1 && count !== text.length - 1) {
                    rText += '<br>';
                }
                count++;
            });
            return rText.substring(0, rText.length - 1);
        };
    })
    .filter('replaceCommaSpace', function() {
        return function(input) {
            if(input)
            return input.replace(/,/g, ' ');
        };
    })
    .filter('monthNameUC', function() {
        return function(input) {
            var date = new Date(input);
            return months.short[date.getMonth()].toUpperCase();
        };
    })
    .filter('year', function() {
        return function(input) {
            var date = new Date(input);
            return date.getFullYear();
        };
    })
    .filter('fullDateShort', function() {
        return function(input) {
            var date = new Date(input);
            return date.getDate() + ' ' + months.short[date.getMonth()] + ' ' + date.getFullYear();
        };
    })
    .filter('upperCaseFL', function() {
        return function(input) {
            if (input) {
                var words = input.split(' ');
                for (var i in words) {
                    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
                }
                return words.join(' ');
            }
        };
    })
    .directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if (event.which === 13) {
                    event.preventDefault();
                    scope.$apply(function() {
                        scope.$eval(attrs.ngEnter, {
                            'event': event
                        });
                    });
                }
            });
        };
    });
//FIX PARA MODALES EN TEMPLATES
function appendModal() {
    var checkeventcount = 1,
        prevTarget;
    $('.modal').on('show.bs.modal', function(e) {
        if (typeof prevTarget == 'undefined' || (checkeventcount == 1 && e.target != prevTarget)) {
            prevTarget = e.target;
            checkeventcount++;
            e.preventDefault();
            $(e.target).appendTo('body').modal('show');
        } else if (e.target == prevTarget && checkeventcount == 2) {
            checkeventcount--;
        }
    });
}
angular.module('vimedo')
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise("/");
        $stateProvider
            .state('app', {
                url: '/',
                views: {
                    '@': {
                        templateUrl: 'templates/layout.html'
                    },
                    'navView@app': {
                        templateUrl: 'templates/nav.html',
                        controller: 'navCtrl as ctrl'
                    },
                    'sidemenu@app': {
                        templateUrl: 'templates/sidemenu.html',
                        controller: 'navCtrl as ctrl'
                    },
                    'contentView@app': {
                        templateUrl: 'templates/index.html',
                        controller: 'indexCtrl as ctrl'
                    }
                }
            })
            .state('app.login', {
                url: 'login',
                views: {
                    'loginView@app': {
                        templateUrl: 'templates/login.html',
                        controller: 'authCtrl as ctrl'
                    }
                }
            })
            .state('app.registro', {
                url: 'registro',
                views: {
                    'contentView@app': {
                        templateUrl: 'templates/registro.html',
                        controller: 'authCtrl as ctrl'
                    }
                }
            })
            .state('admin', { url: '/',
                views: {
                    '@': {
                        templateUrl: 'templates/layout.html'
                    },
                    'navView@admin': {
                        templateUrl: 'templates/nav.html',
                        controller: 'navCtrl as ctrl'
                    },
                    'sidemenu@admin': {
                        templateUrl: 'templates/sidemenu.html',
                        controller: 'navCtrl as ctrl'
                    }
                } })
            .state('admin.pacientes', {
                url: 'pacientes',
                views: {
                    'contentView@admin': {
                        templateUrl: 'templates/admin/pacientes.html',
                        controller: 'pacientesCtrl as ctrl'
                    }
                },
                    data:{
                        requiresLogin: true,
                        requiresRole: ['ADMIN']
                    }
            })
            .state('admin.medicos', {
                url: 'profesionales',
                views: {
                    'contentView@admin': {
                        templateUrl: 'templates/admin/medicos.html',
                        controller: 'profesionalesCtrl as ctrl'
                    }
                },
                    data:{
                        requiresLogin: true,
                        requiresRole: ['ADMIN']
                    }
            })
            .state('admin.historial', {
                url: 'historial',
                views: {
                    'contentView@admin': {
                        templateUrl: 'templates/admin/historial.html',
                        controller: 'authCtrl as ctrl'
                    }
                },
                    data:{
                        requiresLogin: true,
                        requiresRole: ['ADMIN']
                    }
            });
        $locationProvider.html5Mode(true);
    }]);
angular.module('vimedo').factory('indexService', ['$rootScope','$http',indexService]);

function indexService(r,h) {
    var service = {
        getSolicitudes: solicitudes
    };

    return service;

    function solicitudes(){
    	return h.get(apiRoute +'/solicitudesMedicas').then(function(resp){
    		return resp.data;
    	});

    }
}
angular.module('vimedo').controller('indexCtrl', ['$scope', '$rootScope', 'indexService', 'solicitudesService', 'profesionalesService', '$state', '$timeout', '$compile', 'NgMap', indexCtrl]);

function indexCtrl(s, r, indexService, solicitudesService, profesionalesService, $state, t, $compile, NgMap) {

    var vm = this;
    vm.googleMapsUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyA02b574ia3BpLXpDZXU2gOFuQZTfC_Kks';
    
    vm.initSolicitudes = function() {
        indexService.getSolicitudes().then(function(response) {
            vm.solicitudes = response.data;
        });
    };
    // vm.initSolicitudes();
    vm.centrarMapa = function(lat, lng) {
        NgMap.getMap("map").then(function(map) {
            var latlng = new google.maps.LatLng(lat, lng);
            vm.map.setCenter(latlng);
        });
    };
    vm.toogleMenu = function(id) {
        $("#" + id + "Menu").toggleClass("hide");
    };
    vm.centerAndZoom = function() {

        NgMap.getMap("map").then(function(map) {
            var bounds = new google.maps.LatLngBounds();
            //  Go through each...
            for (var i = 0, LtLgLen = vm.latlngArray.length; i < LtLgLen; i++) {
                //  And increase the bounds to take this point
                bounds.extend(vm.latlngArray[i]);
            }
            //  Fit these bounds to the map
            map.fitBounds(bounds);
        });


    };

    vm.ocultarInfoWindows = function() {
        for (var i = 0; i < vm.infowindows.length; i++) {
            vm.infowindows[i].close();
        }
    };
    vm.calcularRutaProfesional = function(id) {
        solicitudesService.calcularRutaProfesional(id)
            .then(function(response) {

                var ruta = response;
                NgMap.getMap("map").then(function(map) {
                    for (var i = 0; i < vm.polylines.length; i++) {
                        var flightPath = vm.polylines[i];
                        flightPath.setMap(null);
                    }
                    vm.polylines = [];

                    for (var i = 0; i < ruta.routes[0].legs.length; i++) {
                        var flightPlanCoordinates = [];
                        var leg = ruta.routes[0].legs[i];
                        for (var ii = 0; ii < leg.steps.length; ii++) {
                            var step = leg.steps[ii];
                            var points = decodePolyline(step.polyline.points);
                            for (var z = 0; z < points.length; z++) {
                                flightPlanCoordinates.push(points[z]);
                            }

                        }
                        var flightPath = new google.maps.Polyline({
                            path: flightPlanCoordinates,
                            geodesic: true,
                            strokeColor: getColor(),
                            strokeOpacity: 1.0,
                            strokeWeight: 2
                        });
                        vm.polylines.push(flightPath);
                        flightPath.setMap(map);

                    }

                });
            });
    };

    vm.initMap = function() {
        vm.polylines = [];
        vm.latlngArray = [];
        vm.solicitudesMarks = [];
        vm.profesionalMark = [];
        vm.asignandoProfesional = false;
        vm.infowindows = [];
        solicitudesService.list().then(function(response) {
            vm.solicitudes = response;
            NgMap.getMap("map").then(function(map) {
                vm.map = map;
                for (var i = 0; i < vm.solicitudes.length; i++) {
                    var solicitud = vm.solicitudes[i];
                    solicitud.fechaAlta = moment(solicitud.fechaAlta).format("DD-MM-YYYY");
                    var contentString = '<div id="content"><h5>' +
                        solicitud.afiliado.personaFisica.nombre + ' ' + solicitud.afiliado.personaFisica.apellido +
                        '</h5><div>' + solicitud.domicilio.calle + ' ' + solicitud.domicilio.numero + '</div><div>';
                    if (solicitud.estado == 0) {
                        contentString += '<button type="button" class="btn btn-primary btn-xs" onclick="asignarProfesional(&quot;' + solicitud._id + '&quot;)">Asignar Prestador</button></div>';
                    }
                    contentString += '</div>';
                    var compiledContent = $compile(contentString)(vm);
                    var infowindow = new google.maps.InfoWindow({
                        content: contentString
                    });
                    vm.infowindows.push(infowindow);
                    var icon;
                    switch (solicitud.estado) {
                        case 0:
                            icon = client + "/img/red-dot.png";
                            break;
                        case 1:
                            icon = client + "/img/green-dot.png";
                            break;
                    }
                    var latlng = new google.maps.LatLng(solicitud.domicilio.latitud, solicitud.domicilio.longitud);
                    vm.latlngArray.push(latlng);
                    var mark = new google.maps.Marker({
                        icon: icon,
                        estado: solicitud.estado,
                        solicitud: solicitud
                    });
                    mark.infowindow = infowindow;

                    //finally call the explicit infowindow object
                    mark.addListener('click', function() {
                        // vm.ocultarInfoWindows();
                        this.infowindow.setContent(compiledContent);
                        // vm.calcularRutaSolicitud(this.solicitud);
                        return this.infowindow.open(map, this);
                    })
                    console.log('latlng ' + latlng)
                    mark.setPosition(latlng);
                    mark.setMap(map);
                    vm.map.setCenter(latlng);
                    vm.solicitudesMarks.push(mark);
                }
                vm.cargarProfesionales();
            });
        });
    }

    vm.cargarProfesionales = function() {

        profesionalesService.coordenadas()
            .then(function(response) {
                vm.coordenadas = response;
                NgMap.getMap("map").then(function(map) {

                    for (var i = 0; i < vm.coordenadas.length; i++) {
                        var coordenada = vm.coordenadas[i];

                        var latlng = new google.maps.LatLng(coordenada.latitud, coordenada.longitud);
                        vm.latlngArray.push(latlng);
                        var mark = new google.maps.Marker({
                            icon: client + "/img/doctor.png",
                            profesional: coordenada.profesional
                        });


                        //finally call the explicit infowindow object
                        mark.addListener('click', function() {
                            vm.ocultarInfoWindows();
                            if (vm.asignandoProfesional) {
                                var contentString = '<div id="content"><h5>' +
                                    this.profesional.personaFisica.nombre + ' ' + this.profesional.personaFisica.apellido +
                                    '</h5>' +
                                    '<button type="button" class="btn btn-primary btn-xs" onclick="confirmarProfesional(&quot;' + this.profesional._id + '&quot;)">Aceptar</button></div>'; +
                                '</div>';
                                var compiledContent = $compile(contentString)(s);
                                var infowindow = new google.maps.InfoWindow({
                                    content: contentString
                                });
                                vm.infowindows.push(infowindow);
                                this.infowindow = infowindow;
                                this.infowindow.setContent(compiledContent);
                                return this.infowindow.open(map, this);
                            } else {
                                var contentString = '<div id="content"><h5>' +
                                    this.profesional.personaFisica.nombre + ' ' + this.profesional.personaFisica.apellido +
                                    '</h5></div>';

                                var compiledContent = $compile(contentString)(s);
                                var infowindow = new google.maps.InfoWindow({
                                    content: contentString
                                });
                                vm.infowindows.push(infowindow);
                                this.infowindow = infowindow;
                                this.infowindow.setContent(compiledContent);
                                vm.calcularRutaProfesional(this.profesional._id);
                                return this.infowindow.open(map, this);
                            }

                        })

                        mark.setPosition(latlng);
                        mark.setMap(map);

                        vm.profesionalMark.push(mark);

                        vm.centerAndZoom();
                    }

                });
            });
    };
    var decodePolyline = function(str, precision) {
    var index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte = null,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, precision || 5);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {{}

        // Reset shift, result, and byte
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push({lat:lat / factor, lng: lng / factor});
    }

    return coordinates;
};

var getColor = function(){
	var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};
}
angular.module('vimedo').factory('navService', ['$rootScope',navService]);

function navService(r) {
    var service = {
    };

    return service;

}
angular.module('vimedo').controller('navCtrl', ['$scope','$rootScope','$location',
'$anchorScroll' , 'navService', '$state', navCtrl]);

function navCtrl(s, r, $location, $anchorScroll, navService, state){

    var vm = this;
    // vm.user = r.user;
    vm.logout = function(){
      r.user = false;
    };

    vm.navigate = function(section){
    	if(state.name !== 'app')
    		state.go('app');
    	$('html, body').animate({
            scrollTop: $("#"+section).offset().top - 67
        }, 1000);
    };
    
}
angular.module('vimedo')
.factory('authService', ['$rootScope','$http', authService]);

function authService(r,h) {
    var service = {
        login: login,
        reset: reset,
        forgot:forgot,
        signUp:signUp
    };
    return service;

    function login(cred) {  
      return h({method:'POST',url:apiRoute+'/users/login',data:cred,skipAuthorization: true}).then(function(resp){
      		return resp.data;
      });
    }

    function signUp(cred) {  
      return h({method:'POST',url:apiRoute+'/api/auth/signUp',data:cred,skipAuthorization: true}).then(function(resp){
          return resp.data;
      });
    }

    function forgot(cred) {
      return h({method:'POST',url:apiRoute+'/api/auth/forgot',data:cred,skipAuthorization: true}).then(function(resp){
          return resp.data;
      });
    }

    function reset(cred) {
      return h({method:'POST',url:apiRoute+'/api/auth/resetPassword',data:cred,skipAuthorization: true}).then(function(resp){
          return resp.data;
      });
    }
}
angular.module('vimedo').controller('authCtrl', ['$scope', '$rootScope', 'authService', '$state', 'jwtHelper', '$timeout', authCtrl]);

function authCtrl(s, r, authService, state, jwtHelper, t) {

    var vm = this;
    vm.wrongUserError = false;

    vm.login = function() {
        authService.login(vm.credenciales).then(function(data) {
            vm.wrongUserError = false;
            localStorage.setItem('id_token', data.jwt);
            r.decoded = jwtHelper.decodeToken(data.jwt);
            r.user = r.decoded.sub.usuario;
            var profile = {};
            if (r.user.admin) {
                profile = r.user.admin.personaFisica;
            } else if (r.user.profesional) {
                profile = r.user.profesional.personaFisica;
            } else {
                profile = r.user.afiliado.personaFisica;
            }
            profile.initials = profile.nombre[0].toUpperCase()+profile.apellido[0].toUpperCase();
            r.setStorage('profile', profile);
            if (r.hasRole('ADMIN')) {
                state.go('admin');
            } else {
                state.go('app');
            }
        }, function(data) {
            vm.wrongUserError = true;
        });
    };

    vm.forgotPass = function() {
        authService.forgot(vm.forgot).then(function(data) {
            state.go('app');
        });
    };

    vm.resetPass = function() {
        authService.reset(vm.forgot).then(function(data) {
            state.go('app');
        });
    };

    vm.registrarse = function() {
        authService.signUp(vm.credenciales).then(function(data) {
            localStorage.setItem('id_token', data.jwt);
            r.decoded = jwtHelper.decodeToken(data.jwt);
            r.user = r.decoded.sub.usuario;
            r.setStorage('profile', r.decoded.sub.usuario);
            state.go('app');
        });
    };

}
angular.module('vimedo').factory('profesionalesService', ['$rootScope', '$http', profesionalesService]);

function profesionalesService(r, h) {
    var service = {
        getList: getList,
        coordenadas: coordenadas
    };
    return service;

    function getList() {
        return h.get(apiRoute + '/profesionales/').then(function(resp) {
            return resp.data;
        });
    }

    function coordenadas() {
        return h.get(apiRoute + '/coordenadas/').then(function(resp) {
            return resp.data;
        });
    }

}
angular.module('vimedo').controller('profesionalesCtrl', ['$scope','$rootScope', 'profesionalesService', '$state', profesionalesCtrl]);

function profesionalesCtrl(s, r, profesionalesService, state) {
	var vm = this;

	vm.profesionales = [];
	vm.profesionalesOrig = [];
	vm.modalPro = {};

	vm.filterList = function(){
		var lower = vm.query.toLowerCase();
		vm.profesionales = vm.profesionalesOrig
		.filter(function(i){
    		if(i.matricula.toLowerCase().indexOf(lower) !== -1 ||
    				i.personaFisica.nombre.toLowerCase().indexOf(lower) !== -1 ||
    				i.personaFisica.apellido.toLowerCase().indexOf(lower) !== -1 ){
    			return i;
    		}
    	});
	}

	vm.updateList = function(){
		profesionalesService.getList().then(function(data){
			vm.profesionales = data;
			vm.profesionalesOrig = data;
		});
	}

	vm.savePro = function(){
		vm.modalPro = {};
		$('#newModal').modal('hide');
	};

	vm.updateList();
}
angular.module('vimedo').factory('pacientesService', ['$rootScope', '$http', pacientesService]);

function pacientesService(r, h) {
    var service = {
        list: list,
        get: get,
        create: create,
        update: update,
        remove: remove
    };
    return service;

    function list() {
        return h.get(apiRoute + '/afiliados/').then(function(resp) {
            return resp.data;
        });
    }

    function get(obj) {
        return h.get(apiRoute + '/afiliados/' + obj._id).then(function(resp) {
            return resp.data;
        });
    }

    function create(obj) {
        return h.post(apiRoute + '/afiliados/',obj).then(function(resp) {
            return resp.data;
        });
    }

    function update(obj) {
        return h.put(apiRoute + '/afiliados/',obj).then(function(resp) {
            return resp.data;
        });
    }

    function remove(obj) {
        return h.delete(apiRoute + '/afiliados/' + obj._id).then(function(resp) {
            return resp.data;
        });
    }

}
angular.module('vimedo').controller('pacientesCtrl', ['$rootScope', 'pacientesService', '$state', pacientesCtrl]);

function pacientesCtrl(r, pacientesService, state) {
	var vm = this;

	vm.afiliados = [];
	vm.afiliadosOrg = [];

	vm.modalAfil = {};

	vm.filterList = function(){
		var lower = vm.query.toLowerCase();
		vm.afiliados = vm.afiliadosOrg
		.filter(function(i){
    		if(i.personaFisica && 
    			(i.personaFisica.nroDocumento.toLowerCase().indexOf(lower) !== -1 ||
    		    i.personaFisica.nombre.toLowerCase().indexOf(lower) !== -1 ||
    		    i.personaFisica.apellido.toLowerCase().indexOf(lower) !== -1 )){
    			return i;
    		}
    	});
	}

	vm.updateList = function(){
		pacientesService.list().then(function(data){
			vm.afiliados = data;
			vm.afiliadosOrg = data;
		});
	}

	vm.saveAfil = function(){
		vm.modalAfil = {};
		$('#newModal').modal('hide');
	};

	vm.updateList();
}
angular.module('vimedo').factory('solicitudesService', ['$rootScope', '$http', solicitudesService]);

function solicitudesService(r, h) {
    var service = {
        list: list,
        calcularRutaProfesional:calcularRutaProfesional
    };
    return service;

    function list() {
        return h.get(apiRoute + '/solicitudesMedicas/').then(function(resp) {
            return resp.data;
        });
    }
    function calcularRutaProfesional(id) {
        return h.get(apiRoute + '/solicitudesMedicas/ruta/profesional/'+id).then(function(resp) {
            return resp.data;
        });
    }

}
angular.module('vimedo').controller('solicitudesCtrl', ['$rootScope', 'solicitudesService', '$state', solicitudesCtrl]);

function solicitudesCtrl(r, solicitudesService, state) {
	var vm = this;
}