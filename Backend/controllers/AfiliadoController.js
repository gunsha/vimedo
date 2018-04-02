var AfiliadoModel = require('../models/AfiliadoModel.js');
var UsuarioModel = require('../models/UsuarioModel.js');
var PersonaFisicaModel = require('../models/PersonaFisicaModel.js');
var DomicilioModel = require('../models/DomicilioModel.js');

/**
 * AfiliadoController.js
 *
 * @description :: Server-side logic for managing Afiliados.
 */
module.exports = {

    /**
     * AfiliadoController.list()
     */
    list: function (req, res) {
        AfiliadoModel.find().deepPopulate(["usuario","personaFisica.domicilios","personaFisica"]).exec(function (err, Afiliados) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Afiliado.',
                    error: err
                });
            }
            return res.json(Afiliados);
        });
    },
    /**
     * AfiliadoController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        AfiliadoModel.findOne({_id: id}).deepPopulate(["usuario","personaFisica.domicilios","personaFisica"]).exec(function (err, Afiliado) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Afiliado.',
                    error: err
                });
            }
            if (!Afiliado) {
                return res.status(404).json({
                    message: 'No such Afiliado'
                });
            }
            return res.json(Afiliado);
        });
    },

    /**
     * AfiliadoController.create()
     */
    create: function (req, res) {
        var Afiliado = new AfiliadoModel({
			credencial : req.body.credencial,
			id_usuario : req.body.id_usuario,
			id_persona_fisica : req.body.id_persona_fisica
        });

        Afiliado.save(function (err, Afiliado) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Afiliado',
                    error: err
                });
            }
            return res.status(201).json(Afiliado);
        });
    },

    /**
     * AfiliadoController.update()
     */
    update: function (req, res) {
        var id = req.body._id;
        UsuarioModel.findOne({
            _id: req.body.usuario._id
        }, function(err, Usuario) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Usuario',
                    error: err
                });
            }
            Usuario.email = Usuario.email === req.body.usuario.email ? Usuario.email : req.body.usuario.email;
            Usuario.password = Usuario.password === req.body.usuario.password ? Usuario.password : req.body.usuario.password;
            Usuario.activo = req.body.usuario.activo ? req.body.usuario.activo : Usuario.activo;
            Usuario.save(function(err, Usuario) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Usuario.',
                        error: err
                    });
                }


                AfiliadoModel.findOne({
                    _id: id
                }, function(err, Afiliado) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when getting Afiliado',
                            error: err
                        });
                    }
                    if (!Afiliado) {
                        return res.status(404).json({
                            message: 'No such Afiliado'
                        });
                    }

                    Afiliado.credencial = Afiliado.credencial === req.body.credencial ? Afiliado.credencial : req.body.credencial;

                    Afiliado.save(function(err, Afiliado) {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when updating Afiliado.',
                                error: err
                            });
                        }

                        var exDom = [];
                        var dom = [];
                        for (var i = 0; i < req.body.personaFisica.domicilios.length; i++) {
                            if (req.body.personaFisica.domicilios[i]._id) {
                                exDom.push(req.body.personaFisica.domicilios[i]._id);
                            } else {
                                dom.push(req.body.personaFisica.domicilios[i]);
                            }
                        }
                        DomicilioModel.create(dom, function(err, resp) {
                            if (resp)
                                for (var i = 0; i < resp.length; i++) {
                                    exDom.push(resp[i]._id);
                                }
                            PersonaFisicaModel.findOne({
                                _id: req.body.personaFisica._id
                            }, function(err, PersonaFisica) {
                                if (err) {
                                    return res.status(500).json({
                                        message: 'Error when getting PersonaFisica',
                                        error: err
                                    });
                                }
                                if (!PersonaFisica) {
                                    return res.status(404).json({
                                        message: 'No such PersonaFisica'
                                    });
                                }
                                var fields = ['nombre', 'apellido', 'fechaNacimiento', 'nroDocumento', 'telefonos'];

                                for (var i = 0; i < fields.length; i++) {
                                    PersonaFisica[fields[i]] = PersonaFisica[fields[i]] === req.body.personaFisica[fields[i]] ? PersonaFisica[fields[i]] : req.body.personaFisica[fields[i]];
                                }
                                PersonaFisica.domicilios = exDom;
                                PersonaFisica.save(function(err, PersonaFisica) {
                                    if (err) {
                                        return res.status(500).json({
                                            message: 'Error when updating PersonaFisica.',
                                            error: err
                                        });
                                    }
                                    return res.json(PersonaFisica);
                                });
                            });
                        });
                    });
                });
            });
        });
    },

    /**
     * AfiliadoController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        AfiliadoModel.findByIdAndRemove(id, function (err, Afiliado) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Afiliado.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
