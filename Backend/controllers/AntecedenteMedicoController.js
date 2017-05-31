var AntecedenteMedicoModel = require('../models/AntecedenteMedicoModel.js');

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
        AntecedenteMedicoModel.find(function (err, antecedentesMedicos) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting antecedentesMedicos.',
                    error: err
                });
            }
            return res.json(antecedentesMedicos);
        });
    }

};
