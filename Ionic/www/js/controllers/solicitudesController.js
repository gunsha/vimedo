angular.module("app.controllers")


 
.controller('solicitudCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

    $scope.$root.showMenuIcon = true;

}])

.controller('solicitudNewCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

	$scope.$on('$ionicView.beforeEnter', function (e, data) {
	
	    $scope.$root.showMenuIcon = true;

	    // MOCK DATA

	    $scope.solicitador = {};


		$scope.solicitador.domicilios = [
			{ value : "dmID-2", text : "this is a test text antani"},
			{ value : "dmID-2", text : "this is a test text tapioca"},
			{ value : "dmID-3", text : "this is a test text perlipio"},
			{ value : "dmID-4", text : "this is a test text purmenta"},
		];

		$scope.solicitador.domicilio = "dmID-1";

	    // END MOCK DATA








		// var lu = RegisterManager.data().loggedUser;

		// console.log('logged user: ');

		var lu = JSON.parse(localStorage.getItem('loggedUser'));

		console.log(lu);

		if(lu!=undefined){

console.log(lu.afiliado.personaFisica.domicilios);

			$scope.solicitador.domicilios = lu.afiliado.personaFisica.domicilios;



			// $http({
			// 	url: GLOBALS.HOST+':'+GLOBALS.PORT+'/solicitudesMedicas/profesional/' + lu._id,
			// 	method: "GET",
			// 	headers: {'Content-Type': 'application/json', 'Accept':'application/json'},
			// 	async : true
			// }).then(function(response){
			// 	console.log(response);

			// }).catch(function(error) {
			// 	// body...
			// });

		}
	});

    $scope.solicitarMedico = function(){

	    console.log($scope.solicitador.sintomas);
	    console.log($scope.solicitador.domicilio);
    }


}])
   
.controller('solicitudesCtrl', ['$scope', '$stateParams', '$http', 'RegisterManager', 'GLOBALS', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http, RegisterManager, GLOBALS) {

	$scope.$on('$ionicView.beforeEnter', function (e, data) {
	    $scope.$root.showMenuIcon = true;
		var lu = RegisterManager.data().loggedUser;

		console.log('logged user: ');

		var lu2 = JSON.parse(localStorage.getItem('loggedUser'));

		console.log(lu2);

		if(lu!=undefined){

			$http({
				url: GLOBALS.HOST+':'+GLOBALS.PORT+'/solicitudesMedicas/profesional/' + lu._id,
				method: "GET",
				headers: {'Content-Type': 'application/json', 'Accept':'application/json'},
				async : true
			}).then(function(response){
				console.log(response);

			}).catch(function(error) {
				// body...
			});

		}
	});

}])

