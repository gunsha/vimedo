 
// var apiRoute = 'http://vimedo.gunsha.c9users.io:8080';
// var client = "http://vimedo.gunsha.c9users.io:8081";
var apiRoute = 'http://localhost:3000';
var client = "http://localhost:3001";

var monthsShortDot$1 = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_');
var monthsShort$2 = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');

moment.defineLocale('es', {
    months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
    monthsShort: function(m, format) {
        if (!m) {
            return monthsShortDot$1;
        } else if (/-MMM-/.test(format)) {
            return monthsShort$2[m.month()];
        } else {
            return monthsShortDot$1[m.month()];
        }
    },
    monthsParseExact: true,
    weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
    weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
    weekdaysMin: 'do_lu_ma_mi_ju_vi_sá'.split('_'),
    weekdaysParseExact: true,
    longDateFormat: {
        LT: 'H:mm',
        LTS: 'H:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D [de] MMMM [de] YYYY',
        LLL: 'D [de] MMMM [de] YYYY H:mm',
        LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
    },
    calendar: {
        sameDay: function() {
            return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        nextDay: function() {
            return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        nextWeek: function() {
            return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        lastDay: function() {
            return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        lastWeek: function() {
            return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        sameElse: 'L'
    },
    relativeTime: {
        future: 'en %s',
        past: 'hace %s',
        s: 'unos segundos',
        m: 'un minuto',
        mm: '%d minutos',
        h: 'una hora',
        hh: '%d horas',
        d: 'un día',
        dd: '%d días',
        M: 'un mes',
        MM: '%d meses',
        y: 'un año',
        yy: '%d años'
    },
    dayOfMonthOrdinalParse: /\d{1,2}º/,
    ordinal: '%dº',
    week: {
        dow: 1, // Monday is the first day of the week.
        doy: 4 // The week that contains Jan 4th is the first week of the year.
    }
});

angular.module('vimedo', ['ui.router', 'angular-jwt', 'angular-growl', 'angular-table', 'ngAvatar', 'blockUI', 'ngMap','ngAnimate','ui.bootstrap.datetimepicker','ui.bootstrap'])
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

        r.getEstado = function(s){
            if(s === 0){
                return 'Pendiente';
            }else if(s === 1){
                return 'En Curso';
            }else if (s === 2) {
                return 'Cerrado';
            }
        }

        r.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            r.profile = r.getStorage('profile');
            r.hideNav = false;
            r.hideGrowl = toState.data && toState.data.hideGrowl;
            if (toState.data && toState.data.requiresLogin && !r.user || (toState.data && toState.data.requiresRole && !r.hasAnyRole(toState.data.requiresRole))) {
                growl.error('acceso no autorizado');
                event.preventDefault();
                s.go('app.login');
                $('.modal').modal('hide');
            }
            $anchorScroll(0);
        });

        r.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            if (toState.data && toState.data.pageTitle)
                r.navTitle = toState.data.pageTitle;
            r.active = s.current.name;
            $('body').removeClass('sidebar-open');
            if (!r.user)
                s.go('app.login');
        });

        r.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
            s.go('app');
        });

        r.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
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
    .config(['$httpProvider', 'jwtOptionsProvider', 'growlProvider', 'blockUIConfig',
        function($httpProvider, jwtOptionsProvider, growlProvider, blockUIConfig) {
            jwtOptionsProvider.config({
                whiteListedDomains: ['localhost'],
                unauthenticatedRedirector: ['$state', 'growl', function($state, growl) {
                    $state.go('app.login');
                    growl.warning('Su sesi&oacute;n ha expirado.');
                }],
                loginPath: 'app.login',
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
            if (input)
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
                        controller: 'solicitudesCtrl as ctrl'
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
angular.module('vimedo').controller('indexCtrl', ['$scope', '$rootScope', 'indexService', 'solicitudesService', 'profesionalesService', '$state', '$timeout', '$compile', 'NgMap', 'growl', indexCtrl]);

function indexCtrl(s, r, indexService, solicitudesService, profesionalesService, $state, t, $compile, NgMap, growl) {

    var vm = this;
    vm.googleMapsUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyA02b574ia3BpLXpDZXU2gOFuQZTfC_Kks';
    vm.profesionales = [];
    vm.profesionalesD = [];
    vm.profesionalesOrig = [];
    vm.solicitudes = [];
    vm.solicitudesOrig = [];

    vm.filterListS = function() {
        var lower = vm.queryS.toLowerCase();
        vm.solicitudes = vm.solicitudesOrig
            .filter(function(i) {
                if (i.afiliado.personaFisica &&
                    (i.afiliado.personaFisica.nroDocumento.toLowerCase().indexOf(lower) !== -1 ||
                        i.afiliado.personaFisica.nombre.toLowerCase().indexOf(lower) !== -1 ||
                        i.afiliado.personaFisica.apellido.toLowerCase().indexOf(lower) !== -1)) {
                    return i;
                }
            });
    }
    vm.filterListP = function() {
        var lower = vm.queryP.toLowerCase();
        vm.profesionales = vm.profesionalesOrig
            .filter(function(i) {
                if (i.personaFisica &&
                    (i.personaFisica.nroDocumento.toLowerCase().indexOf(lower) !== -1 ||
                        i.personaFisica.nombre.toLowerCase().indexOf(lower) !== -1 ||
                        i.personaFisica.apellido.toLowerCase().indexOf(lower) !== -1) ||
                    i.matricula.toLowerCase().indexOf(lower) !== -1) {
                    return i;
                }
            });
    }
    vm.filterListPD = function() {
        var lower = vm.queryPD.toLowerCase();
        vm.profesionalesD = vm.profesionalesOrig
            .filter(function(i) {
                if (i.personaFisica &&
                    (i.personaFisica.nroDocumento.toLowerCase().indexOf(lower) !== -1 ||
                        i.personaFisica.nombre.toLowerCase().indexOf(lower) !== -1 ||
                        i.personaFisica.apellido.toLowerCase().indexOf(lower) !== -1) ||
                    i.matricula.toLowerCase().indexOf(lower) !== -1) {
                    return i;
                }
            });
    }

    vm.centrarMapa = function(lat, lng) {
        NgMap.getMap("map").then(function(map) {
            var latlng = new google.maps.LatLng(lat, lng);
            vm.map.setCenter(latlng);
        });
    };

    vm.centerAndZoom = function() {
        NgMap.getMap("map").then(function(map) {
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0, LtLgLen = vm.latlngArray.length; i < LtLgLen; i++) {
                bounds.extend(vm.latlngArray[i]);
            }
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
                        vm.polylines[i].setMap(null);
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
        solicitudesService.listActive().then(function(response) {
            vm.solicitudes = response;
            vm.solicitudesOrig = response;
            NgMap.getMap("map").then(function(map) {
                vm.map = map;
                for (var i = 0; i < vm.solicitudes.length; i++) {
                    var solicitud = vm.solicitudes[i];
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
                    });
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
        profesionalesService.getList().then(function(data) {
            vm.profesionales = data;
            vm.profesionalesD = data;
            vm.profesionalesOrig = data;
        });
        profesionalesService.coordenadas().then(function(response) {
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
    vm.calcularRutaSolicitud = function(solicitud) {
        if (solicitud.estado === 0) {
            return false;
        }
        solicitudesService.calcularRutaSolicitud(solicitud._id).then(function(response) {
            var ruta = response;
            NgMap.getMap("map").then(function(map) {
                for (var i = 0; i < vm.polylines.length; i++) {
                    vm.polylines[i].setMap(null);
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

    vm.asignarProfesional = function(id) {
        vm.ocultarInfoWindows();
        NgMap.getMap("map").then(function(map) {
            vm.solicitudId = id;
            vm.asignandoProfesional = true;
            for (var i = 0; i < vm.solicitudesMarks.length; i++) {
                var mark = vm.solicitudesMarks[i];
                if (mark.solicitud._id != id) {
                    mark.setMap(null);
                }
            }
            for (var i = 0; i < vm.polylines.length; i++) {
                var polyline = vm.polylines[i];
                polyline.setMap(null);
            }
            vm.polylines = [];
        });
    };

    vm.vistaAsignarProfesional = function(id) {
        vm.solicitudId = id;
        vm.queryP = '';
        vm.filterListP();
        $('#modalPro').modal();
    };
    vm.confirmarProfesional = function(profesional) {
        vm.ocultarInfoWindows();
        var data = {
            solicitudMedica: {
                _id: vm.solicitudId
            },
            profesional: {
                _id: profesional
            }
        };
        solicitudesService.setProfesional(data).then(function() {
            $('#modalPro').modal('hide');
            $('.collapse').collapse('hide')
            vm.initMap();
            growl.success('Profesional asignado.')
        });
    };
    vm.finishSolicitud = function(s) {
        vm.solSel = s;
        swal({
            title: 'Cerrar la solicitud?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar'
        }).then(function() {
            swal.setDefaults({
                input: 'text',
                confirmButtonText: 'Siguiente &rarr;',
                showCancelButton: true,
                animation: true,
                progressSteps: ['1', '2']
            })

            var steps = [{
                title: 'Indicaciones',
                text: 'Indicaciones para el paciente'
            }, {
                title: 'Observaciones',
                text: 'Obsrvaciones de la visita'
            }]
            swal.queue(steps).then(function(result) {
                swal.resetDefaults();
                vm.solSel.indicaciones = result[0];
                vm.solSel.observaciones = result[1];
                solicitudesService.finalizar(vm.solSel).then(function() {
                    swal({
                        text: 'La solicitud ha sido cerrada.',
                        type: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Aceptar'
                    });
                    vm.initMap();
                }, function() {
                    swal({
                        title: 'Ocurrio un error.',
                        text: 'Intente mas tarde.',
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Aceptar'
                    });
                })

            }, function() {
                swal.resetDefaults();
            })

        })
    };

    function decodePolyline(str, precision) {
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
        while (index < str.length) {
            {}

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

            coordinates.push({
                lat: lat / factor,
                lng: lng / factor
            });
        }

        return coordinates;
    };

    var getColor = function() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    ///NUEVA SOLICITUD
    vm.newSolicitudModal = '';
    vm.newSol = function() {
        vm.newSolicitud = {
            sintomas: [],
            antecedentes: []
        };
        $(vm.newSolicitudModal).modal();
    };
    vm.finishSaveSolicitud = function() {
        vm.newSolicitud = {
            sintomas: [],
            antecedentes: []
        };
        vm.initMap();
        $(vm.newSolicitudModal).modal('hide');
    }
}

function asignarProfesional(data) {
    var scope = angular.element('#accordion').scope();
    if (scope && scope.ctrl)
        scope.ctrl.asignarProfesional(data);
}

function confirmarProfesional(data) {
    var scope = angular.element('#accordion').scope();
    if (scope && scope.ctrl)
        scope.ctrl.confirmarProfesional(data);
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
        coordenadas: coordenadas,
        create: create,
        update: update
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

    function create(obj) {
        obj.isProfesional = true;
        return h.post(apiRoute + '/users/register',obj).then(function(resp) {
            return resp.data;
        });
    }
    function update(obj) {
        return h.put(apiRoute + '/profesionales/',obj).then(function(resp) {
            return resp.data;
        });
    }

}
angular.module('vimedo').controller('profesionalesCtrl', ['$scope', '$rootScope', 'profesionalesService', '$state', 'NgMap','growl', profesionalesCtrl]);

function profesionalesCtrl(s, r, profesionalesService, state, NgMap, growl) {
    var vm = this;

    vm.profesionales = [];
    vm.profesionalesOrig = [];
    vm.modalPro = {};

    vm.googleMapsUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDoIklkBzmZOHP28l2znHtu3vxzjcaLqXI&libraries=places';

    vm.tableConfig = {
        maxPages: "10",
        itemsPerPage: "8"
    };

    NgMap.getMap().then(function(map) {
        vm.map = map;
    });

    vm.filterList = function() {
        var lower = vm.query.toLowerCase();
        vm.profesionales = vm.profesionalesOrig
            .filter(function(i) {
                if (i.matricula.toLowerCase().indexOf(lower) !== -1 ||
                    i.personaFisica.nombre.toLowerCase().indexOf(lower) !== -1 ||
                    i.personaFisica.apellido.toLowerCase().indexOf(lower) !== -1) {
                    return i;
                }
            });
    }

    vm.view = function(item) {
        vm.modalPro = item;
        $('#viewModal').modal();
    };

    vm.updateList = function() {
        profesionalesService.getList().then(function(data) {
            vm.profesionales = data;
            vm.profesionalesOrig = data;
        });
    }
    vm.removeDom = function(index) {
        vm.modalPro.personaFisica.domicilios.splice(index, 1);
    };

    vm.addTel = function() {
        vm.modalPro.personaFisica.telefonosA.push(vm.modalPro.personaFisica.telefono);
        vm.modalPro.personaFisica.telefono = '';
    };

    vm.removeTel = function(index) {
        vm.modalPro.personaFisica.telefonosA.splice(index, 1);
    };

    vm.newPro = function() {
        vm.modalPro = {
            personaFisica: {
                domicilios: [],
                telefonosA: []
            }
        };
        $('#newModal').modal();
    };
    vm.edit = function(item) {
        vm.modalPro = angular.copy(item);
        if (vm.modalPro.personaFisica.telefonos)
            vm.modalPro.personaFisica.telefonosA = vm.modalPro.personaFisica.telefonos.split(',');
        else
            vm.modalPro.personaFisica.telefonosA = [];
        if (vm.modalPro.personaFisica.fechaNacimiento)
            vm.modalPro.personaFisica.nacimiento = new Date(vm.modalPro.personaFisica.fechaNacimiento);
        $('#editModal').modal();
    };
    vm.saveEdit = function() {
        if (vm.validateSave()) {
            vm.modalPro.personaFisica.telefonos = vm.modalPro.personaFisica.telefonosA.toString();
            vm.modalPro.personaFisica.fechaNacimiento = vm.modalPro.personaFisica.nacimiento;
            profesionalesService.update(vm.modalPro).then(function() {
                vm.modalPro = {};
                $('#editModal').modal('hide');
                vm.updateList();
            })
        }
    };
    vm.savePro = function() {
        if (vm.validateSave()) {
            vm.modalPro.personaFisica.telefonos = vm.modalPro.personaFisica.telefonosA.toString();
            profesionalesService.create(vm.modalPro).then(function() {
                vm.modalPro = {};
                $('#newModal').modal('hide');
                vm.updateList();
            })
        }
    };
    vm.validateSave = function() {
        if (vm.modalPro.personaFisica.telefonosA.length !== 0) {
            if (vm.modalPro.personaFisica.domicilios.length !== 0) {
                return true;
            } else {
                growl.error("Ingrese al menos una direccion.");
            }
        } else {
            growl.error("Ingrese al menos un telefono.");
        }
        return false;

    }
    vm.placeChanged = function() {
        var place = this.getPlace();
        var componentForm = {
            street_number: {
                type: 'short_name',
                name: 'numero'
            },
            route: {
                type: 'long_name',
                name: 'calle'
            },
            locality: {
                type: 'short_name',
                name: 'localidad'
            },
            administrative_area_level_1: {
                type: 'long_name',
                name: 'provincia'
            },
            country: {
                type: 'long_name',
                name: 'pais'
            },
            postal_code: {
                type: 'short_name',
                name: 'cp'
            }
        };
        // console.log(vm.place);
        var direccion = {};
        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (componentForm[addressType]) {
                var val = place.address_components[i][componentForm[addressType].type];
                // document.getElementById(addressType).value = val;
                direccion[componentForm[addressType].name] = val;
            }
        }
        direccion.latitud = place.geometry.location.lat();
        direccion.longitud = place.geometry.location.lng();
        direccion.coordenadas = place.geometry.location.lat() + ',' + place.geometry.location.lng();
        vm.modalPro.personaFisica.domicilios.push(direccion);
        vm.afilDir = '';

    }

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
        return h.post(apiRoute + '/users/register',obj).then(function(resp) {
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
angular.module('vimedo').controller('pacientesCtrl', ['$rootScope', 'pacientesService', '$state', 'NgMap', 'growl', pacientesCtrl]);

function pacientesCtrl(r, pacientesService, state, NgMap, growl) {
    var vm = this;
    vm.googleMapsUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDoIklkBzmZOHP28l2znHtu3vxzjcaLqXI&libraries=places';

    vm.afiliados = [];
    vm.afiliadosOrg = [];

    vm.modalAfil = {};
    vm.afilSel = {};

    vm.tableConfig = {
        maxPages: "10",
        itemsPerPage: "8"
    };

    NgMap.getMap().then(function(map) {
        vm.map = map;
    });

    vm.filterList = function() {
        var lower = vm.query.toLowerCase();
        vm.afiliados = vm.afiliadosOrg
            .filter(function(i) {
                if (i.personaFisica &&
                    (i.personaFisica.nroDocumento.toLowerCase().indexOf(lower) !== -1 ||
                        i.personaFisica.nombre.toLowerCase().indexOf(lower) !== -1 ||
                        i.personaFisica.apellido.toLowerCase().indexOf(lower) !== -1)) {
                    return i;
                }
            });
    }

    vm.updateList = function() {
        pacientesService.list().then(function(data) {
            vm.afiliados = data;
            vm.afiliadosOrg = data;
        });
    }
    vm.removeDom = function(index) {
        if (vm.modalAfil.afiliado)
            vm.modalAfil.afiliado.domicilios.splice(index, 1);
        else
            vm.afilSel.personaFisica.domicilios.splice(index, 1);
    };

    vm.addTel = function() {
        if (vm.modalAfil.afiliado) {
            vm.modalAfil.afiliado.telefonosA.push(vm.modalAfil.afiliado.telefono);
            vm.modalAfil.afiliado.telefono = '';
        } else {
            vm.afilSel.personaFisica.telefonosA.push(vm.afilSel.personaFisica.telefono);
            vm.afilSel.personaFisica.telefono = '';
        }
    };

    vm.removeTel = function(index) {
        if (vm.modalAfil.afiliado)
            vm.modalAfil.afiliado.telefonosA.splice(index, 1);
        else
            vm.afilSel.personaFisica.telefonosA.splice(index, 1);
    };

    vm.viewAfil = function(afil) {
        vm.afilSel = afil;
        $('#viewModal').modal();
    };

    vm.edit = function(item) {
        vm.afilSel = angular.copy(item);
        if (vm.afilSel.personaFisica.telefonos)
            vm.afilSel.personaFisica.telefonosA = vm.afilSel.personaFisica.telefonos.split(',');
        else
            vm.afilSel.personaFisica.telefonosA = [];
        if (vm.afilSel.personaFisica.fechaNacimiento)
            vm.afilSel.personaFisica.nacimiento = new Date(vm.afilSel.personaFisica.fechaNacimiento);
        $('#editModal').modal();
    };
    vm.saveEdit = function() {
        if (vm.validateSave()) {
            vm.afilSel.personaFisica.telefonos = vm.afilSel.personaFisica.telefonosA.toString();
            vm.afilSel.personaFisica.fechaNacimiento = vm.afilSel.personaFisica.nacimiento;
            pacientesService.update(vm.afilSel).then(function() {
                vm.afilSel = {};
                $('#editModal').modal('hide');
                vm.updateList();
            })
        }
    };
    vm.validateSave = function() {
        if (vm.afilSel.personaFisica.telefonosA.length !== 0) {
            if (vm.afilSel.personaFisica.domicilios.length !== 0) {
                return true;
            } else {
                growl.error("Ingrese al menos una direccion.");
            }
        } else {
            growl.error("Ingrese al menos un telefono.");
        }
        return false;

    }

    vm.saveAfil = function() {
        if (vm.validateSave()) {
            vm.modalAfil.afiliado.telefonos = vm.modalAfil.afiliado.telefonosA.toString();
            pacientesService.create(vm.modalAfil).then(function(data) {
                vm.modalAfil = {};
                $('#newModal').modal('hide');
                vm.updateList();
            })
        }
    };

    vm.newAfil = function() {
        // MapManager.autocomplete('newDireccion');
        vm.modalAfil = {
            afiliado: {
                domicilios: [],
                telefonosA: []
            }
        };
        $('#newModal').modal();
    };

    vm.placeChanged = function() {
        var place = this.getPlace();
        var componentForm = {
            street_number: {
                type: 'short_name',
                name: 'numero'
            },
            route: {
                type: 'long_name',
                name: 'calle'
            },
            locality: {
                type: 'short_name',
                name: 'localidad'
            },
            administrative_area_level_1: {
                type: 'long_name',
                name: 'provincia'
            },
            country: {
                type: 'long_name',
                name: 'pais'
            },
            postal_code: {
                type: 'short_name',
                name: 'cp'
            }
        };
        // console.log(vm.place);
        var direccion = {};
        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (componentForm[addressType]) {
                var val = place.address_components[i][componentForm[addressType].type];
                // document.getElementById(addressType).value = val;
                direccion[componentForm[addressType].name] = val;
            }
        }
        direccion.latitud = place.geometry.location.lat();
        direccion.longitud = place.geometry.location.lng();
        direccion.coordenadas = place.geometry.location.lat() + ',' + place.geometry.location.lng();
        vm.modalAfil.afiliado.domicilios.push(direccion);
        vm.afilDir = '';

    }
    vm.updateList();
}
angular.module('vimedo').factory('solicitudesService', ['$rootScope', '$http', solicitudesService]);

function solicitudesService(r, h) {
    var service = {
        list: list,
        listActive: listActive,
        calcularRutaProfesional:calcularRutaProfesional,
        calcularRutaSolicitud:calcularRutaSolicitud,
        setProfesional:setProfesional,
        autocompleteCie10: cieAutocomplete,
        autocompleteAfiliado: autocompleteAfiliado,
        create: create,
        finalizar: finalizarSolicitud

    };
    return service;

    function list() {
        return h.get(apiRoute + '/solicitudesMedicas/').then(function(resp) {
            return resp.data;
        });
    }
    function listActive() {
        return h.get(apiRoute + '/solicitudesMedicas/active').then(function(resp) {
            return resp.data;
        });
    }
    function calcularRutaProfesional(id) {
        return h.get(apiRoute + '/solicitudesMedicas/ruta/profesional/'+id).then(function(resp) {
            return resp.data;
        });
    }
    function calcularRutaSolicitud(id) {
        return h.get(apiRoute + '/solicitudesMedicas/ruta/'+id).then(function(resp) {
            return resp.data;
        });
    }

    function setProfesional(obj) {
        return h.post(apiRoute + '/solicitudesMedicas/setProfesional',obj).then(function(resp) {
            return resp.data;
        });
    }

    function cieAutocomplete(term){
        return h.get(apiRoute + '/antecedentesMedicos/cieautocomplete?term='+term).then(function(resp) {
            return resp.data;
        });
    }

    function autocompleteAfiliado(term){
        return h.get(apiRoute + '/antecedentesMedicos/afiliadoautocomplete?term='+term).then(function(resp) {
            return resp.data;
        });
    }

    function create(obj){
        return h.post(apiRoute + '/solicitudesMedicas/',obj).then(function(resp) {
            return resp.data;
        });
    }

    function finalizarSolicitud(obj) {
        return h.put(apiRoute + '/solicitudesMedicas/profesional/finalizarSolicitud',obj).then(function(resp) {
            return resp.data;
        });
    }
}
angular.module('vimedo').controller('solicitudesCtrl', ['$rootScope', 'solicitudesService', '$state', 'growl', solicitudesCtrl]);

function solicitudesCtrl(r, solicitudesService, state, growl) {
    var vm = this;

    vm.solicitudes = [];
    vm.solicitudesOrig = [];
    vm.modalPro = {
        sintomas: [],
        antecedentes: []
    };
    vm.objSel = {};

    vm.tableConfig = {
        maxPages: "10",
        itemsPerPage: "8"
    };
    vm.newModal = '';

    vm.filterList = function() {
        var lower = vm.query.toLowerCase();
        vm.solicitudes = vm.solicitudesOrig
            .filter(function(i) {
                if (i.afiliado.personaFisica.nombre.toLowerCase().indexOf(lower) !== -1 ||
                    i.afiliado.personaFisica.apellido.toLowerCase().indexOf(lower) !== -1) {
                    return i;
                }
            });
    }

    vm.updateList = function() {
        solicitudesService.list().then(function(data) {
            vm.solicitudes = data;
            vm.solicitudesOrig = data;
        });
    }
    vm.newSol = function() {
        vm.modalPro = {
            sintomas: [],
            antecedentes: []
        };
        $(vm.newModal).modal();
    };

    vm.view = function(obj) {
        vm.objSel = obj;
        $('#viewModal').modal();
    };

    vm.finishSave = function() {
        vm.modalPro = {
            sintomas: [],
            antecedentes: []
        };
        vm.updateList();
        $(vm.newModal).modal('hide');
    }

    vm.updateList();
}
angular.module('vimedo')
    .component('modalNuevaSolicitud', {
        templateUrl: './components/modal-nueva-solicitud.html',
        //transclude: true,
        bindings: {
            modal: '&',
            obj: '<',
            finishAction: '&'
        },
        controller: ['solicitudesService', 'growl', function(solicitudesService, growl) {

            var vm = this;

            this.$onInit = function() {
                vm.uniqueId = String(performance.now()).replace('.', '');
                vm.modal({
                    modal: '#modal_' + vm.uniqueId
                });
            };

            vm.autocompleteCie = function(val) {
                return solicitudesService.autocompleteCie10(val).then(function(data) {
                    return data;
                })
            }

            vm.autocompleteAfil = function(val) {
                return solicitudesService.autocompleteAfiliado(val).then(function(data) {
                    return data;
                })
            }

            vm.selectSintoma = function(item, type) {
                if (item && item.dec10) {
                    if (type) {
                        vm.obj.antecedentes.push(item);
                    } else {
                        vm.obj.sintomas.push(item);
                    }
                }
                if (!item && ((!type && vm.asyncSelected !== '') || (type && vm.asyncSelectedA !== ''))) {
                    if (type) {
                        vm.obj.antecedentes.push({
                            dec10: vm.asyncSelectedA
                        });
                    } else {
                        vm.obj.sintomas.push({
                            dec10: vm.asyncSelected
                        });
                    }
                }
                vm.asyncSelected = '';
                vm.asyncSelectedA = '';
            };

            vm.removeSintoma = function(index, type) {
                if (type) {
                    vm.obj.antecedentes.splice(index, 1);
                } else {
                    vm.obj.sintomas.splice(index, 1);
                }
            };
            vm.savePro = function() {
                if (vm.obj.afiliado)
                    if (vm.obj.domicilioSel) {
                        if (vm.obj.sintomas && vm.obj.sintomas.length !== 0) {
                            var sintomasCie = [];
                            var sintomas = [];
                            var antecedentesCie = [];
                            var antecedentes = [];
                            vm.obj.sintomas.map(function(item) {
                                if (item._id) {
                                    sintomasCie.push(item._id);
                                } else {
                                    sintomas.push(item.dec10);
                                }
                            });
                            vm.obj.antecedentes.map(function(item) {
                                if (item._id) {
                                    antecedentesCie.push(item._id);
                                } else {
                                    antecedentes.push(item.dec10);
                                }
                            });

                            var req = {
                                'sintomas': sintomas.toString(),
                                'sintomasCie': sintomasCie,
                                'horasSintomas': vm.obj.horasSintomas ? vm.obj.horasSintomas : 0,
                                'minutosSintomas': vm.obj.minutosSintomas ? vm.obj.minutosSintomas : 0,
                                'afiliado': vm.obj.afiliado._id,
                                'domicilio': vm.obj.domicilioSel._id,
                                'antecedentesCie': antecedentesCie,
                                'antecedentes': antecedentes.toString()
                            };

                            solicitudesService.create(req).then(function() {
                                vm.finishAction();
                            })
                        } else {
                            growl.error('Seleccione por lo menos un sintoma.');
                        }
                    } else {
                        growl.error('Seleccione por lo menos un domicilio.');
                    }
                else
                    growl.error('Seleccione un afiliado.');
            };

        }]
    });