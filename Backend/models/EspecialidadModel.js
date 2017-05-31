var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var EspecialidadSchema = new Schema({
	'nombre' : String
});

module.exports = mongoose.model('Especialidad', EspecialidadSchema);
