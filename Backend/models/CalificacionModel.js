var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var CalificacionSchema = new Schema({
	'profesional' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'Profesional'
	},
	'usuario' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'Usuario'
	},
	'generalRating':Number,
	'amabilidadRating':Number,
	'claridadRating':Number,
	'puntualidadRating':Number
});

module.exports = mongoose.model('Calificacion', CalificacionSchema);