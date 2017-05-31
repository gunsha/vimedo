var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var Usuario = require('../models/usuarioModel');
var config = require('../_config');
//var init = require('../init');

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(usuario, done) {
        done(null, usuario.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        Usuario.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))
    // code for facebook (use('facebook', new FacebookStrategy))
    // code for twitter (use('twitter', new TwitterStrategy))

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : config.googleAuth.clientID,
        clientSecret    : config.googleAuth.clientSecret,
        callbackURL     : config.googleAuth.callbackURL,

    },

    function(token, refreshToken, profile, done) {
        console.log("token",token);
        console.log("refreshToken",refreshToken);
        console.log("profile",profile);
        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user based on their google id

            return done(null, profile);
            
            Usuario.findOne({ 'google.id' : profile.id }, function(err, usuario) {
                if (err)
                    return done(err);

                if (usuario) {

                    // if a user is found, log them in
                    return done(null, usuario);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUsuario          = new Usuario();
                    newUsuario.google={};
                    // set all of the relevant information
                    newUsuario.google.id    = profile.id;
                    newUsuario.google.token = token;
                    newUsuario.google.name  = profile.displayName;
                    newUsuario.google.email = profile.emails[0].value; // pull the first email

                    // save the user
                    newUsuario.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUsuario);
                    });
                }
            });
        });

    }));

};