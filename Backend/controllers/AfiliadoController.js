var AfiliadoModel = require('../models/AfiliadoModel.js');

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
        var id = req.params.id;
        AfiliadoModel.findOne({_id: id}, function (err, Afiliado) {
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

            Afiliado.credencial = req.body.credencial ? req.body.credencial : Afiliado.credencial;
			Afiliado.id_usuario = req.body.id_usuario ? req.body.id_usuario : Afiliado.id_usuario;
			Afiliado.id_persona_fisica = req.body.id_persona_fisica ? req.body.id_persona_fisica : Afiliado.id_persona_fisica;
			
            Afiliado.save(function (err, Afiliado) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Afiliado.',
                        error: err
                    });
                }

                return res.json(Afiliado);
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
