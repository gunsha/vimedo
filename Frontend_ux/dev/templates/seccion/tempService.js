angular.module('vimedo').factory('<%= camelCaseName %>Service', ['$rootScope', '$http', <%= camelCaseName %>Service]);

function <%= camelCaseName %>Service(r, h) {
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