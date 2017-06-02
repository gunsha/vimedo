angular.module('vimedo').controller('solicitudesCtrl', ['$rootScope', 'solicitudesService', '$state', solicitudesCtrl]);

function solicitudesCtrl(r, solicitudesService, state) {
	var vm = this;

	vm.solicitudes = [];
	vm.solicitudesOrig = [];
	vm.modalPro = {};
	vm.objSel = {};
	
	vm.tableConfig = {
        maxPages:"10",
        itemsPerPage: "8"
    };

	vm.filterList = function(){
		var lower = vm.query.toLowerCase();
		vm.solicitudes = vm.solicitudesOrig
		.filter(function(i){
    		if(		i.afiliado.personaFisica.nombre.toLowerCase().indexOf(lower) !== -1 ||
    				i.afiliado.personaFisica.apellido.toLowerCase().indexOf(lower) !== -1 ){
    			return i;
    		}
    	});
	}

	vm.updateList = function(){
		solicitudesService.list().then(function(data){
			vm.solicitudes = data;
			vm.solicitudesOrig = data;
		});
	}

	vm.view = function(obj){
		vm.objSel = obj;
		$('#viewModal').modal();
	};

	vm.savePro = function(){
		vm.modalPro = {};
		$('#newModal').modal('hide');
	};

	vm.updateList();
}