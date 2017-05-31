var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
//var autoIncrement = require('mongoose-auto-increment');

var GrupoFamiliarSchema = new Schema({
	'descripcion' : String
});

//GrupoFamiliarSchema.plugin(autoIncrement.plugin, 'GrupoFamiliar');
module.exports = mongoose.model('GrupoFamiliar', GrupoFamiliarSchema);
