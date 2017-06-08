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