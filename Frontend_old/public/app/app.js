var app = angular.module("app", ["ngRoute","ngMap","app.controllers"]);


app.config(function($routeProvider){
	$routeProvider.when("/",{controller:"SolicitudController",templateUrl: "views/solicitudDetalle.html"});
	$routeProvider.when("/:idSolicitud/detalle",{controller:"SolicitudController",templateUrl: "views/solicitudDetalle.html"});
	$routeProvider.otherwise({redirectTo: '/'});
});

//filtro, migrar a filter.js

/*angular.module('app')
    .filter('to_trusted', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);*/

angular.module('app').config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);