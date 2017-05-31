var GrupoFamiliarModel = require('../models/GrupoFamiliarModel.js');

/**
 * GrupoFamiliarController.js
 *
 * @description :: Server-side logic for managing GrupoFamiliars.
 */
module.exports = {

    /**
     * GrupoFamiliarController.list()
     */
    list: function (req, res) {
        GrupoFamiliarModel.find(function (err, GrupoFamiliars) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting GrupoFamiliar.',
                    error: err
                });
            }
            return res.json(GrupoFamiliars);
        });
    },

    /**
     * GrupoFamiliarController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        GrupoFamiliarModel.findOne({_id: id}, function (err, GrupoFamiliar) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting GrupoFamiliar.',
                    error: err
                });
            }
            if (!GrupoFamiliar) {
                return res.status(404).json({
                    message: 'No such GrupoFamiliar'
                });
            }
            return res.json(GrupoFamiliar);
        });
    },

    /**
     * GrupoFamiliarController.create()
     */
    create: function (req, res) {
        var GrupoFamiliar = new GrupoFamiliarModel({			descripcion : req.body.descripcion
        });

        GrupoFamiliar.save(function (err, GrupoFamiliar) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating GrupoFamiliar',
                    error: err
                });
            }
            return res.status(201).json(GrupoFamiliar);
        });
    },

    /**
     * GrupoFamiliarController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        GrupoFamiliarModel.findOne({_id: id}, function (err, GrupoFamiliar) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting GrupoFamiliar',
                    error: err
                });
            }
            if (!GrupoFamiliar) {
                return res.status(404).json({
                    message: 'No such GrupoFamiliar'
                });
            }

            GrupoFamiliar.descripcion = req.body.descripcion ? req.body.descripcion : GrupoFamiliar.descripcion;			
            GrupoFamiliar.save(function (err, GrupoFamiliar) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating GrupoFamiliar.',
                        error: err
                    });
                }

                return res.json(GrupoFamiliar);
            });
        });
    },

    /**
     * GrupoFamiliarController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        GrupoFamiliarModel.findByIdAndRemove(id, function (err, GrupoFamiliar) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the GrupoFamiliar.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
