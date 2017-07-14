angular.module('vimedo').controller('indexCtrl', ['$scope', '$rootScope', 'indexService', 'solicitudesService', 'profesionalesService', '$state', '$timeout', '$compile', 'NgMap', 'growl', indexCtrl]);

function indexCtrl(s, r, indexService, solicitudesService, profesionalesService, $state, t, $compile, NgMap, growl) {

    var vm = this;
    vm.googleMapsUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyA02b574ia3BpLXpDZXU2gOFuQZTfC_Kks';
    vm.profesionales = [];
    vm.profesionalesD = [];
    vm.profesionalesOrig = [];
    vm.solicitudes = [];
    vm.solicitudesOrig = [];

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

    vm.calcularRutaProfesional = function(id) {
        solicitudesService.calcularRutaProfesional(id)
            .then(function(response) {

                var ruta = response;
                NgMap.getMap("map").then(function(map) {
                    for (var i = 0; i < vm.polylines.length; i++) {
                        vm.polylines[i].setMap(null);
                    }
                    vm.polylines = [];

                    for (var i = 0; i < ruta.routes[0].legs.length; i++) {
                        var flightPlanCoordinates = [];
                        var leg = ruta.routes[0].legs[i];
                        for (var ii = 0; ii < leg.steps.length; ii++) {
                            var step = leg.steps[ii];
                            var points = decodePolyline(step.polyline.points);
                            for (var z = 0; z < points.length; z++) {
                                flightPlanCoordinates.push(points[z]);
                            }
                        }
                        var flightPath = new google.maps.Polyline({
                            path: flightPlanCoordinates,
                            geodesic: true,
                            strokeColor: getColor(),
                            strokeOpacity: 1.0,
                            strokeWeight: 2
                        });
                        vm.polylines.push(flightPath);
                        flightPath.setMap(map);

                    }

                });
            });
    };

    vm.initMap = function() {
        vm.polylines = [];
        vm.latlngArray = [];
        vm.solicitudesMarks = [];
        vm.profesionalMark = [];
        vm.asignandoProfesional = false;
        vm.infowindows = [];
        solicitudesService.listActive().then(function(response) {
            vm.solicitudes = response;
            vm.solicitudesOrig = response;
            NgMap.getMap("map").then(function(map) {
                vm.map = map;
                for (var i = 0; i < vm.solicitudes.length; i++) {
                    var solicitud = vm.solicitudes[i];
                    var contentString = '<div id="content"><h5>' +
                        solicitud.afiliado.personaFisica.nombre + ' ' + solicitud.afiliado.personaFisica.apellido +
                        '</h5><div>' + solicitud.domicilio.calle + ' ' + solicitud.domicilio.numero + '</div><div>';
                    if (solicitud.estado == 0) {
                        contentString += '<button type="button" class="btn btn-primary btn-xs" onclick="asignarProfesional(&quot;' + solicitud._id + '&quot;)">Asignar Prestador</button></div>';
                    }
                    contentString += '</div>';
                    var compiledContent = $compile(contentString)(vm);
                    var infowindow = new google.maps.InfoWindow({
                        content: contentString
                    });
                    vm.infowindows.push(infowindow);
                    var icon;
                    switch (solicitud.estado) {
                        case 0:
                            icon = client + "/img/red-dot.png";
                            break;
                        case 1:
                            icon = client + "/img/green-dot.png";
                            break;
                    }
                    var latlng = new google.maps.LatLng(solicitud.domicilio.latitud, solicitud.domicilio.longitud);
                    vm.latlngArray.push(latlng);
                    var mark = new google.maps.Marker({
                        icon: icon,
                        estado: solicitud.estado,
                        solicitud: solicitud
                    });
                    mark.infowindow = infowindow;

                    //finally call the explicit infowindow object
                    mark.addListener('click', function() {
                        // vm.ocultarInfoWindows();
                        this.infowindow.setContent(compiledContent);
                        // vm.calcularRutaSolicitud(this.solicitud);
                        return this.infowindow.open(map, this);
                    });
                    mark.setPosition(latlng);
                    mark.setMap(map);
                    vm.map.setCenter(latlng);
                    vm.solicitudesMarks.push(mark);
                }
                vm.cargarProfesionales();
            });
        });
    }

    vm.cargarProfesionales = function() {
        profesionalesService.getList().then(function(data) {
            vm.profesionales = data;
            vm.profesionalesD = data;
            vm.profesionalesOrig = data;



            for (var i = 0; i < vm.profesionalesOrig.length; i++) {
                vm.profesionalesOrig[i];

                var latlng = new google.maps.LatLng(vm.profesionalesOrig[i].latitud, vm.profesionalesOrig[i].longitud);
                vm.latlngArray.push(latlng);
                var mark = new google.maps.Marker({
                    icon: client + "/img/doctor.png",
                    profesional: vm.profesionalesOrig[i]
                });


                //finally call the explicit infowindow object
                mark.addListener('click', function() {
                    vm.ocultarInfoWindows();
                    if (vm.asignandoProfesional) {
                        var contentString = '<div id="content"><h5>' +
                            this.profesional.personaFisica.nombre + ' ' + this.profesional.personaFisica.apellido +
                            '</h5>' +
                            '<button type="button" class="btn btn-primary btn-xs" onclick="confirmarProfesional(&quot;' + this.profesional._id + '&quot;)">Aceptar</button></div>'; +
                        '</div>';
                        var compiledContent = $compile(contentString)(s);
                        var infowindow = new google.maps.InfoWindow({
                            content: contentString
                        });
                        vm.infowindows.push(infowindow);
                        this.infowindow = infowindow;
                        this.infowindow.setContent(compiledContent);
                        return this.infowindow.open(vm.map, this);
                    } else {
                        var contentString = '<div id="content"><h5>' +
                            this.profesional.personaFisica.nombre + ' ' + this.profesional.personaFisica.apellido +
                            '</h5></div>';

                        var compiledContent = $compile(contentString)(s);
                        var infowindow = new google.maps.InfoWindow({
                            content: contentString
                        });
                        vm.infowindows.push(infowindow);
                        this.infowindow = infowindow;
                        this.infowindow.setContent(compiledContent);
                        vm.calcularRutaProfesional(this.profesional._id);
                        return this.infowindow.open(vm.map, this);
                    }

                })

                mark.setPosition(latlng);
                mark.setMap(vm.map);

                vm.profesionalMark.push(mark);

                
            }
            vm.centerAndZoom();

        });
    };
    vm.calcularRutaSolicitud = function(solicitud) {
        if (solicitud.estado === 0) {
            return false;
        }
        solicitudesService.calcularRutaSolicitud(solicitud._id).then(function(response) {
            var ruta = response;
            NgMap.getMap("map").then(function(map) {
                for (var i = 0; i < vm.polylines.length; i++) {
                    vm.polylines[i].setMap(null);
                }
                vm.polylines = [];

                for (var i = 0; i < ruta.routes[0].legs.length; i++) {
                    var flightPlanCoordinates = [];
                    var leg = ruta.routes[0].legs[i];
                    for (var ii = 0; ii < leg.steps.length; ii++) {
                        var step = leg.steps[ii];
                        var points = decodePolyline(step.polyline.points);
                        for (var z = 0; z < points.length; z++) {
                            flightPlanCoordinates.push(points[z]);
                        }

                    }
                    var flightPath = new google.maps.Polyline({
                        path: flightPlanCoordinates,
                        geodesic: true,
                        strokeColor: getColor(),
                        strokeOpacity: 1.0,
                        strokeWeight: 2
                    });
                    vm.polylines.push(flightPath);
                    flightPath.setMap(map);
                }
            });

        });
    };

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