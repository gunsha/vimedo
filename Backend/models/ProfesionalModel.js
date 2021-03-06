var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var deepPopulate = require('mongoose-deep-populate')(mongoose);

var ProfesionalSchema = new Schema({
	'matricula' : String,
	'perfil':String,
	'usuario' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'Usuario'
	},
	'personaFisica' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'PersonaFisica'
	},
	'especialidad' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'Especialidad'
	},
	'generalRating':Number,
	'amabilidadRating':Number,
	'claridadRating':Number,
	'puntualidadRating':Number,
	'solicitudesMedicas' : [{
	 	type: Schema.Types.ObjectId,
	 	ref: 'SolicitudMedica'
	}],
	'latitud' : Number,
	'longitud' : Number
});

ProfesionalSchema.plugin(deepPopulate);
module.exports = mongoose.model('Profesional', ProfesionalSchema);
