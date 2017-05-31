var express = require('express');
var router = express.Router();
var AdminController = require('../controllers/AdminController.js');

/*
 * GET
 */
router.get('/', function (req, res) {
    AdminController.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function (req, res) {
    AdminController.show(req, res);
});

/*
 * POST
 */
router.post('/', function (req, res) {
    AdminController.create(req, res);
});

/*
 * PUT
 */
router.put('/:id', function (req, res) {
    AdminController.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', function (req, res) {
    AdminController.remove(req, res);
});

module.exports = router;
