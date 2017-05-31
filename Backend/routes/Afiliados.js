var express = require('express');
var router = express.Router();
var AfiliadoController = require('../controllers/AfiliadoController.js');

/*
 * GET
 */
router.get('/', function (req, res) {
    AfiliadoController.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function (req, res) {
    AfiliadoController.show(req, res);
});

/*
 * POST
 */
router.post('/', function (req, res) {
    AfiliadoController.create(req, res);
});

/*
 * PUT
 */
router.put('/:id', function (req, res) {
    AfiliadoController.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', function (req, res) {
    AfiliadoController.remove(req, res);
});

module.exports = router;
