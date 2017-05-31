	var app = angular.module("app.controllers");

app.controller("SolicitudController",['$scope','$window','$http','NgMap','$routeParams','$compile','$location',function($scope,$window,$http,NgMap,$routeParams,$compile,$location){

	// $scope.server= "http://192.168.1.33:3000";
	$scope.server= "http://localhost:3000";
	// $scope.client= "http://192.168.1.33:3000";
	$scope.client= "http://localhost:3001";
	$scope.titulo = "Administracion de Solicitudes";
	$scope.googleMapsUrl='https://maps.googleapis.com/maps/api/js?key=AIzaSyA02b574ia3BpLXpDZXU2gOFuQZTfC_Kks';
	$scope.solicitudes = [];

	$scope.sortType     = 'afiliado.personaFisica.nombre'; // set the default sort type
	$scope.sortReverse  = false;




	$scope.initMap = function() {
		$scope.polylines=[];
		$scope.latlngArray=[];
		$scope.solicitudesMarks=[];
		$scope.profesionalMark=[];
		$scope.asignandoProfesional=false;
		$scope.infowindows=[];
		bloquearPantalla();
		$http({
			url: $scope.server+'/solicitudesMedicas/',
			method: "GET",
			headers: {'Content-Type': 'application/json', 'Accept':'application/json'},
			async : true
		})
		.then(function(response) {
			$scope.solicitudes = response.data;
			NgMap.getMap("map").then(function(map) {



				for(var i=0;i<$scope.solicitudes.length;i++){
					var solicitud = $scope.solicitudes[i];
					debugger;
					solicitud.fechaAlta=moment(solicitud.fechaAlta).format("DD-MM-YYYY");
					var contentString = '<div id="content"><h5>'
						+solicitud.afiliado.personaFisica.nombre+' '+ solicitud.afiliado.personaFisica.apellido
						+'</h5><div>'+ solicitud.domicilio.calle + ' '+ solicitud.domicilio.numero +'</div><div>';


					if(solicitud.estado == 0){
						contentString+='<button type="button" class="btn btn-primary btn-xs" onclick="asignarProfesional(&quot;'+solicitud._id+'&quot;)">Asignar Prestador</button></div>';
					}
					contentString+='</div>';

					var compiledContent = $compile(contentString)($scope);
					var infowindow = new google.maps.InfoWindow({content: contentString});
					$scope.infowindows.push(infowindow);
					var icon;
					switch(solicitud.estado){
						case 0:
						icon=$scope.client+"/img/red-dot.png";
						break;
						case 1:
						icon=$scope.client+"/img/green-dot.png";
						break;
					}

					var latlng = new google.maps.LatLng(solicitud.domicilio.latitud, solicitud.domicilio.longitud);
					$scope.latlngArray.push(latlng);
					var mark = new google.maps.Marker({icon:icon,estado:solicitud.estado,solicitud:solicitud});
					mark.infowindow = infowindow;

					//finally call the explicit infowindow object
					mark.addListener('click', function() {
						debugger;
						$scope.ocultarInfoWindows();
						this.infowindow.setContent(compiledContent);
						$scope.calcularRutaSolicitud(this.solicitud);
						return this.infowindow.open(map, this);
					})

					mark.setPosition(latlng);
					mark.setMap(map);
					$scope.map.setCenter(latlng);
					$scope.solicitudesMarks.push(mark);
				}

				$scope.cargarProfesionales();

			});


		}).catch(function(e) {
			console.log(e);
			desbloquearPantalla();
		});
	};

	$scope.cargarProfesionales = function(){
		$http({
			url: $scope.server+'/coordenadas',
			method: "GET",
			headers: {'Content-Type': 'application/json', 'Accept':'application/json'},
			async : true
		})
		.then(function(response) {
			debugger;
			$scope.coordenadas = response.data;
			NgMap.getMap("map").then(function(map) {

				for(var i=0;i<$scope.coordenadas.length;i++){
					var coordenada = $scope.coordenadas[i];


					var latlng = new google.maps.LatLng(coordenada.latitud, coordenada.longitud);
					$scope.latlngArray.push(latlng);
					var mark = new google.maps.Marker({icon:$scope.client+"/img/doctor.png",profesional:coordenada.profesional});


					//finally call the explicit infowindow object
					mark.addListener('click', function() {
						$scope.ocultarInfoWindows();
						if($scope.asignandoProfesional){
							var contentString = '<div id="content"><h5>'
								+this.profesional.personaFisica.nombre+' '+ this.profesional.personaFisica.apellido
								+'</h5>'+
								'<button type="button" class="btn btn-primary btn-xs" onclick="confirmarProfesional(&quot;'+this.profesional._id+'&quot;)">Aceptar</button></div>';
								+'</div>';
							var compiledContent = $compile(contentString)($scope);
							var infowindow = new google.maps.InfoWindow({content: contentString});
							$scope.infowindows.push(infowindow);
							this.infowindow = infowindow;
							this.infowindow.setContent(compiledContent);
							return this.infowindow.open(map, this);
						}
						else{
							var contentString = '<div id="content"><h5>'
							+this.profesional.personaFisica.nombre+' '+ this.profesional.personaFisica.apellido
							+'</h5></div>';

							var compiledContent = $compile(contentString)($scope);
							var infowindow = new google.maps.InfoWindow({content: contentString});
							$scope.infowindows.push(infowindow);
							this.infowindow = infowindow;
							this.infowindow.setContent(compiledContent);
							$scope.calcularRutaProfesional(this.profesional._id);
							return this.infowindow.open(map, this);
						}

					})

					mark.setPosition(latlng);
					mark.setMap(map);

					$scope.profesionalMark.push(mark);

					$scope.centerAndZoom();
				}

			});

			desbloquearPantalla();
		}).catch(function(e) {
			console.log(e);
		});
	};

	$scope.calcularRutaSolicitud=function(solicitud){
		bloquearPantalla();

		if(solicitud.estado==0){
			desbloquearPantalla();
			return false;
		}
		//var id = $("#testJavascript").attr('idSol');
		$http({
			url: $scope.server+'/solicitudesMedicas/ruta/'+solicitud._id,
			method: "GET",
			headers: {'Content-Type': 'application/json', 'Accept':'application/json'},
			async : true
		})
		.then(function(response) {

			var ruta = response.data;

			NgMap.getMap("map").then(function(map) {
				for(var i=0;i<$scope.polylines.length;i++){
					var flightPath=$scope.polylines[i];
					flightPath.setMap(null);
				}
				$scope.polylines=[];

				for(var i=0;i<ruta.routes[0].legs.length;i++){
					var flightPlanCoordinates = [];
					var leg = ruta.routes[0].legs[i];
					for(var ii=0;ii<leg.steps.length;ii++){
						var step = leg.steps[ii];
						var points =  decodePolyline(step.polyline.points);
						for(var z=0;z<points.length;z++){
							flightPlanCoordinates.push(points[z]);
						}

					}
					var flightPath = new google.maps.Polyline({
						path: flightPlanCoordinates,
						geodesic: true,
						strokeColor: getColor(),
						strokeOpacity: 1.0,
						strokeWeight: 2
					});
					$scope.polylines.push(flightPath);
					flightPath.setMap(map);

				}

			});

			desbloquearPantalla();
		}).catch(function(e) {
			desbloquearPantalla();
			console.log(e);
		});
	};

	$scope.calcularRutaProfesional=function(id){
		bloquearPantalla();
		//var id = $("#testJavascript").attr('idSol');
		$http({
			url: $scope.server+'/solicitudesMedicas/ruta/profesional/'+id,
			method: "GET",
			headers: {'Content-Type': 'application/json', 'Accept':'application/json'},
			async : true
		})
		.then(function(response) {

			var ruta = response.data;

			NgMap.getMap("map").then(function(map) {
				for(var i=0;i<$scope.polylines.length;i++){
					var flightPath=$scope.polylines[i];
					flightPath.setMap(null);
				}
				$scope.polylines=[];

				for(var i=0;i<ruta.routes[0].legs.length;i++){
					var flightPlanCoordinates = [];
					var leg = ruta.routes[0].legs[i];
					for(var ii=0;ii<leg.steps.length;ii++){
						var step = leg.steps[ii];
						var points =  decodePolyline(step.polyline.points);
						for(var z=0;z<points.length;z++){
							flightPlanCoordinates.push(points[z]);
						}

					}
					var flightPath = new google.maps.Polyline({
						path: flightPlanCoordinates,
						geodesic: true,
						strokeColor: getColor(),
						strokeOpacity: 1.0,
						strokeWeight: 2
					});
					$scope.polylines.push(flightPath);
					flightPath.setMap(map);

				}

			});

			desbloquearPantalla();
		}).catch(function(e) {
			desbloquearPantalla();
			console.log(e);
		});
	};

	$scope.initSolicitudes = function() {

		console.log($scope.server);
		
		bloquearPantalla();
		$http({
			url: $scope.server+'/solicitudesMedicas',
			method: "GET",
			headers: {'Content-Type': 'application/json', 'Accept':'application/json'},
			async : true
		})
		.then(function(response) {
			$scope.solicitudes = response.data;
			desbloquearPantalla();
		}).catch(function(e) {
			console.log(e);
			desbloquearPantalla();
		});
	};

	$scope.centrarMapa= function(lat,lng){
		NgMap.getMap("map").then(function(map) {
			var latlng = new google.maps.LatLng(lat, lng);
			$scope.map.setCenter(latlng);
		});
	};

	$scope.centerAndZoom = function(){

		NgMap.getMap("map").then(function(map) {

			//  Create a new viewpoint bound
			var bounds = new google.maps.LatLngBounds ();
			//  Go through each...
			for (var i = 0, LtLgLen = $scope.latlngArray.length; i < LtLgLen; i++) {
				//  And increase the bounds to take this point
				bounds.extend ($scope.latlngArray[i]);
			}
			//  Fit these bounds to the map
			map.fitBounds (bounds);
		});


	};

	$scope.asignarProfesional= function(id){
		$scope.ocultarInfoWindows();
		NgMap.getMap("map").then(function(map) {
			$scope.solicitudId=id;
			$scope.asignandoProfesional=true;
			for(var i=0;i<$scope.solicitudesMarks.length;i++){
				var mark=$scope.solicitudesMarks[i];
				if(mark.solicitud._id != id){
					mark.setMap(null);
				}
			}
			for(var i=0;i<$scope.polylines.length;i++){
				var polyline=$scope.polylines[i];
				polyline.setMap(null);
			}
			$scope.polylines=[];
		});
	};

	$scope.toogleMenu=function(id){
		$("#"+id+"Menu").toggleClass("hide");
	};

	$scope.confirmarProfesional = function(profesional){
		debugger;
		bloquearPantalla();
		$scope.ocultarInfoWindows();
		var data={solicitudMedica:{_id:$scope.solicitudId},profesional:{_id:profesional}};
		$http({
			url: $scope.server+'/solicitudesMedicas/setProfesional',
			method: "POST",
			headers: {'Content-Type': 'application/json', 'Accept':'application/json'},
			async : true,
			data:data
		})
		.then(function(response) {
			$scope.initMap();
			desbloquearPantalla();
		}).catch(function(e) {
			console.log(e);
			desbloquearPantalla();
		});
	}

	$scope.ocultarInfoWindows=function(){
		for(var i=0;i<$scope.infowindows.length;i++){
			$scope.infowindows[i].close();
		}
	};

}]);
