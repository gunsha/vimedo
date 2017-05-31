angular.module('vimedo')
.component('<%= camelCaseName %>', {
	templateUrl: './components/<%= name %>.html',
	//transclude: true,
	bindings: {
		//lista: '='
	},
	controller: function() {
	    
	    var vm = this;

	    this.$onInit = function() {
	      this.uniqueId = String(performance.now()).replace('.','');
	    };
	  }
});