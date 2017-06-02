angular.module('vimedo').controller('indexCtrl', ['$scope', '$rootScope', 'indexService', 'solicitudesService', 'profesionalesService', '$state', '$timeout', '$compile', 'NgMap', indexCtrl]);

function indexCtrl(s, r, indexService, solicitudesService, profesionalesService, $state, t, $compile, NgMap) {

    var vm = this;
    vm.googleMapsUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyA02b574ia3BpLXpDZXU2gOFuQZTfC_Kks';

    vm.initSolicitudes = function() {
        indexService.getSolicitudes().then(function(response) {
            vm.solicitudes = response.data;
        });
    };

    vm.centrarMapa = function(lat, lng) {
        NgMap.getMap("map").then(function(map) {
            var latlng = new google.maps.LatLng(lat, lng);
            vm.map.setCenter(latlng);
        });
    };

    vm.toogleMenu = function(id) {
        $("#" + id + "Menu").toggleClass("hide");
    };

    vm.centerAndZoom = function() {
        NgMap.getMap("map").then(function(map) {
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0, LtLgLen = vm.latlngArray.length; i < LtLgLen; i++) {
                bounds.extend(vm.latlngArray[i]);
            }
            map.fitBounds(bounds);
        });
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
        solicitudesService.list().then(function(response) {
            vm.solicitudes = response;
            NgMap.getMap("map").then(function(map) {
                vm.map = map;
                for (var i = 0; i < vm.solicitudes.length; i++) {
                    var solicitud = vm.solicitudes[i];
                    solicitud.fechaAlta = moment(solicitud.fechaAlta).format("DD-MM-YYYY");
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
                    })
                    console.log('latlng ' + latlng)
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
        profesionalesService.coordenadas().then(function(response) {
            vm.coordenadas = response;
            NgMap.getMap("map").then(function(map) {

                for (var i = 0; i < vm.coordenadas.length; i++) {
                    var coordenada = vm.coordenadas[i];

                    var latlng = new google.maps.LatLng(coordenada.latitud, coordenada.longitud);
                    vm.latlngArray.push(latlng);
                    var mark = new google.maps.Marker({
                        icon: client + "/img/doctor.png",
                        profesional: coordenada.profesional
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
                            return this.infowindow.open(map, this);
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
                            return this.infowindow.open(map, this);
                        }

                    })

                    mark.setPosition(latlng);
                    mark.setMap(map);

                    vm.profesionalMark.push(mark);

                    vm.centerAndZoom();
                }

            });
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
            vm.initMap();
        });
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
}