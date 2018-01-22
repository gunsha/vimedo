angular.module('vimedo').controller('mapaCtrl', ['$rootScope', '$scope', 'mapaService', 'solicitudesService', 'profesionalesService', '$state', 'NgMap', '$compile', mapaCtrl]);

function mapaCtrl(r, s, mapaService, solicitudesService, profesionalesService, state, NgMap, $compile) {
    var vm = this;
    vm.googleMapsUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyA02b574ia3BpLXpDZXU2gOFuQZTfC_Kks';
    vm.proSelected = {};
    vm.solSelected = state.params.solicitud;
    vm.solicitudes = [];
    vm.solicitudesOrig = [];
    vm.filterList = function() {
        var lower = vm.query.toLowerCase();
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
        vm.polylines = [];
        vm.latlngArray = [];
        vm.solicitudesMarks = [];
        vm.profesionalMark = [];
        vm.asignandoProfesional = false;
        vm.infowindows = [];
        if (!vm.solSelected)
            solicitudesService.listActive().then(function(response) {
                vm.solicitudes = response;
                vm.solicitudesOrig = response;
                $('#modalSol').modal({
                    keyboard: false
                });
            });
        else
        	solicitudesService.get(vm.solSelected).then(function(response) {
                vm.solSelected = response;
            });
        NgMap.getMap("map").then(function(map) {
            vm.map = map;
            if (vm.solSelected) {
                solMarker();
            }
        });
    }

    function solMarker(sol) {
        var icon = client + "/img/green-dot.png";
        var latlng = new google.maps.LatLng(vm.solSelected.domicilio.latitud, vm.solSelected.domicilio.longitud);
        var mark = new google.maps.Marker({
            icon: icon
        });
        mark.setPosition(latlng);
        mark.setMap(vm.map);
        vm.map.setCenter(latlng);
        vm.solicitudesMarks.push(mark);
        vm.cargarProfesionales();
    }
    vm.selectSol = function(sol) {
        vm.solSelected = sol;
        solMarker();
        $('#modalSol').modal('hide');
    }
    vm.selectPro = function() {
        vm.proSelected = this.profesional;
        s.$digest();
    }

    vm.cargarProfesionales = function() {
        profesionalesService.getList().then(function(data) {
            vm.profesionales = data;
            for (var i = 0; i < vm.profesionales.length; i++) {
                vm.profesionales[i];
                var latlng = new google.maps.LatLng(vm.profesionales[i].latitud, vm.profesionales[i].longitud);
                vm.latlngArray.push(latlng);
                var mark = new google.maps.Marker({
                    icon: {
                        url: client + "/assets_Vimedo/ic_vimedo.svg",
                        scaledSize: new google.maps.Size(40, 55)
                    },
                    profesional: vm.profesionales[i]
                });
                mark.addListener('click', vm.selectPro);
                mark.setPosition(latlng);
                mark.setMap(vm.map);
                vm.profesionalMark.push(mark);
            }
            vm.centerAndZoom();
        });
    };
}