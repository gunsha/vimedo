var express = require('express');
var router = express.Router();
var ProfesionalController = require('../controllers/ProfesionalController.js');
var CalificacionController = require('../controllers/CalificacionController.js');


router.get('/', function (req, res) {
    ProfesionalController.list(req, res);
});


router.get('/:id', function (req, res) {
    ProfesionalController.show(req, res);
});


router.post('/', function (req, res) {
    ProfesionalController.create(req, res);
});


router.put('/:id', function (req, res) {
    ProfesionalController.update(req, res);
});


router.delete('/:id', function (req, res) {
    ProfesionalController.remove(req, res);
});


router.get('/logged', function (req, res) {
    ProfesionalController.listLogueados(req, res);
});

router.get('/:idProfesional/calificaciones', function (req, res) {
    CalificacionController.listByProfesional(req, res);
});

router.post('/calificar', function (req, res) {
    CalificacionController.save(req, res);
});

module.exports = router;
