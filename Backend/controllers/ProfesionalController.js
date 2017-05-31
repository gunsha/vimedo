var ProfesionalModel = require('../models/ProfesionalModel.js');

/**
 * ProfesionalController.js
 *
 * @description :: Server-side logic for managing Profesionals.
 */
module.exports = {

    /**
     * ProfesionalController.list()
     */
    list: function (req, res) {
        ProfesionalModel.find({}).deepPopulate(["usuario","personaFisica.imagen","personaFisica.domicilios","personaFisica.telefonos"]).exec(function (err, Profesionals) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Profesional.',
                    error: err
                });
            }
            return res.json(Profesionals);
        });
    },

    /**
     * ProfesionalController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        ProfesionalModel.findOne({_id: id}, function (err, Profesional) {
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
    create: function (req, res) {
        var Profesional = new ProfesionalModel({
			matricula : req.body.matricula,
			id_usuario : req.body.id_usuario,
			id_persona_fisica : req.body.id_persona_fisica
        });

        Profesional.save(function (err, Profesional) {
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
    update: function (req, res) {
        var id = req.params.id;
        ProfesionalModel.findOne({_id: id}, function (err, Profesional) {
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
			
            Profesional.save(function (err, Profesional) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Profesional.',
                        error: err
                    });
                }

                return res.json(Profesional);
            });
        });
    },

    /**
     * ProfesionalController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        ProfesionalModel.findByIdAndRemove(id, function (err, Profesional) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Profesional.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    },

    listLogueados: function (req, res) {
        ProfesionalModel.find({}).deepPopulate(["usuario","personaFisica.imagen","personaFisica.domicilios","personaFisica.telefonos"]).exec(function (err, profesionales) {
            var result=[];
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Profesional.',
                    error: err
                });
            }
            else if(profesionales){
                for(var i=0;i<profesionales.length;i++){
                    if(profesionales[i].usuario.token != null){
                        result.push(profesionales[i]);
                    }
                }
            }
            return res.json(result);
        });
    },
};
