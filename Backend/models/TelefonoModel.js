var mongoose = require('mongoose');var Schema   = mongoose.Schema;//var autoIncrement = require('mongoose-auto-increment');var TelefonoSchema = new Schema({	'codigoArea' : Number,	'numero' : Number});//TelefonoSchema.plugin(autoIncrement.plugin, 'Telefono');module.exports = mongoose.model('Telefono', TelefonoSchema);