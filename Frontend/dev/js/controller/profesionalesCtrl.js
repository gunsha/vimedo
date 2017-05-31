angular.module('vimedo').controller('profesionalesCtrl', ['$scope','$rootScope', 'profesionalesService', '$state', profesionalesCtrl]);

function profesionalesCtrl(s, r, profesionalesService, state) {
	var vm = this;

	vm.profesionales = [];
	vm.profesionalesOrig = [];
	vm.modalPro = {};

	vm.filterList = function(){
		var lower = vm.query.toLowerCase();
		vm.profesionales = vm.profesionalesOrig
		.filter(function(i){
    		if(i.matricula.toLowerCase().indexOf(lower) !== -1 ||
    				i.personaFisica.nombre.toLowerCase().indexOf(lower) !== -1 ||
    				i.personaFisica.apellido.toLowerCase().indexOf(lower) !== -1 ){
    			return i;
    		}
    	});
	}

	vm.updateList = function(){
		profesionalesService.getList().then(function(data){
			vm.profesionales = data;
			vm.profesionalesOrig = data;
		});
	}

	vm.savePro = function(){
		vm.modalPro = {};
		$('#newModal').modal('hide');
	};

	vm.updateList();
}