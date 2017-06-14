angular.module('vimedo')
    .component('modalNuevaSolicitud', {
        templateUrl: './components/modal-nueva-solicitud.html',
        //transclude: true,
        bindings: {
            modal: '&',
            obj: '<',
            finishAction: '&'
        },
        controller: ['solicitudesService', 'growl', function(solicitudesService, growl) {

            var vm = this;

            this.$onInit = function() {
                vm.uniqueId = String(performance.now()).replace('.', '');
                vm.modal({
                    modal: '#modal_' + vm.uniqueId
                });
            };

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
                        vm.obj.antecedentes.push(item);
                    } else {
                        vm.obj.sintomas.push(item);
                    }
                }
                if (!item && ((!type && vm.asyncSelected !== '') || (type && vm.asyncSelectedA !== ''))) {
                    if (type) {
                        vm.obj.antecedentes.push({
                            dec10: vm.asyncSelectedA
                        });
                    } else {
                        vm.obj.sintomas.push({
                            dec10: vm.asyncSelected
                        });
                    }
                }
                vm.asyncSelected = '';
                vm.asyncSelectedA = '';
            };

            vm.removeSintoma = function(index, type) {
                if (type) {
                    vm.obj.antecedentes.splice(index, 1);
                } else {
                    vm.obj.sintomas.splice(index, 1);
                }
            };
            vm.savePro = function() {
                if (vm.obj.afiliado)
                    if (vm.obj.domicilioSel) {
                        if (vm.obj.sintomas && vm.obj.sintomas.length !== 0) {
                            var sintomasCie = [];
                            var sintomas = [];
                            var antecedentesCie = [];
                            var antecedentes = [];
                            vm.obj.sintomas.map(function(item) {
                                if (item._id) {
                                    sintomasCie.push(item._id);
                                } else {
                                    sintomas.push(item.dec10);
                                }
                            });
                            vm.obj.antecedentes.map(function(item) {
                                if (item._id) {
                                    antecedentesCie.push(item._id);
                                } else {
                                    antecedentes.push(item.dec10);
                                }
                            });

                            var req = {
                                'sintomas': sintomas.toString(),
                                'sintomasCie': sintomasCie,
                                'horasSintomas': vm.obj.horasSintomas ? vm.obj.horasSintomas : 0,
                                'minutosSintomas': vm.obj.minutosSintomas ? vm.obj.minutosSintomas : 0,
                                'afiliado': vm.obj.afiliado._id,
                                'domicilio': vm.obj.domicilioSel._id,
                                'antecedentesCie': antecedentesCie,
                                'antecedentes': antecedentes.toString()
                            };

                            solicitudesService.create(req).then(function() {
                                vm.finishAction();
                            })
                        } else {
                            growl.error('Seleccione por lo menos un sintoma.');
                        }
                    } else {
                        growl.error('Seleccione por lo menos un domicilio.');
                    }
                else
                    growl.error('Seleccione un afiliado.');
            };

        }]
    });