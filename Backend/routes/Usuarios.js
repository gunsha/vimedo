var express = require('express');
var router = express.Router();
var UsuarioController = require('../controllers/UsuarioController.js');
var CalificacionController = require('../controllers/CalificacionController.js');
/*
 * GET
 */
router.get('/', function (req, res) {
    UsuarioController.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function (req, res) {
    UsuarioController.show(req, res);
});

router.get('/olvideContrasenia/:email', function (req, res) {
    UsuarioController.olvideContrasenia(req, res);
});

router.get('/:idUsuario/calificaciones', function (req, res) {
    CalificacionController.listByUsuario(req, res);
});

router.post('/calificar', function (req, res) {
    CalificacionController.save(req, res);
});

router.put('/calificar/:idCalificacion', function (req, res) {
    CalificacionController.update(req, res);
});

/*
 * POST
 */
router.post('/register', function (req, res) {
    // UsuarioController.testfunc(req, res);
	if(req.body.isProfesional){
		UsuarioController.createProfesional(req, res);
	}
	else{
		UsuarioController.createAfiliado2(req, res);
	}
});

/*
 * PUT
 */
router.put('/:id', function (req, res) {
    UsuarioController.update(req, res);
});

router.post('/newAdmin', function (req, res) {
    UsuarioController.createAdmin(req, res);
});

router.post('/new', function (req, res) {
    UsuarioController.createAfiliado2(req, res);
});

/*
 * DELETE
 */
 /*
router.delete('/:id', function (req, res) {
    UsuarioController.remove(req, res);
});
*/
router.delete('/deleteAll', function (req, res) {
    UsuarioController.deleteAll(req, res);
});

router.post('/login', function (req, res) {
    UsuarioController.login(req, res);
});

module.exports = router;
