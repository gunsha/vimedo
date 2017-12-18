angular.module('vimedo').controller('pacientesCtrl', ['$rootScope', 'pacientesService', '$state', 'NgMap', 'growl', pacientesCtrl]);

function pacientesCtrl(r, pacientesService, state, NgMap, growl) {
    var vm = this;

    vm.afiliados = [];
    vm.afiliadosOrg = [];

    vm.modalAfil = {};
    vm.afilSel = {};

    vm.tableConfig = {
        maxPages: "10",
        itemsPerPage: "10"
    };
    vm.newActive = false;
    vm.editActive = false;

    vm.cancelNew = function(){
        vm.newActive = false;        
    }
    vm.cancelEdit = function(){
        vm.editActive = false;        
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
        if (vm.modalAfil.afiliado)
            vm.modalAfil.afiliado.domicilios.splice(index, 1);
        else
            vm.afilSel.personaFisica.domicilios.splice(index, 1);
    };

    vm.addTel = function() {
        if (vm.modalAfil.afiliado) {
            if(vm.modalAfil.afiliado.telefono && vm.modalAfil.afiliado.telefono !== ''){    
                vm.modalAfil.afiliado.telefonosA.push(vm.modalAfil.afiliado.telefono);
                vm.modalAfil.afiliado.telefono = '';
            }
        } else{
            if(vm.afilSel.personaFisica.telefono && vm.afilSel.personaFisica.telefono !== ''){
                vm.afilSel.personaFisica.telefonosA.push(vm.afilSel.personaFisica.telefono);
                vm.afilSel.personaFisica.telefono = '';}
            }
        };

        vm.removeTel = function(index) {
            if (vm.modalAfil.afiliado)
                vm.modalAfil.afiliado.telefonosA.splice(index, 1);
            else
                vm.afilSel.personaFisica.telefonosA.splice(index, 1);
        };

        vm.viewAfil = function(afil) {
            vm.afilSel = afil;
            $('#viewModal').modal();
        };

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
                vm.modalAfil.afiliado.telefonos = vm.modalAfil.afiliado.telefonosA.toString();
                pacientesService.create(vm.modalAfil).then(function(data) {
                    vm.modalAfil = {};
                    vm.newActive = false;
                    vm.updateList();
                })
            }
        };

        vm.newAfil = function() {
        // MapManager.autocomplete('newDireccion');
        vm.modalAfil = {
            afiliado: {
                domicilios: [],
                telefonosA: []
            }
        };
        $('#newModal').modal();
    };

    vm.placeChanged = function() {
        var place = this.getPlace();
        var componentForm = {
            street_number: {
                type: 'short_name',
                name: 'numero'
            },
            route: {
                type: 'long_name',
                name: 'calle'
            },
            locality: {
                type: 'short_name',
                name: 'localidad'
            },
            administrative_area_level_1: {
                type: 'long_name',
                name: 'provincia'
            },
            country: {
                type: 'long_name',
                name: 'pais'
            },
            postal_code: {
                type: 'short_name',
                name: 'cp'
            }
        };
        // console.log(vm.place);
        var direccion = {};
        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (componentForm[addressType]) {
                var val = place.address_components[i][componentForm[addressType].type];
                // document.getElementById(addressType).value = val;
                direccion[componentForm[addressType].name] = val;
            }
        }
        direccion.latitud = place.geometry.location.lat();
        direccion.longitud = place.geometry.location.lng();
        direccion.coordenadas = place.geometry.location.lat() + ',' + place.geometry.location.lng();
        vm.modalAfil.afiliado.domicilios.push(direccion);
        vm.afilDir = '';

    }
    vm.updateList();
}