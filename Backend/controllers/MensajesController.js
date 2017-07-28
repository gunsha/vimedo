var SolicitudMedicaModel = require('../models/SolicitudMedicaModel.js');
var UsuarioModel = require('../models/UsuarioModel.js');
var MensajeModel = require('../models/MensajeModel.js');
var mongoose = require('mongoose');

module.exports = {

    list: function(req, res) {
        var find = {};
        if (req.params.pro)
            find.profesional = req.params.id;
        else
            find.afiliado = req.params.id;
        SolicitudMedicaModel.find(find)
            .deepPopulate(["afiliado.personaFisica", "profesional.personaFisica"])
            .exec(function(err, sols) {
                if (err) {
                    return res.status(406).json({
                        message: 'Error when getting Admin.',
                        error: err
                    });
                }
                var execCount = 0;
                var msgsa = [];
                sols.forEach(function(e, i) {
                    msgsa[i] = [];
                    MensajeModel.find({
                            solicitud: sols[i]._id
                        })
                        .exec(function(err, msgs) {
                            if (err) {
                                return res.status(406).json({
                                    message: 'Error when getting Admin.',
                                    error: err
                                });
                            }
                            execCount++;
                            msgsa[i] = msgs;
                            if (execCount == sols.length) {
                                var response = [];
                                for (var a = 0; a < sols.length; a++) {
                                    var sol = clone(sols[a]);
                                    sol.msgs = msgsa[a];
                                    if (msgsa[a].length !== 0)
                                        sol.lastMsg = msgsa[a][msgsa[a].length - 1];
                                    response.push(sol);
                                }
                                return res.json(response);

                                // return res.json({'s':sols,'msgs':msgsa});
                            }
                        });
                });
            });
    },
    listBySol: function(req, res) {
        SolicitudMedicaModel.findOne({
                _id: req.params.id
            })
            .exec(function(err, sol) {
                if (err) {
                    return res.status(406).json({
                        message: 'Error actualizando los mensajes',
                        error: err
                    });
                }
                MensajeModel.find({
                        solicitud: sol._id
                    })
                    .exec(function(err, msgs) {
                        if (err) {
                            return res.status(406).json({
                                message: 'Error actualizando los mensajes',
                                error: err
                            });
                        }
                        return res.json({
                            s: sol.estado,
                            msgs: msgs
                        });
                    });
            });
    },
    create: function(req, res) {
        var mensaje = new MensajeModel({
            message: req.body.msg,
            from: req.body.idFrom,
            to: req.body.idTo,
            solicitud: req.body.idSol,
            send: new Date(),
            read: false
        });
        mensaje.save(function(err, msg) {
            if (err) {
                return res.status(406).json({
                    message: 'Error al enviar su mensaje, intente mas tarde.',
                    error: err
                });
            }
            return res.status(200).json(msg);
        });
    },
    markAsRead: function(req, res) {
        MensajeModel.update({
            _id: {
                $in: req.body
            }
        }, {
            $set: {
                read: true
            }
        }, { 
        multi: true 
      },function(err,msg){
        	return res.status(200).json({message:''});
        });
    }
};

function clone(a) {
    return JSON.parse(JSON.stringify(a));
}