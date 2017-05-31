angular.module("app.controllers")

.controller('registrarseUnoCtrl', ['$scope', '$stateParams', 'RegisterManager', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, RegisterManager) {
	$scope.$on('$ionicView.beforeEnter', function (e, data) {
	    $scope.$root.showMenuIcon = false;
		$scope.registrando = {};
	});

	$scope.registrarseUno = function(){
		RegisterManager.store({'registrando':$scope.registrando});
	}
}])
   
.controller('registrarseDosCtrl', ['$scope', '$stateParams', '$http', 'RegisterManager', 'StateManager', 'GLOBALS', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http, RegisterManager, StateManager, GLOBALS) {
	
	$http({
			url: GLOBALS.HOST+':'+GLOBALS.PORT+'/especialidades',
			method: "GET",
			headers: {'Content-Type': 'application/json', 'Accept':'application/json'},
			async : true
	}).then(function(response){
		$scope.retrievedEspes = response.data;
	}).catch(function(e) {
			console.log(e);
	});
	
	$http({
			url: GLOBALS.HOST+':'+GLOBALS.PORT+'/prepagas',
			method: "GET",
			headers: {'Content-Type': 'application/json', 'Accept':'application/json'},
			async : true
	}).then(function(response){
		$scope.retrievedPrepas = response.data;
	}).catch(function(e) {
			console.log(e);
	});

	$scope.registrando = {};

	$scope.registrarUsuario = function(){

		RegisterManager.merge({'registrando':$scope.registrando});

		var data = RegisterManager.data().registrando;

		console.log(data);

		$http({
			url: GLOBALS.HOST+':'+GLOBALS.PORT+'/users/register',
			method: "POST",
			data: data,
			headers: {'Content-Type': 'application/json', 'Accept':'application/json'},
			async : true
		}).then(function(response) {
			console.log("registrarUsuario then");
			console.log(response);

				StateManager.goNoCache('mensajes');



		}).catch(function(e) {
			console.log("registrarUsuario error");
			console.log(e);
		});

		console.log("registrarUsuario pressed");
	};

}])

.controller('registrarseProUnoCtrl', ['$scope', '$stateParams', 'RegisterManager', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, RegisterManager) {

}])

.controller('registrarseProDosCtrl', ['$scope', '$stateParams', '$http', 'RegisterManager', 'GLOBALS', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http, RegisterManager, GLOBALS) {
	$http({
			url: GLOBALS.HOST+':'+GLOBALS.PORT+'/especialidades',
			method: "GET",
			headers: {'Content-Type': 'application/json', 'Accept':'application/json'},
			async : true
	}).then(function(response){
		$scope.retrievedEspes = response.data;
	}).catch(function(e) {
			console.log(e);
	});
	
	$http({
			url: GLOBALS.HOST+':'+GLOBALS.PORT+'/prepagas',
			method: "GET",
			headers: {'Content-Type': 'application/json', 'Accept':'application/json'},
			async : true
	}).then(function(response){
		$scope.retrievedPrepas = response.data;
	}).catch(function(e) {
			console.log(e);
	});

}])

.controller('registrarsePreCtrl', ['$scope', '$stateParams', 'RegisterManager', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, RegisterManager) {

}])
