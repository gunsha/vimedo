angular.module('vimedo').factory('pacientesService', ['$rootScope', '$http', pacientesService]);

function pacientesService(r, h) {
    var service = {
        list: list,
        get: get,
        create: create,
        update: update,
        remove: remove
    };
    return service;

    function list() {
        return h.get(apiRoute + '/afiliados/').then(function(resp) {
            return resp.data;
        });
    }

    function get(obj) {
        return h.get(apiRoute + '/afiliados/' + obj._id).then(function(resp) {
            return resp.data;
        });
    }

    function create(obj) {
        return h.post(apiRoute + '/afiliados/',obj).then(function(resp) {
            return resp.data;
        });
    }

    function update(obj) {
        return h.put(apiRoute + '/afiliados/',obj).then(function(resp) {
            return resp.data;
        });
    }

    function remove(obj) {
        return h.delete(apiRoute + '/afiliados/' + obj._id).then(function(resp) {
            return resp.data;
        });
    }

}