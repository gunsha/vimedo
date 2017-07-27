var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var MensajeSchema = new Schema({
	'message' : String,
	'from' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'Usuario'
	},
	'to' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'Usuario'
	},
	'solicitud' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'SolicitudMedica'
	},
	'send' : Date,
	'read' : Boolean
	
});
MensajeSchema.plugin(deepPopulate);
module.exports = mongoose.model('Mensaje', MensajeSchema);
