var express = require('express');
var router = express.Router();
var ImagenController = require('../controllers/ImagenController.js');

/*
 * GET
 */
router.get('/', function (req, res) {
    ImagenController.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function (req, res) {
    ImagenController.show(req, res);
});

/*
 * POST
 */
router.post('/', function (req, res) {
    ImagenController.create(req, res);
});

/*
 * PUT
 */
router.put('/:id', function (req, res) {
    ImagenController.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', function (req, res) {
    ImagenController.remove(req, res);
});

module.exports = router;
