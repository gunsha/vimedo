angular.module('vimedo').factory('profesionalesService', ['$rootScope', '$http', profesionalesService]);

function profesionalesService(r, h) {
    var service = {
        getList: getList,
        coordenadas: coordenadas,
        create: create,
        update: update,
        especialidades:especialidades
    };
    return service;

    function getList() {
        return h.get(apiRoute + '/profesionales/').then(function(resp) {
            return resp.data;
        });
    }

    function coordenadas() {
        return h.get(apiRoute + '/coordenadas/').then(function(resp) {
            return resp.data;
        });
    }

    function create(obj) {
        obj.isProfesional = true;
        return h.post(apiRoute + '/users/register',obj).then(function(resp) {
            return resp.data;
        });
    }
    function update(obj) {
        return h.put(apiRoute + '/profesionales/',obj).then(function(resp) {
            return resp.data;
        });
    }

    function especialidades() {
        return h.get(apiRoute + '/especialidades/').then(function(resp) {
            return resp.data;
        });
    }

}