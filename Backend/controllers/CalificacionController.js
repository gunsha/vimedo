var CalificacionModel = require('../models/CalificacionModel.js');
var SolicitudMedicaModel = require('../models/SolicitudMedicaModel.js');


module.exports = {


    save: function (req, res) {
    	var calificacion = new CalificacionModel({
    		profesional:req.body.profesional._id,
            usuario:req.body.usuario._id,
            generalRating:req.body.generalRating,
            amabilidadRating:req.body.amabilidadRating,
            claridadRating:req.body.claridadRating,
            puntualidadRating:req.body.puntualidadRating
    	});
    	calificacion.save(function (err,calificacion){
    		if (err){
				return res.status(500).json({
                    message: 'Error al crear calificacion.',
                    error: err
                });
    		}
    		else{
                if(req.body.solicitudMedica && req.body.solicitudMedica._id){
                    SolicitudMedicaModel.findOneAndUpdate({_id:req.body.solicitudMedica._id},{$set:{estado:3,fechaBaja:Date.now()}}, {new: true}).exec(function (err, solicitud){
                        return res.json(calificacion);
                    });
                }
                else{
                    return res.json(calificacion);
                }
    		}
    	});
    },

    update:function(req,res){
        CalificacionModel.findOneAndUpdate({_id:req.params.idCalificacion},{$set:{generalRating:req.body.generalRating, amabilidadRating:req.body.amabilidadRating, claridadRating:req.body.claridadRating, puntualidadRating:req.body.puntualidadRating}}, {new: true}).exec(function (err, calificacion){
            if(err){
                return res.status(500).json({
                    message: 'Error al actualizar calificacion.',
                    error: err
                });
            }
            else{
                return res.json(calificacion);
            }
        });
    },

    listByUsuario: function (req, res) {
    	CalificacionModel.find({usuario:req.params.idUsuario},function (err,calificaciones){
    		if (err){
				return res.status(500).json({
                    message: 'Error al traer calificaciones.',
                    error: err
                });
    		}
    		else{
    			return res.json(calificaciones);
    		}
    	});
    },

    listByProfesional: function (req, res) {
        CalificacionModel.find({profesional:req.params.idProfesional},function (err,calificaciones){
            if (err){
                return res.status(500).json({
                    message: 'Error al recuperar calificaciones del profesional.',
                    error: err
                });
            }
            else{
                var result = {};
                console.log("calificaciones",calificaciones);
                if(calificaciones){
                    result.generalRating=0;
                    result.amabilidadRating=0;
                    result.claridadRating=0;
                    result.puntualidadRating=0;
                    for(var i=0;i<calificaciones.length;i++){
                        result.generalRating+=calificaciones[i].generalRating;
                        result.amabilidadRating+=calificaciones[i].amabilidadRating;
                        result.claridadRating+=calificaciones[i].claridadRating;
                        result.puntualidadRating+=calificaciones[i].puntualidadRating;
                    }
                    result.generalRating=result.generalRating / calificaciones.length;
                    result.amabilidadRating=result.amabilidadRating / calificaciones.length;
                    result.claridadRating=result.claridadRating / calificaciones.length;
                    result.puntualidadRating=result.puntualidadRating / calificaciones.length;
                }
                return res.json(result);
            }
        });
    }

};
