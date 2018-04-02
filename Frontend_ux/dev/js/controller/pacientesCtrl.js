angular.module('vimedo').controller('pacientesCtrl', ['$rootScope', 'pacientesService', '$state', 'NgMap', 'growl', pacientesCtrl]);

function pacientesCtrl(r, pacientesService, state, NgMap, growl) {
    var vm = this;
    
    vm.afiliados = [];
    vm.solicitudes = [];
    vm.afiliadosOrg = [];
    
    vm.afilSel = {};
    
    vm.tableConfig = {
        maxPages: "10",
        itemsPerPage: "10"
    };
    vm.newActive = false;
    vm.editActive = false;
    vm.viewActive = false;
    
    vm.cancelNew = function(){
        vm.newActive = false;        
    }
    vm.cancelEdit = function(){
        vm.editActive = false;        
    }
    vm.cancelView = function(){
        vm.viewActive = false;        
    }
    
    NgMap.getMap().then(function(map) {
        vm.map = map;
    });
    
    vm.filterList = function() {
        var lower = vm.query.toLowerCase();
        vm.afiliados = vm.afiliadosOrg
        .filter(function(i) {
            if (i.personaFisica &&
                (i.personaFisica.nroDocumento.toLowerCase().indexOf(lower) !== -1 ||
                i.personaFisica.nombre.toLowerCase().indexOf(lower) !== -1 ||
                i.personaFisica.apellido.toLowerCase().indexOf(lower) !== -1)) {
                    return i;
                }
            });
        }
        
        vm.updateList = function() {
            pacientesService.list().then(function(data) {
                vm.afiliados = data;
                vm.afiliadosOrg = data;
            });
        }
        vm.removeDom = function(index) {
            vm.afilSel.personaFisica.domicilios.splice(index, 1);
        };
        
        vm.addTel = function() {
            if(vm.afilSel.personaFisica.telefono && vm.afilSel.personaFisica.telefono !== ''){    
                vm.afilSel.personaFisica.telefonosA.push(vm.afilSel.personaFisica.telefono);
                vm.afilSel.personaFisica.telefono = '';
            }
        };
        
        vm.removeTel = function(index) {
            vm.afilSel.personaFisica.telefonosA.splice(index, 1);
        };
        
        vm.viewAfil = function(afil) {
            vm.afilSel = afil;
            vm.viewActive = true;
            pacientesService.getHistorial(afil._id).then(function(data){
                vm.solicitudes = data;
            });
            // $('#viewModal').modal();
        };
        
        vm.viewHist = function(hist){
            vm.histSel = hist;
            $('#histModal').modal();
        }
        
        vm.edit = function(item) {
            vm.afilSel = angular.copy(item);
            if (vm.afilSel.personaFisica.telefonos)
            vm.afilSel.personaFisica.telefonosA = vm.afilSel.personaFisica.telefonos.split(',');
            else
            vm.afilSel.personaFisica.telefonosA = [];
            if (vm.afilSel.personaFisica.fechaNacimiento)
            vm.afilSel.personaFisica.nacimiento = new Date(vm.afilSel.personaFisica.fechaNacimiento);
            vm.editActive = true;
        };
        vm.saveEdit = function() {
            if (vm.validateSave()) {
                vm.afilSel.personaFisica.telefonos = vm.afilSel.personaFisica.telefonosA.toString();
                vm.afilSel.personaFisica.fechaNacimiento = vm.afilSel.personaFisica.nacimiento;
                pacientesService.update(vm.afilSel).then(function() {
                    vm.afilSel = {};
                    vm.editActive = false;
                    vm.updateList();
                })
            }
        };
        vm.validateSave = function() {
            if (vm.afilSel.personaFisica.telefonosA.length !== 0) {
                if (vm.afilSel.personaFisica.domicilios.length !== 0) {
                    return true;
                } else {
                    growl.error("Ingrese al menos una direccion.");
                }
            } else {
                growl.error("Ingrese al menos un telefono.");
            }
            return false;
            
        }
        
        vm.saveAfil = function() {
            if (vm.validateSave()) {
                vm.afilSel.personaFisica.telefonos = vm.afilSel.personaFisica.telefonosA.toString();
                pacientesService.create(vm.afilSel).then(function(data) {
                    vm.afilSel = {};
                    vm.newActive = false;
                    vm.updateList();
                })
            }
        };
        
        vm.newAfil = function() {
            // MapManager.autocomplete('newDireccion');
            vm.afilSel = {
                personaFisica: {
                    domicilios: [],
                    telefonosA: []
                }
            };
            vm.newActive = true;
        };
        
        vm.placeChanged = function() {
            if(!vm.afilSel.personaFisica.domicilios)
            vm.afilSel.personaFisica.domicilios = [];
            vm.afilSel.personaFisica.domicilios.push(getDireccion(this.getPlace()));
            vm.afilDir = '';
        }
        vm.updateList();
    }