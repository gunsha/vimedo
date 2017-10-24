angular.module('vimedo').factory('mapaService', ['$rootScope', '$http', mapaService]);

function mapaService(r, h) {
    var service = {
        get: get
    };
    return service;

    function get() {
        return h.post(apiRoute + '/api/').then(function(resp) {
            return resp.data;
        });
    }

}