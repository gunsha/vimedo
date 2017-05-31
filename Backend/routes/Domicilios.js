var express = require('express');
var router = express.Router();
var DomicilioController = require('../controllers/DomicilioController.js');

/*
 * GET
 */
router.get('/', function (req, res) {
    DomicilioController.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function (req, res) {
    DomicilioController.show(req, res);
});

/*
 * POST
 */
router.post('/', function (req, res) {
    DomicilioController.create(req, res);
});

/*
 * PUT
 */
router.put('/:id', function (req, res) {
    DomicilioController.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', function (req, res) {
    DomicilioController.remove(req, res);
});

module.exports = router;
