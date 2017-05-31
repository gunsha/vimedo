var express = require('express');
var router = express.Router();
var AntecedenteMedicoController = require('../controllers/AntecedenteMedicoController.js');

/*
 * GET
 */
router.get('/', function (req, res) {
    AntecedenteMedicoController.list(req, res);
});

/*
router.get('/:id', function (req, res) {
    TelefonoController.show(req, res);
});


router.post('/', function (req, res) {
    TelefonoController.create(req, res);
});


router.put('/:id', function (req, res) {
    TelefonoController.update(req, res);
});


router.delete('/:id', function (req, res) {
    TelefonoController.remove(req, res);
});
*/
module.exports = router;
