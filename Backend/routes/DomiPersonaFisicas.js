var express = require('express');
var router = express.Router();
var DomiPersonaFisicaController = require('../controllers/DomiPersonaFisicaController.js');

/*
 * GET
 */
router.get('/', function (req, res) {
    DomiPersonaFisicaController.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function (req, res) {
    DomiPersonaFisicaController.show(req, res);
});

/*
 * POST
 */
router.post('/', function (req, res) {
    DomiPersonaFisicaController.create(req, res);
});

/*
 * PUT
 */
router.put('/:id', function (req, res) {
    DomiPersonaFisicaController.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', function (req, res) {
    DomiPersonaFisicaController.remove(req, res);
});

module.exports = router;
