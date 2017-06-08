angular.module("app.controllers")
.controller('loginCtrl', ['$scope', '$stateParams', '$http', '$ionicPopup', 'StateManager', 'RegisterManager', 'GLOBALS','jwtHelper', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http, $ionicPopup, StateManager, RegisterManager, GLOBALS,jwtHelper) {
	$scope.$on('$ionicView.beforeEnter', function (e, data) {
	    $scope.$root.showMenuIcon = false;
		$scope.login = {};
	});

	$scope.loginUsuario = function(){
		var data = $scope.login;
		console.log(data);
		$http.post(GLOBALS.HOST+':'+GLOBALS.PORT+'/users/login',data).then(function(response){
			var decoded = jwtHelper.decodeToken(response.data.jwt);
			RegisterManager.store({'loggedUser':decoded.sub.usuario});
			
			localStorage.setItem('loggedUser', JSON.stringify(decoded.sub.usuario));

			if(decoded.sub.usuario.profesional==undefined){
				console.log('paciente');
				StateManager.goNoCache('escritorio');
			}else{
				console.log('profesional');
				StateManager.goNoCache('escritorioPro');
			}
		});
		// $http({
		// 	url: 
		// 	method: "POST",
		// 	data: data,
		// 	headers: {'Content-Type': 'application/json', 'Accept':'application/json'},
		// 	async : true
		// }).then(
		// function(response) {
			

		// },
		// function(error){
		// 	$ionicPopup.alert({
		// 		title: 'Error',
		// 		template: error.data.message
		// 	});
		// });
	};

	$scope.loginm007 = function(){
		$scope.login.email = 'm007@gmail.com';
		$scope.login.password = 'm007';
		$scope.loginUsuario();
	};
	$scope.logintest1 = function(){
		$scope.login.email = 'test1@gmail.com';
		$scope.login.password = 'test1';
		$scope.loginUsuario();
	};
}])

.controller('olvideContraseniaCtrl', ['$scope', '$stateParams', '$http', 'GLOBALS', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http, GLOBALS) {
	$scope.$on('$ionicView.beforeEnter', function (e, data) {
	    $scope.$root.showMenuIcon = false;
	    $scope.olvide = {};
	});

	$scope.olvideContrasenia = function(){

		$http({
			url: GLOBALS.HOST+':'+GLOBALS.PORT+'/users/olvideContrasenia/' + $scope.olvide.email,
			method: "GET",
			headers: {'Content-Type': 'application/json', 'Accept':'application/json'},
			async : true
		}).then(
		function(response) {
			console.log(response.data);

			// RegisterManager.store({'loggedUser':response.data.usuario});
			// $state.go('menu.escritorio');
		},
		function(error){

					console.log(error);

			// $ionicPopup.alert({
			// 	title: 'Error',
			// 	template: error.data.message
			// });
		});

		console.log($scope.olvide.email);

	}
}])
   
