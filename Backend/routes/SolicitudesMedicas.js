var express = require('express');
var router = express.Router();
var SolicitudMedicaController = require('../controllers/SolicitudMedicaController.js');

/*
 * GET
 */
router.get('/', function (req, res) {
    SolicitudMedicaController.list(req, res);
});
router.get('/active', function (req, res) {
    SolicitudMedicaController.listActive(req, res);
});

router.get('/:idSolicitud', function (req, res) {
    SolicitudMedicaController.get(req, res);
});

router.get('/usuario/:idUsuario', function (req, res) {
    SolicitudMedicaController.listByUsuario(req, res);
});

router.get('/profesional/:idProfesional', function (req, res) {
    SolicitudMedicaController.listByProfesional(req, res);
});

router.get('/:id/ultimosDomicilios', function (req, res) {
    SolicitudMedicaController.getUltimosDomicilios(req, res);
});

router.post('/', function (req, res) {
    SolicitudMedicaController.save(req, res);
});

router.post('/setProfesional', function (req, res) {
    SolicitudMedicaController.setProfesionalSolicitud(req, res);
});

router.get('/ruta/:id', function (req, res) {
    SolicitudMedicaController.getRuta(req, res);
});

router.get('/ruta/profesional/:idProfesional', function (req, res) {
    SolicitudMedicaController.getRutaProfesional(req, res);
});

// router.delete('/borrarTodas', function (req, res) {
//     SolicitudMedicaController.deleteAll(req, res);
// });

router.put('/profesional/finalizarSolicitud/', function (req, res) {
    SolicitudMedicaController.darDeBaja(req, res);
});


module.exports = router;
