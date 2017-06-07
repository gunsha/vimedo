angular.module('vimedo').factory('solicitudesService', ['$rootScope', '$http', solicitudesService]);

function solicitudesService(r, h) {
    var service = {
        list: list,
        calcularRutaProfesional:calcularRutaProfesional,
        calcularRutaSolicitud:calcularRutaSolicitud,
        setProfesional:setProfesional,
        autocompleteCie10: cieAutocomplete,
        autocompleteAfiliado: autocompleteAfiliado,
        create: create

    };
    return service;

    function list() {
        return h.get(apiRoute + '/solicitudesMedicas/').then(function(resp) {
            return resp.data;
        });
    }
    function calcularRutaProfesional(id) {
        return h.get(apiRoute + '/solicitudesMedicas/ruta/profesional/'+id).then(function(resp) {
            return resp.data;
        });
    }
    function calcularRutaSolicitud(id) {
        return h.get(apiRoute + '/solicitudesMedicas/ruta/'+id).then(function(resp) {
            return resp.data;
        });
    }

    function setProfesional(obj) {
        return h.post(apiRoute + '/solicitudesMedicas/setProfesional',obj).then(function(resp) {
            return resp.data;
        });
    }

    function cieAutocomplete(term){
        return h.get(apiRoute + '/antecedentesMedicos/cieautocomplete?term='+term).then(function(resp) {
            return resp.data;
        });
    }

    function autocompleteAfiliado(term){
        return h.get(apiRoute + '/antecedentesMedicos/afiliadoautocomplete?term='+term).then(function(resp) {
            return resp.data;
        });
    }

    function create(obj){
        return h.post(apiRoute + '/solicitudesMedicas/',obj).then(function(resp) {
            return resp.data;
        });
    }

}