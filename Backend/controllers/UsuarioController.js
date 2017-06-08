var UsuarioModel = require('../models/UsuarioModel.js');
var AfiliadoModel = require('../models/AfiliadoModel.js');
var AdminModel = require('../models/AdminModel.js');
var ProfesionalModel = require('../models/ProfesionalModel.js');
var GrupoFamiliarModel = require('../models/GrupoFamiliarModel.js');
var PersonaFisicaModel = require('../models/PersonaFisicaModel.js');
var DomicilioModel = require('../models/DomicilioModel.js');
var ImagenModel = require('../models/ImagenModel.js');
var TelefonoModel = require('../models/TelefonoModel.js');
var SolicitudMedicaModel = require('../models/SolicitudMedicaModel.js');
var EspecialidadModel = require('../models/EspecialidadModel.js');
var http = require('http');
var Moment = require('moment');
var nJwt = require('njwt');
var secureRandom = require('secure-random');

var signingKey = secureRandom(256, {
    type: 'Buffer'
}); // Create a highly random byte array of 256 bytes 

/**
 * UsuarioController.js
 *
 * @description :: Server-side logic for managing Usuarios.
 
 */
module.exports = {


    testfunc: function(req, res) {
        console.log(req.body);

    },

    /**
     * UsuarioController.list()
     */
    list: function(req, res) {
        UsuarioModel.find(function(err, Usuarios) {
            if (err) {
                return res.status(404).json({
                    message: 'Error when getting Usuario.',
                    error: err
                });
            }
            return res.json(Usuarios);
        });
    },

    /**
     * UsuarioController.show()
     */
    show: function(req, res) {
        var id = req.params.id;
        UsuarioModel.findOne({
            _id: id
        }, function(err, Usuario) {
            if (err) {
                return res.status(404).json({
                    message: 'Error when getting Usuario.',
                    error: err
                });
            }
            if (!Usuario) {
                return res.status(404).json({
                    message: 'No such Usuario'
                });
            }
            return res.json(Usuario);
        });
    },
    /**
     * UsuarioController.create()
     */
    createAdmin: function(req, res) {

        var Usuario = new UsuarioModel({
            email: req.body.email,
            password: req.body.password,
            fecha_alta: new Moment()
        });

        Usuario.save(function(err, usuario) {
            if (err) {
                return res.status(404).json({
                    message: 'Error when creating Usuario',
                    error: err
                });
            } else {

                var PersonaFisica = new PersonaFisicaModel({
                    nombre: req.body.nombre,
                    apellido: req.body.apellido,
                    nacimiento: new Moment(req.body.nacimiento),
                    tipoDocumento: req.body.tipo_documento,
                    nroDocumento: req.body.nro_documento
                });

                PersonaFisica.save(function(err, personaFisica) {
                    if (err) {
                        return res.status(404).json({
                            message: 'Error when creating PersonaFisica',
                            error: err
                        });
                    } else {
                        var Admin = new AdminModel({
                            usuario: usuario._id,
                            personaFisica: personaFisica._id,
                        });

                        Admin.save(function(err, admin) {
                            if (err) {
                                return res.status(404).json({
                                    message: 'Error when creating Admin',
                                    error: err
                                });
                            } else {
                                return res.status(200).json({
                                    Admin: Admin,
                                    Usuario: usuario,
                                    PersonaFisica: personaFisica
                                });
                            }
                        });
                    }
                });
            }
        });
    },
    /**
     * UsuarioController.create()
     */
    createAfiliado: function(req, res) {

        if (req.body.credencial == null) {
            var errorMsj = 'La credencial no puede ser null';
            return res.status(404).json({
                message: 'Error al dar de alta el usuario.',
                error: errorMsj
            });
        }

        AfiliadoModel.findOne({
            credencial: req.body.credencial
        }, function(err, afiliadoSearch) {
            if (err) {
                return res.status(404).json({
                    message: 'Error when getting Afiliado.',
                    error: err
                });
            }
            if (afiliadoSearch) {
                return res.status(404).json({
                    message: 'La credencial ya se encuentra registrada.'
                });
            } else {
                var Usuario = new UsuarioModel({
                    email: req.body.email,
                    password: req.body.password,
                    fecha_alta: new Moment()
                });

                var url = "http://localhost:8008/socios/" + req.body.credencial;
                var request = http.get(url, function(response) {
                    // Continuously update stream with data
                    var body = '';
                    var statusCode = response.statusCode;
                    response.on('data', function(d) {
                        body += d;
                    });
                    response.on('end', function() {
                        if (statusCode == 200) {
                            var afiliadoRest = JSON.parse(body);
                            if (afiliadoRest) {
                                Usuario.save(function(err, usuario) {
                                    if (err) {
                                        return res.status(404).json({
                                            message: 'Error when creating Usuario',
                                            error: err
                                        });
                                    } else {

                                        var GrupoFamiliar = new GrupoFamiliarModel({
                                            descripcion: afiliadoRest.apellido
                                        });

                                        GrupoFamiliar.save(function(err, grupoFamiliar) {
                                            if (err) {
                                                return res.status(404).json({
                                                    message: 'Error when creating GrupoFamiliar',
                                                    error: err
                                                });
                                            } else {
                                                var PersonaFisica = new PersonaFisicaModel({
                                                    nombre: afiliadoRest.nombre,
                                                    apellido: afiliadoRest.apellido,
                                                    nacimiento: new Moment(afiliadoRest.nacimiento),
                                                    tipo_documento: afiliadoRest.tipo_documento,
                                                    nro_documento: afiliadoRest.nro_documento
                                                });

                                                PersonaFisica.save(function(err, personaFisica) {
                                                    if (err) {
                                                        return res.status(404).json({
                                                            message: 'Error when creating PersonaFisica',
                                                            error: err
                                                        });
                                                    } else {
                                                        var Afiliado = new AfiliadoModel({
                                                            credencial: req.body.credencial,
                                                            usuario: usuario._id,
                                                            personaFisica: personaFisica._id,
                                                            grupoFamiliar: grupoFamiliar._id
                                                        });

                                                        Afiliado.save(function(err, afiliado) {
                                                            if (err) {
                                                                return res.status(404).json({
                                                                    message: 'Error when creating Afiliado',
                                                                    error: err
                                                                });
                                                            } else {
                                                                var listadoGrupo = [];
                                                                for (var i = 0; i < afiliadoRest.grupoFamiliar.length; i++) {
                                                                    var persona = {};
                                                                    persona.nombre = afiliadoRest.grupoFamiliar[i].nombre;
                                                                    persona.apellido = afiliadoRest.grupoFamiliar[i].apellido;
                                                                    persona.nacimiento = new Moment(afiliadoRest.grupoFamiliar[i].nacimiento);
                                                                    persona.tipo_documento = afiliadoRest.grupoFamiliar[i].tipo_documento;
                                                                    persona.nro_documento = afiliadoRest.grupoFamiliar[i].nro_documento;
                                                                    listadoGrupo.push(persona);
                                                                }

                                                                PersonaFisicaModel.create(listadoGrupo, function(err, personasFisicas) {
                                                                    return res.status(200).json({
                                                                        Usuario: usuario,
                                                                        Afiliado: afiliado,
                                                                        PersonaFisica: personaFisica,
                                                                        listadoGrupo: personasFisicas
                                                                    });
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });



                                    }

                                });
                            } else {
                                var errorMsj = 'No se ha encontrado la credencial ' + req.body.credencial;
                                return res.status(404).json({
                                    message: 'Error al dar de alta el usuario.',
                                    error: errorMsj
                                });
                            }
                        } else {
                            return res.status(statusCode).json({
                                message: 'Error al validar credencial.',
                                error: body
                            });
                        }
                    });
                    response.on('error', function() {
                        return res.status(404).json({
                            message: 'Error al validar credencial.',
                            error: err
                        });
                    });
                });
                request.on('error', function(err) {
                    return res.status(404).json({
                        message: 'Error al validar credencial.',
                        error: err
                    });
                });
            }
        });
    },

    createAfiliado2: function(req, res) {
        var self = this;
        if (req.body.credencial == null) {
            var errorMsj = 'La credencial no puede ser null';
            return res.status(400).json({
                message: errorMsj
            });
        }
        AfiliadoModel.findOne({
            credencial: req.body.credencial
        }, function(err, afiliado) {
            if (err) {
                return res.status(404).json({
                    message: 'Error al crear el usuario.',
                    error: err
                });
            }
            if (afiliado && afiliado.usuario != null) {
                return res.status(404).json({
                    message: 'La credencial ya se encuentra registrada.'
                });
            } else {
                var Usuario = new UsuarioModel({
                    email: req.body.email,
                    password: req.body.password ? req.body.password : req.body.credencial,
                    fechaAlta: Date.now()
                });
                var url = "http://localhost:8008/socios/" + req.body.credencial;

                // var request = http.get(url, function(response) {
                // CONTINUOUSLY update stream with data
                // var body = '';
                // var statusCode = response.statusCode;
                // response.on('data', function(d) {
                //     body += d;
                // });
                // response.on('end', function() {
                // if (statusCode == 200) {
                // var afiliadoRest = JSON.parse(body);
                var afiliadoRest = req.body.afiliado;
                if (afiliadoRest) {
                    Usuario.save(function(err, usuario) {
                        if (err) {
                            return res.status(404).json({
                                message: err
                            });
                        } else {
                            var afiliadoData = {
                                credencial: req.body.credencial,
                                usuario: usuario._id
                            };
                            AfiliadoModel.findOneAndUpdate({
                                credencial: req.body.credencial
                            }, {
                                $set: afiliadoData
                            }, {
                                upsert: true,
                                new: true
                            }, function(err, afiliado) {
                                console.log(err);
                                if (afiliado.grupoFamiliar == null) {
                                    var PersonaFisica = new PersonaFisicaModel({
                                        nombre: afiliadoRest.nombre,
                                        apellido: afiliadoRest.apellido,
                                        fechaNacimiento: new Date(afiliadoRest.nacimiento),
                                        tipoDocumento: afiliadoRest.tipo_documento,
                                        nroDocumento: afiliadoRest.nro_documento,
                                        telefonos: afiliadoRest.telefonos
                                    });
                                    var GrupoFamiliar = new GrupoFamiliarModel({
                                        descripcion: afiliadoRest.apellido
                                    });

                                    DomicilioModel.create(afiliadoRest.domicilios, function(err, resp) { //mock para asociar domicilios
                                        console.log('resp');
                                        for (var i = 0; i < resp.length; i++) {
                                            PersonaFisica.domicilios.push(resp[i]._id);
                                        }
                                        ImagenModel.find({}, function(err, imagenes) { //mock para asociar imagen
                                            if (imagenes) {
                                                PersonaFisica.imagen = imagenes[0]._id;
                                            }
                                                PersonaFisica.save(function(err, personaFisica) {
                                                    afiliado.personaFisica = personaFisica._id;
                                                    afiliado.save(function(err, afiliado) {
                                                        if (err) {
                                                            console.log(err)
                                                            return res.status(400);
                                                        }

                                                        return res.status(200).json({
                                                            status: 'ok'
                                                        });
                                                    });

                                                });
                                        });
                                    });

                                } else {
                                    /*el usuario no esta registrado pero si alguien de su entorno familiar*/
                                    AfiliadoModel.find({
                                        grupoFamiliar: afiliado.grupoFamiliar,
                                        credencial: {
                                            $ne: afiliado.credencial
                                        }
                                    }).populate("personaFisica").exec(function(err, afiliados) {


                                    });
                                }
                            });
                        }
                    });
                } else {
                    var errorMsj = 'No se ha encontrado la credencial ' + req.body.credencial;
                    return res.status(404).json({
                        message: 'Error al crear el usuario.',
                        error: errorMsj
                    });
                }
                // } else {
                //     return res.status(statusCode).json({
                //         message: 'Error al validar credencial.',
                //         error: body
                //     });
                // }
                // });
                // response.on('error', function() {
                //     return res.status(404).json({
                //         message: 'Error al validar credencial.',
                //         error: err
                //     });
                // });
                // });
                // request.on('error', function(err) {
                //     return res.status(404).json({
                //         message: 'Error al validar credencial.',
                //         error: err
                //     });
                // });
            }
        });
    },

    getElementInArray: function(array, params) {
        var element;
        for (var i = 0; i < array.length; i++) {
            element = array[i];
            var isResult = false;
            for (var ii = 0; ii < params.length; ii++) {
                isResult = (element[params[ii].attr] == params[ii].val) ? true : false;
                if (!isResult) {
                    break;
                }
            }
            if (isResult) {
                break;
            } else {
                element = null;
            }
        }
        return element;
    },


    createProfesional: function(req, res) {

        if (req.body.matricula == null) {
            var errorMsj = 'La matricula no puede ser null';
            return res.status(404).json({
                message: errorMsj
            });
        }

        ProfesionalModel.findOne({
            matricula: req.body.matricula
        }, function(err, profesional) {
            if (err) {
                return res.status(404).json({
                    message: 'Error al crear el usuario.',
                    error: err
                });
            }
            if (profesional) {
                return res.status(404).json({
                    message: 'La matricula ya se encuentra registrada.'
                });
            } else {
                var usuario = new UsuarioModel({
                    email: req.body.email,
                    password: req.body.password,
                    fechaAlta: Date.now()
                });

                var url = "http://localhost:8008/socios/" + req.body.matricula;

                var request = http.get(url, function(response) {
                    // Continuously update stream with data
                    var body = '';
                    var statusCode = response.statusCode;
                    response.on('data', function(d) {
                        body += d;
                    });
                    response.on('end', function() {
                        if (statusCode == 200) {
                            var profesionalRest = JSON.parse(body);
                            if (profesionalRest) {
                                usuario.save(function(err, usuario) {
                                    if (err) {
                                        return res.status(404).json({
                                            message: 'Error al crear el usuario.',
                                            error: err
                                        });
                                    } else {


                                        var personaFisica = new PersonaFisicaModel({
                                            nombre: profesionalRest.nombre,
                                            apellido: profesionalRest.apellido,
                                            fechaNacimiento: new Date(profesionalRest.nacimiento),
                                            tipoDocumento: profesionalRest.tipo_documento,
                                            nroDocumento: profesionalRest.nro_documento
                                        });
                                        ImagenModel.find({}, function(err, imagenes) {
                                            if (imagenes.length > 0) {
                                                personaFisica.imagen = imagenes[imagenes.length - 1]._id;
                                            }

                                            personaFisica.save(function(err, personaFisica) {
                                                if (err) {
                                                    return res.status(404).json({
                                                        message: 'Error al crear el usuario.',
                                                        error: err
                                                    });
                                                } else {
                                                    var profesional = new ProfesionalModel({
                                                        matricula: req.body.matricula,
                                                        usuario: usuario._id,
                                                        personaFisica: personaFisica._id,
                                                        generalRating: 4,
                                                        amabilidadRating: 2,
                                                        claridadRating: 4,
                                                        puntualidadRating: 4
                                                    });
                                                    EspecialidadModel.find({}, function(err, especialidades) {
                                                        if (especialidades) {
                                                            profesional.especialidades.push(especialidades[0]);
                                                            profesional.especialidades.push(especialidades[1]);
                                                        }
                                                        profesional.save(function(err, profesional) {
                                                            if (err) {
                                                                return res.status(404).json({
                                                                    message: 'Error al crear el usuario.',
                                                                    error: err
                                                                });
                                                            } else {
                                                                var usuarioTemp = usuario.toObject({
                                                                    getters: true,
                                                                    virtuals: false
                                                                });
                                                                usuarioTemp.profesional = profesional.toObject({
                                                                    getters: true,
                                                                    virtuals: false
                                                                });
                                                                usuarioTemp.profesional.especialidades = [];
                                                                usuarioTemp.profesional.especialidades.push(especialidades[0]);
                                                                usuarioTemp.profesional.especialidades.push(especialidades[1]);
                                                                usuarioTemp.profesional.personaFisica = personaFisica.toObject({
                                                                    getters: true,
                                                                    virtuals: false
                                                                });
                                                                usuarioTemp.profesional.personaFisica.imagen = imagenes[imagenes.length - 1];
                                                                return res.status(200).json({
                                                                    usuario: usuarioTemp
                                                                });
                                                            }
                                                        });
                                                    });

                                                }
                                            });
                                        });


                                    }

                                });
                            } else {
                                var errorMsj = 'No se ha encontrado la matricula ' + req.body.matricula;
                                return res.status(404).json({
                                    message: 'Error al crear el usuario.',
                                    error: errorMsj
                                });
                            }
                        } else {
                            return res.status(statusCode).json({
                                message: 'Error al validar matricula.',
                                error: body
                            });
                        }
                    });
                    response.on('error', function() {
                        return res.status(404).json({
                            message: 'Error al validar matricula.',
                            error: err
                        });
                    });
                });
                request.on('error', function(err) {
                    return res.status(404).json({
                        message: 'Error al validar matricula.',
                        error: err
                    });
                });
            }
        });

    },

    /**
     * UsuarioController.update()
     */
    update: function(req, res) {
        var id = req.params.id;
        UsuarioModel.findOne({
            _id: id
        }, function(err, Usuario) {
            if (err) {
                return res.status(404).json({
                    message: 'Error when getting Usuario',
                    error: err
                });
            }
            if (!Usuario) {
                return res.status(404).json({
                    message: 'No such Usuario'
                });
            }

            Usuario.email = req.body.email ? req.body.email : Usuario.email;
            Usuario.token = req.body.token ? req.body.token : Usuario.token;
            Usuario.fechaLogin = req.body.fechaLogin ? req.body.fechaLogin : Usuario.fechaLogin;
            Usuario.fechaLogout = req.body.fechaLogout ? req.body.fechaLogout : Usuario.fechaLogout;
            Usuario.password = req.body.password ? req.body.password : Usuario.password;
            Usuario.fechaAlta = req.body.fechaAlta ? req.body.fechaAlta : Usuario.fechaAlta;

            Usuario.save(function(err, Usuario) {
                if (err) {
                    return res.status(404).json({
                        message: 'Error when updating Usuario.',
                        error: err
                    });
                }

                return res.json(Usuario);
            });
        });
    },

    /**
     * UsuarioController.remove()
     */
    remove: function(req, res) {
        var id = req.params.id;
        UsuarioModel.findByIdAndRemove(id, function(err, Usuario) {
            if (err) {
                return res.status(404).json({
                    message: 'Error when deleting the Usuario.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    },

    login: function(req, res) {
        var self = this;
        var email = req.body.email;
        var password = req.body.password;
        UsuarioModel.findOne({
            email: email
        }, function(err, usuario) {
            if (err) {
                return res.status(404).json({
                    message: 'Error al loguear el usuario.',
                    error: err
                });
            }
            if (!usuario) {
                return res.status(404).json({
                    message: 'El email/password no se encuentra registrado.'
                });
            }
            usuario.comparePassword(password, function(err, isMatch) {
                if (err || !isMatch) {
                    return res.status(404).json({
                        message: 'El email/password no se encuentra registrado.',
                        error: err
                    });
                } else {
                    var map = {};

                    usuario.fechaLogin = Date.now();

                    usuario.save();
                    var usuarioTemp = usuario.toObject({
                        getters: true,
                        virtuals: false
                    });
                    AdminModel.findOne({
                        usuario: usuario._id
                    }).deepPopulate(["personaFisica"]).exec(function(err, admin) {
                        if (admin) {
                            usuarioTemp.rolName = 'ADMIN';
                            map.usuario = usuarioTemp;
                            usuarioTemp.admin = admin;
                            return res.json({
                                jwt: nJwt.create({
                                    sub: map
                                }, signingKey).setExpiration(new Date().getTime() + (24 * 60 * 60 * 1000)).compact()
                            });
                        } else {
                            ProfesionalModel.findOne({
                                usuario: usuario._id
                            }).deepPopulate(["personaFisica.domicilios", "personaFisica.telefonos" /*,"personaFisica.imagen"*/ , "especialidades"]).exec(function(err, profesional) {
                                if (!profesional) {
                                    AfiliadoModel.findOne({
                                        usuario: usuario._id
                                    }).deepPopulate(["personaFisica.domicilios" /*,"personaFisica.imagen"*/ , "grupoFamiliar"]).exec(function(err, afiliado) {
                                        SolicitudMedicaModel.find({
                                            usuario: usuario._id
                                        }).deepPopulate(["domicilio", "usuario", "afiliado", "antecedentesMedicos", "profesional.especialidades"]).exec(function(err, solicitudesMedicas) {

                                            map.ultimosDomicilios = self.getUltimosDomicilios(solicitudesMedicas);
                                            map.solicitudesPendientes = self.getSolicitudesPendientes(solicitudesMedicas);
                                            usuarioTemp.afiliado = afiliado.toObject({
                                                getters: true,
                                                virtuals: false
                                            });
                                            map.grupoFamiliar = afiliado.grupoFamiliar.toObject({
                                                getters: true,
                                                virtuals: false
                                            });
                                            usuarioTemp.rolName = 'USER';
                                            AfiliadoModel.find({
                                                _id: {
                                                    $ne: afiliado._id
                                                },
                                                grupoFamiliar: afiliado.grupoFamiliar._id
                                            }).deepPopulate(["personaFisica.domicilios" /*,"personaFisica.imagen"*/ ]).exec(function(err, grupoFamiliarResult) {
                                                map.usuario = usuarioTemp;
                                                if (grupoFamiliarResult) {
                                                    map.grupoFamiliar.afiliados = grupoFamiliarResult;
                                                }
                                                return res.json({
                                                    jwt: nJwt.create({
                                                        sub: map
                                                    }, signingKey).setExpiration(new Date().getTime() + (24 * 60 * 60 * 1000)).compact()
                                                });
                                            });
                                        });
                                    });
                                } else {
                                    usuarioTemp.rolName = 'PROFESSIONAL';
                                    usuarioTemp.profesional = profesional.toObject({
                                        getters: true,
                                        virtuals: false
                                    });
                                    map.usuario = usuarioTemp;
                                    return res.json({
                                        jwt: nJwt.create({
                                            sub: map
                                        }, signingKey).setExpiration(new Date().getTime() + (24 * 60 * 60 * 1000)).compact()
                                    });
                                }
                            });
                        }
                    });
                }
            });

        });
    },

    getUltimosDomicilios: function(solicitudesMedicas) {
        var self = this;
        var domicilios = [];
        if (solicitudesMedicas) {
            for (var i = 0; i < solicitudesMedicas.length; i++) {
                var dom = self.getElementInArray(domicilios, [{
                    attr: "_id",
                    val: solicitudesMedicas[i].domicilio._id
                }]);
                if (!dom) {
                    domicilios.push(solicitudesMedicas[i].domicilio);
                }

            }
        }
        return domicilios;
    },

    getSolicitudesPendientes: function(solicitudesMedicas) {
        var pendientes = [];
        if (solicitudesMedicas) {
            for (var i = 0; i < solicitudesMedicas.length; i++) {
                if (solicitudesMedicas[i].estado === 0 || solicitudesMedicas[i].estado === 1 || solicitudesMedicas[i].estado === 2) {
                    solicitudesMedicas[i].afiliado.usuario = null;
                    solicitudesMedicas[i].afiliado.personaFisica = null;
                    solicitudesMedicas[i].afiliado.grupoFamiliar = null;
                    solicitudesMedicas[i].afiliado.prepagas = null;
                    if (solicitudesMedicas[i].profesional) {
                        solicitudesMedicas[i].profesional.usuario = null;
                        solicitudesMedicas[i].profesional.personaFisica = null;
                    }
                    pendientes.push(solicitudesMedicas[i]);
                }

            }
        }
        return pendientes;
    },

    deleteAll: function(req, res) {
        UsuarioModel.remove({}, function() {
            ProfesionalModel.remove({}, function() {
                AfiliadoModel.remove({}, function() {
                    GrupoFamiliarModel.remove({}, function() {
                        PersonaFisicaModel.remove({}, function() {
                            return res.status(200).json({
                                message: 'Borraste toda la base de datos Pablo!!'
                            });
                        });
                    });
                });
            });
        });
    },

    deleteUser: function(req, res) {
        UsuarioModel.remove({
            _id: req.params.id
        }, function() {
            AfiliadoModel.remove({}, function() {

            });
        });
    },


    olvideContrasenia: function(req, res) {
        var email = req.params.email;

        UsuarioModel.findOne({
            email: email
        }, function(err, Usuario) {
            if (err) {
                return res.status(404).json({
                    message: 'Error when getting Usuario.',
                    error: err
                });
            }
            if (!Usuario) {
                return res.status(404).json({
                    message: 'No such Usuario'
                });
            }
            return res.json(Usuario.fechaLogin);
        });
    }

};