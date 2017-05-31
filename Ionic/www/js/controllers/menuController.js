angular.module("app.controllers")
.controller('menuCtrl', ['$scope', '$stateParams', '$state', '$ionicHistory', 'showMenuIcon', 'RegisterManager', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, $ionicHistory, showMenuIcon, RegisterManager) {

	$scope.logout = function(){
		RegisterManager.store({'loggedUser':undefined});
		$state.go('login');
	}

}])
   
.controller('menuProCtrl', ['$scope', '$stateParams', 'showMenuIcon', 'RegisterManager', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, showMenuIcon, RegisterManager) {

	// $scope.$on('$ionicView.beforeEnter', function (e, data) {
	//     $scope.$root.showMenuIcon = showMenuIcon;
	// });

	$scope.logout = function(){
		RegisterManager.store({'loggedUser':undefined});
	}

}])
   
