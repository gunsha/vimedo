angular.module('vimedo').controller('pacientesCtrl', ['$rootScope', 'pacientesService', '$state', pacientesCtrl]);

function pacientesCtrl(r, pacientesService, state) {
	var vm = this;

	vm.afiliados = [];
	vm.afiliadosOrg = [];

	vm.modalAfil = {};

	vm.filterList = function(){
		var lower = vm.query.toLowerCase();
		vm.afiliados = vm.afiliadosOrg
		.filter(function(i){
    		if(i.personaFisica && 
    			(i.personaFisica.nroDocumento.toLowerCase().indexOf(lower) !== -1 ||
    		    i.personaFisica.nombre.toLowerCase().indexOf(lower) !== -1 ||
    		    i.personaFisica.apellido.toLowerCase().indexOf(lower) !== -1 )){
    			return i;
    		}
    	});
	}

	vm.updateList = function(){
		pacientesService.list().then(function(data){
			vm.afiliados = data;
			vm.afiliadosOrg = data;
		});
	}

	vm.saveAfil = function(){
		vm.modalAfil = {};
		$('#newModal').modal('hide');
	};

	vm.updateList();
}