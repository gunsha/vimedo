angular.module('vimedo').factory('solicitudesService', ['$rootScope', '$http', solicitudesService]);

function solicitudesService(r, h) {
    var service = {
        list: list,
        calcularRutaProfesional:calcularRutaProfesional
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

}