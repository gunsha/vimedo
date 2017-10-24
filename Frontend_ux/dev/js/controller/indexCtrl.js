angular.module('vimedo').controller('indexCtrl', ['$scope', '$rootScope', 'indexService', 'solicitudesService', 'profesionalesService', '$state', '$timeout', '$compile', 'NgMap', 'growl', indexCtrl]);

function indexCtrl(s, r, indexService, solicitudesService, profesionalesService, $state, t, $compile, NgMap, growl) {

    var vm = this;
    vm.googleMapsUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyA02b574ia3BpLXpDZXU2gOFuQZTfC_Kks';
    vm.profesionales = [];
    vm.profesionalesD = [];
    vm.profesionalesOrig = [];
    vm.solicitudes = [];
    vm.solicitudesOrig = [];
    vm.stats = {pending:0,active:0,available:0}

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
    }
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
    }
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

    vm.centrarMapa = function(lat, lng) {
        NgMap.getMap("map").then(function(map) {
            var latlng = new google.maps.LatLng(lat, lng);
            vm.map.setCenter(latlng);
        });
    };

    vm.centerAndZoom = function() {
        // NgMap.getMap("map").then(function(map) {
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < vm.latlngArray.length; i++) {
                bounds.extend(vm.latlngArray[i]);
            }
            vm.map.fitBounds(bounds);
        // });
    };

    vm.ocultarInfoWindows = function() {
        for (var i = 0; i < vm.infowindows.length; i++) {
            vm.infowindows[i].close();
        }
    };

    vm.initMap = function() {
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
            vm.profesionales = data;
            vm.profesionalesD = data;
            vm.profesionalesOrig = data;
        });
    };

    vm.initMap();

    vm.asignarProfesional = function(id) {
        vm.ocultarInfoWindows();
        NgMap.getMap("map").then(function(map) {
            vm.solicitudId = id;
            vm.asignandoProfesional = true;
            for (var i = 0; i < vm.solicitudesMarks.length; i++) {
                var mark = vm.solicitudesMarks[i];
                if (mark.solicitud._id != id) {
                    mark.setMap(null);
                }
            }
            for (var i = 0; i < vm.polylines.length; i++) {
                var polyline = vm.polylines[i];
                polyline.setMap(null);
            }
            vm.polylines = [];
        });
    };

    vm.vistaAsignarProfesional = function(id) {
        vm.solicitudId = id;
        vm.queryP = '';
        vm.filterListP();
        $('#modalPro').modal();
    };
    vm.confirmarProfesional = function(profesional) {
        vm.ocultarInfoWindows();
        var data = {
            solicitudMedica: {
                _id: vm.solicitudId
            },
            profesional: {
                _id: profesional
            }
        };
        solicitudesService.setProfesional(data).then(function() {
            $('#modalPro').modal('hide');
            $('.collapse').collapse('hide')
            vm.initMap();
            growl.success('Profesional asignado.')
        });
    };
    vm.finishSolicitud = function(s) {
        vm.solSel = s;
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

    function decodePolyline(str, precision) {
        var index = 0,
            lat = 0,
            lng = 0,
            coordinates = [],
            shift = 0,
            result = 0,
            byte = null,
            latitude_change,
            longitude_change,
            factor = Math.pow(10, precision || 5);

        // Coordinates have variable length when encoded, so just keep
        // track of whether we've hit the end of the string. In each
        // loop iteration, a single coordinate is decoded.
        while (index < str.length) {
            {}

            // Reset shift, result, and byte
            byte = null;
            shift = 0;
            result = 0;

            do {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

            shift = result = 0;

            do {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

            lat += latitude_change;
            lng += longitude_change;

            coordinates.push({
                lat: lat / factor,
                lng: lng / factor
            });
        }

        return coordinates;
    };

    var getColor = function() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
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

function asignarProfesional(data) {
    var scope = angular.element('#accordion').scope();
    if (scope && scope.ctrl)
        scope.ctrl.asignarProfesional(data);
}

function confirmarProfesional(data) {
    var scope = angular.element('#accordion').scope();
    if (scope && scope.ctrl)
        scope.ctrl.confirmarProfesional(data);
}