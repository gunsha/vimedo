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

    NgMap.getMap().then(function(map) {
        vm.map = map;
    });

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
        $('#newModal').modal();
    };
    vm.edit = function(item) {
        vm.modalPro = angular.copy(item);
        if (vm.modalPro.personaFisica.telefonos)
            vm.modalPro.personaFisica.telefonosA = vm.modalPro.personaFisica.telefonos.split(',');
        else
            vm.modalPro.personaFisica.telefonosA = [];
        if (vm.modalPro.personaFisica.fechaNacimiento)
            vm.modalPro.personaFisica.nacimiento = new Date(vm.modalPro.personaFisica.fechaNacimiento);
        $('#editModal').modal();
    };
    vm.saveEdit = function() {
        if (vm.validateSave()) {
            vm.modalPro.personaFisica.telefonos = vm.modalPro.personaFisica.telefonosA.toString();
            vm.modalPro.personaFisica.fechaNacimiento = vm.modalPro.personaFisica.nacimiento;
            profesionalesService.update(vm.modalPro).then(function() {
                vm.modalPro = {};
                $('#editModal').modal('hide');
                vm.updateList();
            })
        }
    };
    vm.savePro = function() {
        if (vm.validateSave()) {
            vm.modalPro.personaFisica.telefonos = vm.modalPro.personaFisica.telefonosA.toString();
            profesionalesService.create(vm.modalPro).then(function() {
                vm.modalPro = {};
                $('#newModal').modal('hide');
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
        vm.modalPro.personaFisica.domicilios.push(direccion);
        vm.afilDir = '';

    }

    vm.updateList();
}