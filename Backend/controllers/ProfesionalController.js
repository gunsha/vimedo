var ProfesionalModel = require('../models/ProfesionalModel.js');
var SolicitudMedicaModel = require('../models/SolicitudMedicaModel.js');
var PersonaFisicaModel = require('../models/PersonaFisicaModel.js');
var DomicilioModel = require('../models/DomicilioModel.js');
var async = require('async');

/**
 * ProfesionalController.js
 *
 * @description :: Server-side logic for managing Profesionals.
 */
module.exports = {

    /**
     * ProfesionalController.list()
     */
    list: function(req, res) {
        ProfesionalModel.find({}).deepPopulate(["usuario", "personaFisica.domicilios", "personaFisica.telefonos", "especialidades"]).exec(function(err, Profesionals) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Profesional.',
                    error: err
                });
            }
            async.each(Profesionals, function(item, callback) {
                SolicitudMedicaModel.find({
                        profesional: item._id,
                        fechaBaja: null,
                        estado: 1
                    })
                    .deepPopulate(["afiliado.personaFisica", "afiliado.personaFisica.domicilios", "afiliado.personaFisica.telefonos", "domicilio", "sintomasCie", "antecedentesMedicosCie"])
                    .exec(function(err, solicitudesMedicas) {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when getting SolicitudesMedicas.',
                                error: err
                            });
                        }
                        item.solicitudesMedicas = solicitudesMedicas;

                        callback();
                    });
            }, function() {
                return res.json(Profesionals);
            });
        });
    },

    /**
     * ProfesionalController.show()
     */
    show: function(req, res) {
        var id = req.params.id;
        ProfesionalModel.findOne({
            _id: id
        }).deepPopulate(["usuario", "personaFisica.imagen", "personaFisica.domicilios", "personaFisica.telefonos", "especialidades"]).exec(function(err, Profesional) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Profesional.',
                    error: err
                });
            }
            if (!Profesional) {
                return res.status(404).json({
                    message: 'No such Profesional'
                });
            }
            return res.json(Profesional);
        });
    },

    /**
     * ProfesionalController.create()
     */
    create: function(req, res) {
        var Profesional = new ProfesionalModel({
            matricula: req.body.matricula,
            id_usuario: req.body.id_usuario,
            id_persona_fisica: req.body.id_persona_fisica
        });

        Profesional.save(function(err, Profesional) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Profesional',
                    error: err
                });
            }
            return res.status(201).json(Profesional);
        });
    },

    /**
     * ProfesionalController.update()
     */
    update: function(req, res) {
        var id = req.body._id;
        ProfesionalModel.findOne({
            _id: id
        }, function(err, Profesional) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Profesional',
                    error: err
                });
            }
            if (!Profesional) {
                return res.status(404).json({
                    message: 'No such Profesional'
                });
            }

            Profesional.matricula = req.body.matricula ? req.body.matricula : Profesional.matricula;
            Profesional.id_usuario = req.body.id_usuario ? req.body.id_usuario : Profesional.id_usuario;
            Profesional.id_persona_fisica = req.body.id_persona_fisica ? req.body.id_persona_fisica : Profesional.id_persona_fisica;

            // Profesional.save(function(err, Profesional) {
            //     if (err) {
            //         return res.status(500).json({
            //             message: 'Error when updating Profesional.',
            //             error: err
            //         });
            //     }
            // });
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
                if(resp)
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
                    var fields = ['nombre', 'apellido', 'fechaNacimiento', 'nro_documento', 'telefonos'];

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
    },

    /**
     * ProfesionalController.remove()
     */
    remove: function(req, res) {
        var id = req.params.id;
        ProfesionalModel.findByIdAndRemove(id, function(err, Profesional) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Profesional.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    },

    listLogueados: function(req, res) {
        ProfesionalModel.find({}).deepPopulate(["usuario", "personaFisica.imagen", "personaFisica.domicilios", "personaFisica.telefonos", "especialidades"]).exec(function(err, profesionales) {
            var result = [];
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Profesional.',
                    error: err
                });
            } else if (profesionales) {
                for (var i = 0; i < profesionales.length; i++) {
                    if (profesionales[i].usuario.token != null) {
                        result.push(profesionales[i]);
                    }
                }
            }
            return res.json(result);
        });
    },
};