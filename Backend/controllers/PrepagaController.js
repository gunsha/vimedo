var PrepagaModel = require('../models/PrepagaModel.js');
var prepagasList = require('../prepagas.json');
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
    },
    create: function (req, res) {
        for(var i = 0; i<prepagasList.length;i++){
            var prepaga = new PrepagaModel({
            nombre: prepagasList[i].nombre
        });

        prepaga.save(function (err, prep) {

        if (err) {
            console.log('error line '+i);
            return res.status(500).json({
                message: 'Error when creating prepaga',
                error: err
            });
        }
        console.log('saved line '+i);
    });
    }
    return res.status(200);

}

};
