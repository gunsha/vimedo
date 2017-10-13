angular.module('vimedo').controller('navCtrl', ['$scope','$rootScope','$location',
'$anchorScroll' , 'navService', '$state', navCtrl]);

function navCtrl(s, r, $location, $anchorScroll, navService, state){

    var vm = this;
    // vm.user = r.user;
    vm.logout = function(){
      r.user = false;
    };

    vm.navigate = function(section){
    	if(state.name !== 'app')
    		state.go('app');
    	$('html, body').animate({
            scrollTop: $("#"+section).offset().top - 67
        }, 1000);
    };
    
}