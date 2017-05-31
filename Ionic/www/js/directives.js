	angular.module('app.directives', [])

.directive('blankDirective', [function(){

}])

.directive('solicitud', [function(){
	return {
		template: 'Solicitud sintomas: {{solicitud.sintomas}}'
	};
}])

.directive('domicilio', [function(){
	return {
		controller: 'perfilCtrl',
		restrict: 'E', // Element directive
		scope: {
			d: '=data',
			m: '=model',
			callBack: '&'
		},
		template: `
			<ion-radio class="item wrap" ng-value="'{{d._id}}'" ng-model="m"  ng-click="showDir('{{d._id}}')">
		          {{d.calle}} {{d.numero}}, {{d.localidad}}<br/>
		          entre: {{d.entrecalles}}
			</ion-radio>`,
		link: function(scope, iElement, iAttrs) {
	      // scope.d.principal
	      console.log(scope.d == scope.m );
	    }
	};
}])


.directive('domicilioradio', [function(){
	return {
		controller: 'solicitudNewCtrl',
		restrict: 'E', // Element directive
		scope: {
			d: '=data',
			callBack: '&'
		},
		template: `
			<ion-radio ng-value="'{{d._id}}'" ng-model="m">
			  <div class="item wrap item-icon-left" >
				<i class="icon ion-home"></i>
		          {{d.calle}} {{d.numero}}, {{d.localidad}}<br/>
		          entre: {{d.entrecalles}}
		      </div>
			</ion-radio>`
	};
}])




		



.directive('mensaje', [function(){
	return {
		restrict: 'E',
		scope: {
			m: '=data',
			callBack: '&'
		},
		template: `
		<div class="card">
		  <p style="margin:5px">
		    from: 
		    <strong>{{m.sender}}</strong>
		    at:
		    <span style="font-style: italic; font-size: 11px">{{m.time}}</span>
		  </p>
		  <div class="item item-text-wrap" style="white-space: pre-line;">{{m.body}}</div>
		</div>`
	};
}])

      
