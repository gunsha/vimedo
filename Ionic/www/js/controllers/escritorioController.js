angular.module("app.controllers")
.controller('escritorioProCtrl', ['$scope', '$stateParams', 'RegisterManager', 'MapManager', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, RegisterManager, MapManager) {

	$scope.$on('$ionicView.beforeEnter', function (e, data) {
	    $scope.$root.showMenuIcon = true;

		var lu = RegisterManager.data().loggedUser;
		if(lu!=undefined){
			var p = (lu.afiliado!=undefined) ? lu.afiliado.personaFisica : lu.profesional.personaFisica;
			$scope.nomape = p.nombre + ' ' + p.apellido;
		}
	});


	ionic.Platform.ready(MapManager.init);

}])

.controller('escritorioCtrl', ['$scope', '$stateParams', 'RegisterManager', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName




function ($scope, $stateParams, RegisterManager) {

	$scope.$on('$ionicView.beforeEnter', function (e, data) {
	    $scope.$root.showMenuIcon = true;

		var lu = RegisterManager.data().loggedUser;
		if(lu!=undefined){
			var p = (lu.afiliado!=undefined) ? lu.afiliado.personaFisica : lu.profesional.personaFisica;
			$scope.nomape = p.nombre + ' ' + p.apellido;
		}
	});





}])
