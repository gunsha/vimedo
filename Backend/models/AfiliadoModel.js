var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var AfiliadoSchema = new Schema({
	'credencial' : String,
	'usuario' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'Usuario'
	},
	'personaFisica' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'PersonaFisica'
	},
	'grupoFamiliar' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'GrupoFamiliar'
	},
	'prepaga':{
		type: Schema.Types.ObjectId,
	 	ref: 'Prepaga'
	}
});
AfiliadoSchema.plugin(deepPopulate);
module.exports = mongoose.model('Afiliado', AfiliadoSchema);
