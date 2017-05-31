var PrepagaModel = require('../models/PrepagaModel.js');

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
        PrepagaModel.find(function (err, prepagas) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting prepagas.',
                    error: err
                });
            }
            return res.json(prepagas);
        });
    }

};
