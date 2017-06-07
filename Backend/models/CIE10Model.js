var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var Cie10Schema = new Schema({
	'id10' : String,
	'dec10' : String,
	'grp10' : String
});

module.exports = mongoose.model('Cie10', Cie10Schema);