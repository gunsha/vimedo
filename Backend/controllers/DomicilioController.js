var DomicilioModel = require('../models/DomicilioModel.js');

/**
 * DomicilioController.js
 *
 * @description :: Server-side logic for managing Domicilios.
 */
module.exports = {

    /**
     * DomicilioController.list()
     */
    list: function (req, res) {
        DomicilioModel.find(function (err, Domicilios) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Domicilio.',
                    error: err
                });
            }
            return res.json(Domicilios);
        });
    },

    /**
     * DomicilioController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        DomicilioModel.findOne({_id: id}, function (err, Domicilio) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Domicilio.',
                    error: err
                });
            }
            if (!Domicilio) {
                return res.status(404).json({
                    message: 'No such Domicilio'
                });
            }
            return res.json(Domicilio);
        });
    },

    /**
     * DomicilioController.create()
     */
    create: function (req, res) {
        var Domicilio = new DomicilioModel({
			calle : req.body.calle,
			numero : req.body.numero,
			localidad : req.body.localidad,
			entrecalles : req.body.entrecalles,
			provincia : req.body.provincia
        });

        Domicilio.save(function (err, Domicilio) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Domicilio',
                    error: err
                });
            }
            return res.status(201).json(Domicilio);
        });
    },

    /**
     * DomicilioController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        DomicilioModel.findOne({_id: id}, function (err, Domicilio) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Domicilio',
                    error: err
                });
            }
            if (!Domicilio) {
                return res.status(404).json({
                    message: 'No such Domicilio'
                });
            }

            Domicilio.calle = req.body.calle ? req.body.calle : Domicilio.calle;
			Domicilio.numero = req.body.numero ? req.body.numero : Domicilio.numero;
			Domicilio.localidad = req.body.localidad ? req.body.localidad : Domicilio.localidad;
			Domicilio.entrecalles = req.body.entrecalles ? req.body.entrecalles : Domicilio.entrecalles;
			Domicilio.coordenadas = req.body.coordenadas ? req.body.coordenadas : Domicilio.coordenadas;
			Domicilio.provincia = req.body.provincia ? req.body.provincia : Domicilio.provincia;
			
            Domicilio.save(function (err, Domicilio) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Domicilio.',
                        error: err
                    });
                }

                return res.json(Domicilio);
            });
        });
    },

    /**
     * DomicilioController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        DomicilioModel.findByIdAndRemove(id, function (err, Domicilio) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Domicilio.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
