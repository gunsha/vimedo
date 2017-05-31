var CoordenadaProfesionalModel = require('../models/CoordenadaProfesionalModel.js');

module.exports = {
	save: function(req,res){
		var coordenada = {
			profesional:req.body.profesional._id,
			ultimaActualizacion: Date.now(),
			latitud:req.body.latitud,
			longitud:req.body.longitud
		};
		CoordenadaProfesionalModel.findOneAndUpdate({profesional:coordenada.profesional},{$set:coordenada},{upsert:true, new: true},function (err, coordenada){
			if(err){
				return res.status(404).json({
					message: err
				});
			}
			else{
				return res.status(200).json(coordenada);
			}
		});
	},

	list:function(req,res){
		CoordenadaProfesionalModel.find({}).deepPopulate(['profesional.personaFisica','profesional.especialidades']).exec(function (err, coordenadas){
			if(err){
				return res.status(404).json({
					message: err
				});
			}
			else{
				return res.status(200).json(coordenadas);
			}
		});
	}
};