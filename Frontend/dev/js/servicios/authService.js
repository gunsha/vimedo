angular.module('vimedo')
.factory('authService', ['$rootScope','$http', authService]);

function authService(r,h) {
    var service = {
        login: login,
        reset: reset,
        forgot:forgot,
        signUp:signUp
    };
    return service;

    function login(cred) {  
      return h({method:'POST',url:apiRoute+'/users/login',data:cred,skipAuthorization: true}).then(function(resp){
      		return resp.data;
      });
    }

    function signUp(cred,isPro) {  
      if(isPro){
        cred.isProfesional = isPro;
      }else{
        cred.afiliado = cred.personaFisica;  
      }      
      return h({method:'POST',url:apiRoute+'/users/register',data:cred,skipAuthorization: true}).then(function(resp){
          return resp.data;
      });
    }

    function forgot(cred) {
      return h({method:'POST',url:apiRoute+'/api/auth/forgot',data:cred,skipAuthorization: true}).then(function(resp){
          return resp.data;
      });
    }

    function reset(cred) {
      return h({method:'POST',url:apiRoute+'/api/auth/resetPassword',data:cred,skipAuthorization: true}).then(function(resp){
          return resp.data;
      });
    }
}