angular.module('vimedo').controller('indexCtrl',['$scope', '$rootScope', 'indexService','$state','$timeout','growl', indexCtrl]);

function indexCtrl(s, r, indexService,$state,t,growl){

	var vm = this;

  vm.initSolicitudes = function() {
    indexService.getSolicitudes().then(function(response) {
      vm.solicitudes = response.data;
    });
  };
  vm.initSolicitudes();
  
}
