var express = require('express');
var router = express.Router();
var PersonaFisicaController = require('../controllers/PersonaFisicaController.js');

/*
 * GET
 */
router.get('/', function (req, res) {
    PersonaFisicaController.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function (req, res) {
    PersonaFisicaController.show(req, res);
});

/*
 * POST
 */
router.post('/', function (req, res) {
    PersonaFisicaController.create(req, res);
});

/*
 * PUT
 */
router.put('/:id', function (req, res) {
    PersonaFisicaController.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', function (req, res) {
    PersonaFisicaController.remove(req, res);
});

module.exports = router;
