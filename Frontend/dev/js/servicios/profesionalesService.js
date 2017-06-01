angular.module('vimedo').factory('profesionalesService', ['$rootScope', '$http', profesionalesService]);

function profesionalesService(r, h) {
    var service = {
        getList: getList,
        coordenadas: coordenadas
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

}