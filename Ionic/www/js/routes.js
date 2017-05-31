angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
// MENUS

  .state('menuPro', {
    url: '/sideMenuPro',
    templateUrl: 'templates/menuPro.html',
    controller: 'menuProCtrl'
  })

  .state('menu', {
    url: '/sideMenu',
    templateUrl: 'templates/menu.html',
    controller: 'menuCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

// END MENUS

  .state('escritorio', {
    url: '/escritorio',
    parent: 'menu',
    views: {
      'sideMenu': {
        templateUrl: 'templates/escritorio.html',
        controller: 'escritorioCtrl'
      }
    }
  })

  .state('escritorioPro', {
    url: '/escritorioPro',
    parent: 'menuPro',
    views: {
      'sideMenuPro': {
        templateUrl: 'templates/escritorioPro.html',
        controller: 'escritorioProCtrl'
      }
    }
  })

  .state('mensajes', {
    url: '/mensajes',
    parent: 'menu',
    views: {
      'sideMenu': {
        templateUrl: 'templates/mensajes.html',
        controller: 'mensajesCtrl'
      }
    }
  })

  .state('mensajesPro', {
    url: '/mensajesPro',
    parent: 'menuPro',
    views: {
      'sideMenuPro': {
        templateUrl: 'templates/mensajes.html',
        controller: 'mensajesCtrl'
      }
    }
  })

  .state('registrarseUno', {
    url: '/registrarseUno',
    templateUrl: 'templates/registrarseUno.html',
    controller: 'registrarseUnoCtrl'
  })

  .state('registrarseDos', {
    url: '/registrarseDos',
    templateUrl: 'templates/registrarseDos.html',
    controller: 'registrarseDosCtrl'
  })

  .state('registrarseProUno', {
    url: '/registrarseProUno',
    templateUrl: 'templates/registrarseProUno.html',
    controller: 'registrarseProUnoCtrl'
  })

  .state('registrarseProDos', {
    url: '/registrarseProDos',
    templateUrl: 'templates/registrarseProDos.html',
    controller: 'registrarseProDosCtrl'
  })

  .state('registrarsePre', {
    url: '/registrarsePre',
    templateUrl: 'templates/registrarsePre.html',
    controller: 'registrarsePreCtrl'
  })

  .state('misVisitas', {
    url: '/misVisitas',
    parent: 'menuPro',
    views: {
      'sideMenuPro': {
        templateUrl: 'templates/misVisitas.html',
        controller: 'misVisitasCtrl'
      }
    }
  })

  .state('olvideContrasenia', {
    url: '/olvideContrasenia',
    templateUrl: 'templates/olvideContrasenia.html',
    controller: 'olvideContraseniaCtrl'
  })

  .state('pacientes', {
    url: '/pacientes',
    parent: 'menuPro',
    views: {
      'sideMenuPro': {
        templateUrl: 'templates/pacientes.html',
        controller: 'pacientesCtrl'
      }
    }
  })

  .state('paciente', {
    url: '/paciente',
    parent: 'menu',
    views: {
      'sideMenu': {
        templateUrl: 'templates/paciente.html',
        controller: 'pacienteCtrl'
      }
    }
  })

  .state('solicitudes', {
    url: '/solicitudes',
    parent: 'menuPro',
    views: {
      'sideMenuPro': {
        templateUrl: 'templates/solicitudes.html',
        controller: 'solicitudesCtrl'
      }
    }
  })
  .state('solicitud', {
    url: '/solicitud',
    parent: 'menu',
    views: {
      'sideMenu': {
        templateUrl: 'templates/solicitud.html',
        controller: 'solicitudCtrl'
      }
    }
  })

  .state('solicitudNew', {
    url: '/solicitudNew',
    parent: 'menu',
    views: {
      'sideMenu': {
        templateUrl: 'templates/solicitudNew.html',
        controller: 'solicitudNewCtrl'
      }
    }
  })

  .state('perfil', {
    url: '/perfil',
    parent: 'menu',
    views: {
      'sideMenu': {
        templateUrl: 'templates/perfil.html',
        controller: 'perfilCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/login')

});