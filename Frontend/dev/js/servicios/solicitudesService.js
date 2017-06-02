angular.module('vimedo').factory('solicitudesService', ['$rootScope', '$http', solicitudesService]);

function solicitudesService(r, h) {
    var service = {
        list: list,
        calcularRutaProfesional:calcularRutaProfesional,
        calcularRutaSolicitud:calcularRutaSolicitud,
        setProfesional:setProfesional
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

}