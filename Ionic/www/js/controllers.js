angular.module('app.controllers', [])

.value('showMenuIcon', true)
  
   
.controller('mensajesCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

	$scope.$on('$ionicView.beforeEnter', function (e, data) {
	    
	    // make conditional to activation?
	    $scope.$root.showMenuIcon = true;

		$scope.mensajes = [
			{
				sender: 'noreply',
				time: '11:11',
				body: 'Su usuario fue registrado con exito y un correo de verificacion fue enviado a su cuenta. Use el link en el mail para verificar y activar su cuenta.'
			}
		];
	
	});
}])
   
.controller('pacienteCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

    $scope.$root.showMenuIcon = true;

}])

.controller('pacientesCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

}])
   
.controller('misVisitasCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
 
.controller('paciente2Ctrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
 
.controller('perfilCtrl', ['$scope', '$stateParams', 'RegisterManager', '$filter', 'MapManager', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, RegisterManager, $filter, MapManager) {

	$scope.vars = {};

	$scope.mod = {};

	$scope.$on('$ionicView.beforeEnter', function (e, data) {
	    $scope.$root.showMenuIcon = true;

		var lu = RegisterManager.lu();
		if(lu!=undefined){
			console.log(lu);
			var p = (lu.afiliado!=undefined) ? lu.afiliado.personaFisica : lu.profesional.personaFisica;
			$scope.nomape = p.nombre + ' ' + p.apellido;

			$scope.domicilios = p.domicilios;

			$scope.vars.showTheForm = false;

			for (var i = p.domicilios.length - 1; i >= 0; i--) {
				if(p.domicilios[i].principal==true){
					$scope.selectedDirId = p.domicilios[i]._id;
				}
			}

			console.log($scope.selectedDirId);


		}
	
	});

	$scope.showDir = function(id){

		var domicilios = RegisterManager.lud();
		
		var dom = $filter('filter')(domicilios, function (d) {return d._id === id;})[0];
		MapManager.init(dom.latitud, dom.longitud);
	};


	$scope.newDire = function(){
		$scope.vars.showTheForm = !$scope.vars.showTheForm
		MapManager.autocomplete('autocomplete');
		
	};

	$scope.locationChanged = function (location) {
		alert(location);
	};

	$scope.disableTap = function(){
		container = document.getElementsByClassName('pac-container');
		// disable ionic data tab
		angular.element(container).attr('data-tap-disabled', 'true');
		// leave input field if google-address-entry is selected
		angular.element(container).on("click", function(){
			document.getElementById('autocomplete').blur();
		});
	};
	$scope.hidemap = function(){
		MapManager.hide();
	}

}])



