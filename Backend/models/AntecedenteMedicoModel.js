var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var AntecedenteMedicoSchema = new Schema({
	'nombre' : String
});

module.exports = mongoose.model('AntecedenteMedico', AntecedenteMedicoSchema);