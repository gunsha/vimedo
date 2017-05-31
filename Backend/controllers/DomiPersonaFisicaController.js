var DomiPersonaFisicaModel = require('../models/DomiPersonaFisicaModel.js');

/**
 * DomiPersonaFisicaController.js
 *
 * @description :: Server-side logic for managing DomiPersonaFisicas.
 */
module.exports = {

    /**
     * DomiPersonaFisicaController.list()
     */
    list: function (req, res) {
        DomiPersonaFisicaModel.find(function (err, DomiPersonaFisicas) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting DomiPersonaFisica.',
                    error: err
                });
            }
            return res.json(DomiPersonaFisicas);
        });
    },

    /**
     * DomiPersonaFisicaController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        DomiPersonaFisicaModel.findOne({_id: id}, function (err, DomiPersonaFisica) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting DomiPersonaFisica.',
                    error: err
                });
            }
            if (!DomiPersonaFisica) {
                return res.status(404).json({
                    message: 'No such DomiPersonaFisica'
                });
            }
            return res.json(DomiPersonaFisica);
        });
    },

    /**
     * DomiPersonaFisicaController.create()
     */
    create: function (req, res) {
        var DomiPersonaFisica = new DomiPersonaFisicaModel({			id_persona_fisica : req.body.id_persona_fisica,			id_domicilio : req.body.id_domicilio
        });

        DomiPersonaFisica.save(function (err, DomiPersonaFisica) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating DomiPersonaFisica',
                    error: err
                });
            }
            return res.status(201).json(DomiPersonaFisica);
        });
    },

    /**
     * DomiPersonaFisicaController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        DomiPersonaFisicaModel.findOne({_id: id}, function (err, DomiPersonaFisica) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting DomiPersonaFisica',
                    error: err
                });
            }
            if (!DomiPersonaFisica) {
                return res.status(404).json({
                    message: 'No such DomiPersonaFisica'
                });
            }

            DomiPersonaFisica.id_persona_fisica = req.body.id_persona_fisica ? req.body.id_persona_fisica : DomiPersonaFisica.id_persona_fisica;			DomiPersonaFisica.id_domicilio = req.body.id_domicilio ? req.body.id_domicilio : DomiPersonaFisica.id_domicilio;			
            DomiPersonaFisica.save(function (err, DomiPersonaFisica) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating DomiPersonaFisica.',
                        error: err
                    });
                }

                return res.json(DomiPersonaFisica);
            });
        });
    },

    /**
     * DomiPersonaFisicaController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        DomiPersonaFisicaModel.findByIdAndRemove(id, function (err, DomiPersonaFisica) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the DomiPersonaFisica.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
