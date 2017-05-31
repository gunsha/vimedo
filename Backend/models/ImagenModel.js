var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
//var autoIncrement = require('mongoose-auto-increment');

var ImagenSchema = new Schema({
	'imagenData' : String
});

//ImagenSchema.plugin(autoIncrement.plugin, 'Imagen');
module.exports = mongoose.model('Imagen', ImagenSchema);
