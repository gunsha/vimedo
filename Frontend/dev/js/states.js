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