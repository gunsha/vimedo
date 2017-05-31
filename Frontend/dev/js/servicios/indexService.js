angular.module('vimedo').factory('indexService', ['$rootScope','$http',indexService]);

function indexService(r,h) {
    var service = {
        getSolicitudes: solicitudes
    };

    return service;

    function solicitudes(){
    	return h.get(apiRoute +'/solicitudesMedicas').then(function(resp){
    		return resp.data;
    	});

    }
}