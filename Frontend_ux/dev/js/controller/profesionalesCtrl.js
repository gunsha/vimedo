angular.module('vimedo').controller('profesionalesCtrl', ['$scope', '$rootScope', 'profesionalesService', '$state', 'NgMap','growl', profesionalesCtrl]);

function profesionalesCtrl(s, r, profesionalesService, state, NgMap, growl) {
    var vm = this;
    
    vm.profesionales = [];
    vm.profesionalesOrig = [];
    vm.modalPro = {};
    
    vm.tableConfig = {
        maxPages: "10",
        itemsPerPage: "8"
    };
    
    vm.tableConfig = {
        maxPages: "10",
        itemsPerPage: "10"
    };
    vm.newActive = false;
    vm.editActive = false;
    
    vm.especialidades = [];
    
    profesionalesService.especialidades().then(function(data){
        vm.especialidades = data;
    })
    
    NgMap.getMap().then(function(map) {
        vm.map = map;
    });
    
    vm.cancelNew = function(){
        vm.newActive = false;        
    }
    vm.cancelEdit = function(){
        vm.editActive = false;        
    }
    
    vm.filterList = function() {
        var lower = vm.query.toLowerCase();
        vm.profesionales = vm.profesionalesOrig
        .filter(function(i) {
            if (i.matricula.toLowerCase().indexOf(lower) !== -1 ||
            i.personaFisica.nombre.toLowerCase().indexOf(lower) !== -1 ||
            i.personaFisica.apellido.toLowerCase().indexOf(lower) !== -1) {
                return i;
            }
        });
    }
    
    vm.view = function(item) {
        vm.modalPro = item;
        $('#viewModal').modal();
    };
    
    vm.updateList = function() {
        profesionalesService.getList().then(function(data) {
            vm.profesionales = data;
            vm.profesionalesOrig = data;
        });
    }
    vm.removeDom = function(index) {
        vm.modalPro.personaFisica.domicilios.splice(index, 1);
    };
    
    vm.addTel = function() {
        vm.modalPro.personaFisica.telefonosA.push(vm.modalPro.personaFisica.telefono);
        vm.modalPro.personaFisica.telefono = '';
    };
    
    vm.removeTel = function(index) {
        vm.modalPro.personaFisica.telefonosA.splice(index, 1);
    };
    
    vm.newPro = function() {
        vm.modalPro = {
            personaFisica: {
                domicilios: [],
                telefonosA: []
            }
        };
        vm.newActive = true;
    };
    vm.edit = function(item) {
        vm.modalPro = angular.copy(item);
        if (vm.modalPro.personaFisica.telefonos)
        vm.modalPro.personaFisica.telefonosA = vm.modalPro.personaFisica.telefonos.split(',');
        else
        vm.modalPro.personaFisica.telefonosA = [];
        if (vm.modalPro.personaFisica.fechaNacimiento)
        vm.modalPro.personaFisica.nacimiento = new Date(vm.modalPro.personaFisica.fechaNacimiento);
        vm.editActive = true;
    };
    vm.saveEdit = function() {
        if (vm.validateSave()) {
            vm.modalPro.personaFisica.telefonos = vm.modalPro.personaFisica.telefonosA.toString();
            vm.modalPro.personaFisica.fechaNacimiento = vm.modalPro.personaFisica.nacimiento;
            profesionalesService.update(vm.modalPro).then(function() {
                vm.modalPro = {};
                vm.editActive = false;
                vm.updateList();
            })
        }
    };
    vm.savePro = function() {
        if (vm.validateSave()) {
            vm.modalPro.personaFisica.telefonos = vm.modalPro.personaFisica.telefonosA.toString();
            profesionalesService.create(vm.modalPro).then(function() {
                vm.modalPro = {};
                vm.newActive = false;
                vm.updateList();
            })
        }
    };
    vm.validateSave = function() {
        if (vm.modalPro.personaFisica.telefonosA.length !== 0) {
            if (vm.modalPro.personaFisica.domicilios.length !== 0) {
                return true;
            } else {
                growl.error("Ingrese al menos una direccion.");
            }
        } else {
            growl.error("Ingrese al menos un telefono.");
        }
        return false;
        
    }
    vm.placeChanged = function() {
        vm.modalPro.personaFisica.domicilios.push(getDireccion(this.getPlace()));
        vm.afilDir = '';
    }
    
    vm.updateList();
}