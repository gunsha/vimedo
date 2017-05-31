var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
//var autoIncrement = require('mongoose-auto-increment');

var PrepagaSchema = new Schema({
	'nombre' : String
});

//PrepagaSchema.plugin(autoIncrement.plugin, 'Prepaga');
module.exports = mongoose.model('Prepaga', PrepagaSchema);