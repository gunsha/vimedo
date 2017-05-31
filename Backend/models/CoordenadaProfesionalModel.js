var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var CoordenadaProfesionalSchema = new Schema({
	'profesional' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'Profesional'
	},
	'ultimaActualizacion':Date,
	'latitud' : Number,
	'longitud' : Number
});
CoordenadaProfesionalSchema.plugin(deepPopulate);
module.exports = mongoose.model('CoordenadaProfesional', CoordenadaProfesionalSchema);