angular.module('app.services', [])

.factory('RegisterManager', [function(){
	
	var data = {};

	return {
		store: function(obj){
			Object.assign(data, obj);
		},
		merge: function(obj){
			angular.merge(data, obj);
		},
		clean: function(){
			data = {};
		},
		data: function(){
			return data;
		},
		lu: function(){
			return data.loggedUser;
		},
		lup: function(){
			var u = data.loggedUser;
			return (u.afiliado!=undefined) ? u.afiliado.personaFisica : u.profesional.personaFisica;
		},
		lud: function(){
			return this.lup().domicilios;
		}
	};
}])

.factory('StateManager', ['$ionicHistory', '$state', function($ionicHistory, $state){
	return {
		goNoCache : function(state){
			$ionicHistory.clearCache().then(function(){ $state.go(state) })
		}
	};
}])

.factory('MapManager', ['$ionicHistory', '$state', function($ionicHistory, $state){
	var i = {};
	return  {
		init : function(lat, long) {

			if(lat instanceof google.maps.LatLng){
				long = lat.lng()
				lat = lat.lat()
			}

			var myLatlng;
			if(lat==undefined||long==undefined){
				navigator.geolocation.getCurrentPosition(function(pos) {
					lat = pos.coords.latitude;
					long = pos.coords.longitude;
		        });
			}

			i.myLatlng = new google.maps.LatLng(lat, long);
	 
	        i.mapOptions = {
	            center: i.myLatlng,
	            zoom: 16,
	            mapTypeId: google.maps.MapTypeId.ROADMAP
	        };

	        i.mapDiv = document.getElementById("map");
	    	i.mapDiv.style.display = 'block';

	        i.map = new google.maps.Map(i.mapDiv, i.mapOptions);

	        i.markerOptions = {
                position: i.myLatlng,
                map: i.map,
                title: "Marker"
            };

            i.marker = new google.maps.Marker(i.markerOptions);


	    },
	    autocomplete: function(htmlElementId){
	        var options = { componentRestrictions: { country: 'ar' }, types: ['geocode'] }
	        var input = document.getElementById(htmlElementId);
	        var autocomplete = new google.maps.places.Autocomplete(input, options);

	        autocomplete.mm = this;

	        autocomplete.addListener('place_changed', function(){
		    	var place = autocomplete.getPlace();
		    	console.log(place);
		    	if(place.geometry!=undefined)autocomplete.mm.init(place.geometry.location);
		    });
	    },
	    hide: function(){
	    	if(i.mapDiv!=undefined)i.mapDiv.style.display = 'none';
	    }
	};
}])
.service('BlankService', [function(){

}])

