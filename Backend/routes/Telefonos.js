var express = require('express');
var router = express.Router();
var TelefonoController = require('../controllers/TelefonoController.js');

/*
 * GET
 */
router.get('/', function (req, res) {
    TelefonoController.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function (req, res) {
    TelefonoController.show(req, res);
});

/*
 * POST
 */
router.post('/', function (req, res) {
    TelefonoController.create(req, res);
});

/*
 * PUT
 */
router.put('/:id', function (req, res) {
    TelefonoController.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', function (req, res) {
    TelefonoController.remove(req, res);
});

module.exports = router;
