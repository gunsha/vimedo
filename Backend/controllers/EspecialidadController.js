var EspecialidadModel = require('../models/EspecialidadModel.js');


module.exports = {


    save: function (req, res) {
		for(var i = 0; i<req.body.length;i++){
		var especialidad = new EspecialidadModel({
    		nombre:req.body[i].nombre
    	});
    	especialidad.save(function (err,especialidad){
    		if (err){
				return res.status(500).json({
                    message: 'Error al crear Especialidad.',
                    error: err
                });
    		}
    		
		});
	}
		return res.status(200);
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
