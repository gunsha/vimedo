var express = require('express');
var router = express.Router();
var GrupoFamiliarController = require('../controllers/GrupoFamiliarController.js');

/*
 * GET
 */
router.get('/', function (req, res) {
    GrupoFamiliarController.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function (req, res) {
    GrupoFamiliarController.show(req, res);
});

/*
 * POST
 */
router.post('/', function (req, res) {
    GrupoFamiliarController.create(req, res);
});

/*
 * PUT
 */
router.put('/:id', function (req, res) {
    GrupoFamiliarController.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', function (req, res) {
    GrupoFamiliarController.remove(req, res);
});

module.exports = router;
