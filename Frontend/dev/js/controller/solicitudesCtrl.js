angular.module('vimedo').controller('solicitudesCtrl', ['$rootScope', 'solicitudesService', '$state', 'growl', solicitudesCtrl]);

function solicitudesCtrl(r, solicitudesService, state, growl) {
    var vm = this;

    vm.solicitudes = [];
    vm.solicitudesOrig = [];
    vm.modalPro = {
        sintomas: [],
        antecedentes: []
    };
    vm.objSel = {};

    vm.tableConfig = {
        maxPages: "10",
        itemsPerPage: "8"
    };

    vm.filterList = function() {
        var lower = vm.query.toLowerCase();
        vm.solicitudes = vm.solicitudesOrig
            .filter(function(i) {
                if (i.afiliado.personaFisica.nombre.toLowerCase().indexOf(lower) !== -1 ||
                    i.afiliado.personaFisica.apellido.toLowerCase().indexOf(lower) !== -1) {
                    return i;
                }
            });
    }

    vm.autocompleteCie = function(val) {
        return solicitudesService.autocompleteCie10(val).then(function(data) {
            return data;
        })
    }

    vm.autocompleteAfil = function(val) {
        return solicitudesService.autocompleteAfiliado(val).then(function(data) {
            return data;
        })
    }

    vm.selectSintoma = function(item, type) {
        if (item && item.dec10) {
            if (type) {
                vm.modalPro.antecedentes.push(item);
            } else {
                vm.modalPro.sintomas.push(item);
            }
        }
        if (!item && ((!type && vm.asyncSelected !== '') || (type && vm.asyncSelectedA !== ''))) {
            if (type) {
                vm.modalPro.antecedentes.push({
                    dec10: vm.asyncSelectedA
                });
            } else {
                vm.modalPro.sintomas.push({
                    dec10: vm.asyncSelected
                });
            }
        }
        vm.asyncSelected = '';
        vm.asyncSelectedA = '';
    };

    vm.removeSintoma = function(index, type) {
        if (type)
            vm.modalPro.sintomas.splice(index, 1);
        else
            vm.modalPro.antecedentes.splice(index, 1);
    };

    vm.updateList = function() {
        solicitudesService.list().then(function(data) {
            vm.solicitudes = data;
            vm.solicitudesOrig = data;
        });
    }

    vm.view = function(obj) {
        vm.objSel = obj;
        $('#viewModal').modal();
    };

    vm.savePro = function() {
        if (vm.modalPro.afiliado)
            if (vm.modalPro.sintomas.length !== 0) {
                var sintomasCie = [];
                var sintomas = [];
                var antecedentesCie = [];
                var antecedentes = [];
                vm.modalPro.sintomas.map(function(item) {
                    if (item._id) {
                        sintomasCie.push(item._id);
                    } else {
                        sintomas.push(item.dec10);
                    }
                });
                vm.modalPro.antecedentes.map(function(item) {
                    if (item._id) {
                        antecedentesCie.push(item._id);
                    } else {
                        antecedentes.push(item.dec10);
                    }
                });

                var req = {
                    'sintomas': sintomas.toString(),
                    'sintomasCie': sintomasCie,
                    'horasSintomas': vm.modalPro.horasSintomas,
                    'minutosSintomas': vm.modalPro.minutosSintomas,
                    'afiliado': vm.modalPro.afiliado._id,
                    'domicilio': vm.modalPro.domicilioSel._id,
                    'antecedentesCie': antecedentesCie,
                    'antecedentes': antecedentes.toString()
                };

                solicitudesService.create(req).then(function(data) {
                    console.log(data);
                    vm.modalPro = {
                        sintomas: [],
                        antecedentes: []
                    };
                    vm.updateList();
                    $('#newModal').modal('hide');
                })

            } else {
                growl.error('Seleccione por lo menos un sintoma.');
            }
        else
            growl.error('Seleccione un afiliado.');
    };

    vm.updateList();
}