var ImagenModel = require('../models/ImagenModel.js');

/**
 * ImagenController.js
 *
 * @description :: Server-side logic for managing Imagens.
 */
module.exports = {

    /**
     * ImagenController.list()
     */
    list: function (req, res) {
        ImagenModel.find(function (err, Imagens) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Imagen.',
                    error: err
                });
            }
            return res.json(Imagens);
        });
    },

    /**
     * ImagenController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        ImagenModel.findOne({_id: id}, function (err, Imagen) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Imagen.',
                    error: err
                });
            }
            if (!Imagen) {
                return res.status(404).json({
                    message: 'No such Imagen'
                });
            }
            return res.json(Imagen);
        });
    },

    /**
     * ImagenController.create()
     */
    create: function (req, res) {
        var Imagen = new ImagenModel({
			imagenData : req.body.imagenData
        });

        Imagen.save(function (err, Imagen) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Imagen',
                    error: err
                });
            }
            return res.status(201).json(Imagen);
        });
    },

    /**
     * ImagenController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        ImagenModel.findOne({_id: id}, function (err, Imagen) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Imagen',
                    error: err
                });
            }
            if (!Imagen) {
                return res.status(404).json({
                    message: 'No such Imagen'
                });
            }

            Imagen.imagenData = req.body.imagenData ? req.body.imagenData : Imagen.imagenData;
			
            Imagen.save(function (err, Imagen) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Imagen.',
                        error: err
                    });
                }

                return res.json(Imagen);
            });
        });
    },

    /**
     * ImagenController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        ImagenModel.findByIdAndRemove(id, function (err, Imagen) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Imagen.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
