var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);
//var autoIncrement = require('mongoose-auto-increment');

var SolicitudMedicaSchema = new Schema({
	'sintomas' : String,
	'horasSintomas' : Number,
	'minutosSintomas' : Number,
	'usuario' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'Usuario'
	},
	'afiliado' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'Afiliado'
	},
	'antecedentesMedicos':[{
		type: Schema.Types.ObjectId,
		ref:'AntecedenteMedico'
	}],
	'domicilio':{
		type: Schema.Types.ObjectId,
		ref:'Domicilio'
	},
	'fechaAlta':Date,
	'fechaModificacion':Date,
	'latitud':String,
	'longitud':String,
	'profesional':{
		type: Schema.Types.ObjectId,
		ref:'Profesional'
	},
	"fechaBaja":Date,
	"estado":Number
});

SolicitudMedicaSchema.plugin(deepPopulate);
module.exports = mongoose.model('SolicitudMedica', SolicitudMedicaSchema);
