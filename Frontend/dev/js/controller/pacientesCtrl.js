angular.module('vimedo').controller('pacientesCtrl', ['$rootScope', 'pacientesService', '$state', 'NgMap','growl', pacientesCtrl]);

function pacientesCtrl(r, pacientesService, state, NgMap, growl) {
    var vm = this;
    vm.googleMapsUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDoIklkBzmZOHP28l2znHtu3vxzjcaLqXI&libraries=places';

    vm.afiliados = [];
    vm.afiliadosOrg = [];

    vm.modalAfil = {};
    vm.afilSel = {};

    vm.tableConfig = {
        maxPages: "10",
        itemsPerPage: "8"
    };

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
        vm.modalAfil.afiliado.domicilios.splice(index, 1);
    };

    vm.addTel = function() {
        vm.modalAfil.afiliado.telefonosA.push(vm.modalAfil.afiliado.telefono);
        vm.modalAfil.afiliado.telefono = '';
    };

    vm.removeTel = function(index) {
        vm.modalAfil.afiliado.telefonosA.splice(index, 1);
    };

    vm.viewAfil = function(afil) {
        vm.afilSel = afil;
        $('#viewModal').modal();
    };

    vm.saveAfil = function() {
        if (vm.modalAfil.afiliado.telefonosA.length !== 0)
            if (vm.modalAfil.afiliado.domicilios.length !== 0) {
                vm.modalAfil.afiliado.telefonos = vm.modalAfil.afiliado.telefonosA.toString();
                pacientesService.create(vm.modalAfil).then(function(data) {
                    vm.modalAfil = {};
                    $('#newModal').modal('hide');
                    vm.updateList();
                })
            } else {
                growl.error("Ingrese al menos una direccion.");
            }
        else
            growl.error("Ingrese al menos un telefono.");
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