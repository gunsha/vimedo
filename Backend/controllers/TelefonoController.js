var TelefonoModel = require('../models/TelefonoModel.js');

/**
 * TelefonoController.js
 *
 * @description :: Server-side logic for managing Telefonos.
 */
module.exports = {

    /**
     * TelefonoController.list()
     */
    list: function (req, res) {
        TelefonoModel.find(function (err, Telefonos) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Telefono.',
                    error: err
                });
            }
            return res.json(Telefonos);
        });
    },

    /**
     * TelefonoController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        TelefonoModel.findOne({_id: id}, function (err, Telefono) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Telefono.',
                    error: err
                });
            }
            if (!Telefono) {
                return res.status(404).json({
                    message: 'No such Telefono'
                });
            }
            return res.json(Telefono);
        });
    },

    /**
     * TelefonoController.create()
     */
    create: function (req, res) {
        var Telefono = new TelefonoModel({
			codigoArea : req.body.codigoArea,
			numero : req.body.numero
        });

        Telefono.save(function (err, Telefono) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Telefono',
                    error: err
                });
            }
            return res.status(201).json(Telefono);
        });
    },

    /**
     * TelefonoController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        TelefonoModel.findOne({_id: id}, function (err, Telefono) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Telefono',
                    error: err
                });
            }
            if (!Telefono) {
                return res.status(404).json({
                    message: 'No such Telefono'
                });
            }

			Telefono.codigoArea = req.body.codigoArea ? req.body.codigoArea : Telefono.codigoArea;
			Telefono.numero = req.body.numero ? req.body.numero : Telefono.numero;
			
            Telefono.save(function (err, Telefono) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Telefono.',
                        error: err
                    });
                }

                return res.json(Telefono);
            });
        });
    },

    /**
     * TelefonoController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        TelefonoModel.findByIdAndRemove(id, function (err, Telefono) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Telefono.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
