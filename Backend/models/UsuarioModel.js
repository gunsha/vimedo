
var mongoose = require('mongoose');
require('mongoose-moment')(mongoose);
var Schema   = mongoose.Schema;
//var autoIncrement = require('mongoose-auto-increment');


var beautifyUnique = require('mongoose-beautiful-unique-validation');

var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var password = 'd6F3Efeq';

var UsuarioSchema = new Schema({
	'email' : { type: String, required: [true,'El email es obligatorio.'], unique: 'El email ya se encuentra registrado.' },
	'token' : { type: String},
	'fechaLogin' : { type: Date},
	'fechaLogout' : { type: Date},
	'password' : { type: String, required: [true,'El password es obligatorio.'] },
	'fechaAlta' : { type: Date} 
});
/*
UsuarioSchema.virtual('fechaAlta').get(function() {
  return this.fechaAlta.getTime();
});
*/
UsuarioSchema.plugin(beautifyUnique);

UsuarioSchema.pre('save', function(next) {
    var usuario = this;

    // only hash the password if it has been modified (or is new)
    if (!usuario.isModified('password')) return next();

    usuario.password = encrypt(usuario.password);
    return next();
/*
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(usuario.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            usuario.password = hash;
            next();
        });
    });*/
});

UsuarioSchema.methods.comparePassword = function(candidatePassword, cb) {
    if(decrypt(this.password)==candidatePassword){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
    /*bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });*/
};

UsuarioSchema.methods.getToken = function(cb){
    var map={};
    crypto.randomBytes(48, function(err, buffer) {
        console.log("buffer",buffer);
        var token = buffer.toString('hex');
        console.log("token",token);
        map.token=token;
        cb(token);
    });
};

var encrypt=function(text){
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
};

var decrypt =function(text){
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
};

//UsuarioSchema.plugin(autoIncrement.plugin, 'Usuario');

module.exports = mongoose.model('Usuario', UsuarioSchema);
