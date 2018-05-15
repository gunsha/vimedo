angular.module('vimedo').controller('indexCtrl', ['$scope', '$rootScope', 'indexService', 'solicitudesService', 'profesionalesService', '$state', '$timeout', '$compile', 'NgMap', 'growl', indexCtrl]);

function indexCtrl(s, r, indexService, solicitudesService, profesionalesService, state, t, $compile, NgMap, growl) {
    
    var vm = this;
    
    vm.profesionales = [];
    vm.profesionalesD = [];
    vm.profesionalesOrig = [];
    vm.solicitudes = [];
    vm.solicitudesOrig = [];
    vm.stats = {pending:0,active:0,available:0}
    vm.selectedIndex = "0";
    vm.selectedIndexP = "0";
    vm.selected;
    var directionsService = new google.maps.DirectionsService();
    vm.especialidades = [];
    
    profesionalesService.especialidades().then(function(data){
        vm.especialidades = data;
    });
    
    vm.filterListS = function() {
        var lower = vm.queryS.toLowerCase();
        vm.solicitudes = vm.solicitudesOrig
        .filter(function(i) {
            if (i.afiliado.personaFisica &&
                (i.afiliado.personaFisica.nroDocumento.toLowerCase().indexOf(lower) !== -1 ||
                i.afiliado.personaFisica.nombre.toLowerCase().indexOf(lower) !== -1 ||
                i.afiliado.personaFisica.apellido.toLowerCase().indexOf(lower) !== -1)) {
                    return i;
                }
            });
        };
        vm.filterListP = function() {
            var lower = vm.queryP.toLowerCase();
            vm.profesionales = vm.profesionalesOrig
            .filter(function(i) {
                if (i.personaFisica &&
                    (i.personaFisica.nroDocumento.toLowerCase().indexOf(lower) !== -1 ||
                    i.personaFisica.nombre.toLowerCase().indexOf(lower) !== -1 ||
                    i.personaFisica.apellido.toLowerCase().indexOf(lower) !== -1) ||
                    i.matricula.toLowerCase().indexOf(lower) !== -1) {
                        return i;
                    }
                });
            };
            vm.filterListPD = function() {
                var lower = vm.queryPD.toLowerCase();
                vm.profesionalesD = vm.profesionalesOrig
                .filter(function(i) {
                    if (i.personaFisica &&
                        (i.personaFisica.nroDocumento.toLowerCase().indexOf(lower) !== -1 ||
                        i.personaFisica.nombre.toLowerCase().indexOf(lower) !== -1 ||
                        i.personaFisica.apellido.toLowerCase().indexOf(lower) !== -1) ||
                        i.matricula.toLowerCase().indexOf(lower) !== -1) {
                            return i;
                        }
                    });
                }
                
                vm.initMap = function() {
                    vm.stats = {pending:0,active:0,available:0}
                    solicitudesService.listActive().then(function(response) {
                        vm.solicitudes = response.map(function(item){
                            item.nombreApellido = item.afiliado.personaFisica.nombre +' '+ item.afiliado.personaFisica.apellido;
                            if(item.estado === 0)
                            vm.stats.pending++;
                            if(item.estado === 1)
                            vm.stats.active++;
                            return item;
                        });
                        vm.solicitudesOrig = angular.copy(vm.solicitudes);
                    });
                    vm.cargarProfesionales();
                }
                
                
                vm.cargarProfesionales = function() {
                    profesionalesService.getList().then(function(data) {
                        vm.profesionales = data.map(function(item){
                            item.nombreApellido = item.personaFisica.nombre +' '+ item.personaFisica.apellido;
                            vm.stats.available++;
                            return item;
                        });;
                        vm.profesionalesD = angular.copy(vm.profesionales);
                        vm.profesionalesOrig = angular.copy(vm.profesionales);
                    });
                };
                
                vm.initMap();
                
                vm.vistaAsignarProfesional = function() {
                    vm.selected = vm.solicitudes[vm.selectedIndex];
                    vm.solicitudId = vm.solicitudes[vm.selectedIndex]._id;
                    vm.queryP = '';
                    vm.filterListP();
                    $('#modalPro').modal();
                    vm.calcularRutaProfesional();
                };
                
                vm.calcularRutaProfesional = function(pos) {
                    
                    for(var i = 0; i<vm.profesionales.length;i++){
                        var _profesional = vm.profesionales[i];
                        _profesional.pos = i;
                        vm.callRutaService(vm.solicitudes[vm.selectedIndex],_profesional);
                    }
                };
                
                vm.callRutaService = function(sol,pro){
                    directionsService.route(_getRequestRuta(sol,pro), function(result, status) {
                        if (status == 'OK') {
                            var ruta = result.routes[0].legs;
                            var distanciaSegundos = 0;
                            
                            for (var i = 0; i < ruta.length; i++) {
                                distanciaSegundos += ruta[i].duration.value;
                            }
                            
                            var data = _getDemoraTime(distanciaSegundos,visitaPromedio,pro.solicitudesMedicas.length);
                            vm.profesionales[pro.pos].demora = data[0];
                            vm.profesionales[pro.pos].llegada = data[1];
                            s.$apply();
                        }
                    });
                }
                
                vm.confirmarProfesional = function() {
                    var data = {
                        solicitudMedica: {
                            _id: vm.solicitudId
                        },
                        profesional: {
                            _id: vm.profesionales[vm.selectedIndexP]
                        }
                    };
                    solicitudesService.setProfesional(data).then(function() {
                        $('#modalPro').modal('hide');
                        $('.collapse').collapse('hide')
                        vm.initMap();
                        growl.success('Profesional asignado.')
                    });
                };
                
                vm.verEnMapa = function(){
                    $('.modal').modal('hide');
                    state.go('admin.mapa',{solicitud:vm.solicitudes[vm.selectedIndex]._id});
                }
                
                vm.finishSolicitud = function() {
                    vm.solSel = vm.solicitudes[vm.selectedIndex];
                    swal({
                        title: 'Cerrar la solicitud?',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Aceptar'
                    }).then(function() {
                        swal.setDefaults({
                            input: 'text',
                            confirmButtonText: 'Siguiente &rarr;',
                            showCancelButton: true,
                            animation: true,
                            progressSteps: ['1', '2']
                        })
                        
                        var steps = [{
                            title: 'Indicaciones',
                            text: 'Indicaciones para el paciente'
                        }, {
                            title: 'Observaciones',
                            text: 'Obsrvaciones de la visita'
                        }]
                        swal.queue(steps).then(function(result) {
                            swal.resetDefaults();
                            vm.solSel.indicaciones = result[0];
                            vm.solSel.observaciones = result[1];
                            solicitudesService.finalizar(vm.solSel).then(function() {
                                swal({
                                    text: 'La solicitud ha sido cerrada.',
                                    type: 'success',
                                    showCancelButton: false,
                                    confirmButtonColor: '#3085d6',
                                    confirmButtonText: 'Aceptar'
                                });
                                vm.initMap();
                            }, function() {
                                swal({
                                    title: 'Ocurrio un error.',
                                    text: 'Intente mas tarde.',
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonColor: '#3085d6',
                                    confirmButtonText: 'Aceptar'
                                });
                            })
                            
                        }, function() {
                            swal.resetDefaults();
                        })
                        
                    })
                };
                
                ///NUEVA SOLICITUD
                vm.newSolicitudModal = '';
                vm.newSol = function() {
                    vm.newSolicitud = {
                        sintomas: [],
                        antecedentes: []
                    };
                    $(vm.newSolicitudModal).modal();
                };
                vm.finishSaveSolicitud = function() {
                    vm.newSolicitud = {
                        sintomas: [],
                        antecedentes: []
                    };
                    vm.initMap();
                    $(vm.newSolicitudModal).modal('hide');
                }
            }