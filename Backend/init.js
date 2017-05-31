var passport = require('passport');
var Usuario = require('../models/usuarioModel');


module.exports = function() {
	passport.serializeUser(function(usuario, done) {
		done(null, usuario.id);
  	});

  	passport.deserializeUser(function(id, done) {
    	Usuario.findById(id, function (err, usuario) {
      		done(err, usuario);
    	});
  	});
};