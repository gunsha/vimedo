var express = require('express');
var router = express.Router();
var MensajesController = require('../controllers/MensajesController.js');

/*
 * GET
 */
router.get('/solicitudesPro/:id', function (req, res) {
	req.params.pro = true;
	console.log('holaa');
    MensajesController.list(req, res);
});
/*
 * GET
 */
router.get('/solicitudesAfil/:id', function (req, res) {
    req.params.pro = false;
    MensajesController.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function (req, res) {
    MensajesController.listBySol(req, res);
});

/*
 * POST
 */
router.post('/', function (req, res) {
    MensajesController.create(req, res);
});

/*
 * PUT
 */
router.put('/', function (req, res) {
    MensajesController.markAsRead(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', function (req, res) {
    MensajesController.remove(req, res);
});

module.exports = router;
