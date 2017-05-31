var EspecialidadModel = require('../models/EspecialidadModel.js');


module.exports = {


    save: function (req, res) {
    	var especialidad = new EspecialidadModel({
    		nombre:req.body.nombre
    	});
    	especialidad.save(function (err,especialidad){
    		if (err){
				return res.status(500).json({
                    message: 'Error al crear Especialidad.',
                    error: err
                });
    		}
    		else{
    			return res.json(especialidad);
    		}
    	});
    },

    list: function (req, res) {
    	EspecialidadModel.find(function (err,especialidades){
    		if (err){
				return res.status(500).json({
                    message: 'Error al listar Especialidad.',
                    error: err
                });
    		}
    		else{
    			return res.json(especialidades);
    		}
    	});
    }

};
