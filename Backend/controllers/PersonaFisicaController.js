var PersonaFisicaModel = require('../models/PersonaFisicaModel.js');

/**
 * PersonaFisicaController.js
 *
 * @description :: Server-side logic for managing PersonaFisicas.
 */
module.exports = {

    /**
     * PersonaFisicaController.list()
     */
    list: function (req, res) {
        PersonaFisicaModel.find(function (err, PersonaFisicas) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting PersonaFisica.',
                    error: err
                });
            }
            return res.json(PersonaFisicas);
        });
    },

    /**
     * PersonaFisicaController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        PersonaFisicaModel.findOne({_id: id}, function (err, PersonaFisica) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting PersonaFisica.',
                    error: err
                });
            }
            if (!PersonaFisica) {
                return res.status(404).json({
                    message: 'No such PersonaFisica'
                });
            }
            return res.json(PersonaFisica);
        });
    },

    /**
     * PersonaFisicaController.create()
     */
    create: function (req, res) {
        var PersonaFisica = new PersonaFisicaModel({			nombre : req.body.nombre,			apellido : req.body.apellido,			nacimiento : req.body.nacimiento,			tipo_documento : req.body.tipo_documento,			nro_documento : req.body.nro_documento,			id_imagen : req.body.id_imagen,			id_grupo_familiar : req.body.id_grupo_familiar
        });

        PersonaFisica.save(function (err, PersonaFisica) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating PersonaFisica',
                    error: err
                });
            }
            return res.status(201).json(PersonaFisica);
        });
    },

    /**
     * PersonaFisicaController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        PersonaFisicaModel.findOne({_id: id}, function (err, PersonaFisica) {
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

            PersonaFisica.nombre = req.body.nombre ? req.body.nombre : PersonaFisica.nombre;			PersonaFisica.apellido = req.body.apellido ? req.body.apellido : PersonaFisica.apellido;			PersonaFisica.nacimiento = req.body.nacimiento ? req.body.nacimiento : PersonaFisica.nacimiento;			PersonaFisica.tipo_documento = req.body.tipo_documento ? req.body.tipo_documento : PersonaFisica.tipo_documento;			PersonaFisica.nro_documento = req.body.nro_documento ? req.body.nro_documento : PersonaFisica.nro_documento;			PersonaFisica.id_imagen = req.body.id_imagen ? req.body.id_imagen : PersonaFisica.id_imagen;			PersonaFisica.id_grupo_familiar = req.body.id_grupo_familiar ? req.body.id_grupo_familiar : PersonaFisica.id_grupo_familiar;			
            PersonaFisica.save(function (err, PersonaFisica) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating PersonaFisica.',
                        error: err
                    });
                }

                return res.json(PersonaFisica);
            });
        });
    },

    /**
     * PersonaFisicaController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        PersonaFisicaModel.findByIdAndRemove(id, function (err, PersonaFisica) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the PersonaFisica.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
