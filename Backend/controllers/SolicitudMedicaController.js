var SolicitudMedicaModel = require('../models/SolicitudMedicaModel.js');
var CoordenadaProfesionalModel = require('../models/CoordenadaProfesionalModel.js');
var https = require('https');
var config = require('../_config');

module.exports = {


    listByUsuario: function (req, res) {
        SolicitudMedicaModel
        .find({usuario:req.params.idUsuario,fechaBaja:null})
        .deepPopulate(["usuario","afiliado","domicilio","antecedentesMedicos","profesional.especialidades","profesional.personaFisica.imagen","profesional.personaFisica.telefonos","profesional.personaFisica.domicilios","profesional.usuario"])
        .exec(function (err, solicitudesMedicas) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting SolicitudesMedicas.',
                    error: err
                });
            }
            var result=[]
            if(solicitudesMedicas){
                for(var i=0;i<solicitudesMedicas.length;i++){
                    solicitudesMedicas[i].afiliado.usuario=null;
                    solicitudesMedicas[i].afiliado.personaFisica=null;
                    solicitudesMedicas[i].afiliado.grupoFamiliar=null;
                    solicitudesMedicas[i].afiliado.prepagas=null;
                    //if(solicitudesMedicas[i].profesional){
                        //solicitudesMedicas[i].profesional.usuario=null;
                        //solicitudesMedicas[i].profesional.personaFisica=null;
                    //}
                    
                    result.push(solicitudesMedicas[i]);
                }
            }
            
            
            return res.json(result);
        });
    },

    listByProfesional: function (req, res) {
        SolicitudMedicaModel.find({profesional:req.params.idProfesional,fechaBaja:null})
        .deepPopulate(["usuario","afiliado.personaFisica.imagen","afiliado.personaFisica.domicilios","afiliado.personaFisica.telefonos","domicilio","antecedentesMedicos","profesional.especialidades"])
        .exec(function (err, solicitudesMedicas) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting SolicitudesMedicas.',
                    error: err
                });
            }
            var result=[]
            if(solicitudesMedicas){
                for(var i=0;i<solicitudesMedicas.length;i++){
                    solicitudesMedicas[i].afiliado.usuario=null;
                    if(solicitudesMedicas[i].profesional){
                        solicitudesMedicas[i].profesional.usuario=null;
                        solicitudesMedicas[i].profesional.personaFisica=null;
                    }
                    
                    result.push(solicitudesMedicas[i]);
                }
            }
            
            
            return res.json(result);
        });
    },

    list:function(req,res){
        SolicitudMedicaModel.find({fechaBaja:null}).deepPopulate(["usuario","afiliado.personaFisica","domicilio","profesional.personaFisica","antecedentesMedicos"]).exec(function (err, solicitudesMedicas) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting SolicitudesMedicas.',
                    error: err
                });
            }
            return res.json(solicitudesMedicas);
        });
    },

    get:function(req,res){
        SolicitudMedicaModel.findOne({_id:req.params.idSolicitud}).deepPopulate(["usuario","afiliado.personaFisica","domicilio","profesional.personaFisica","antecedentesMedicos"]).exec(function (err, solicitud) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting SolicitudesMedicas.',
                    error: err
                });
            }
            return res.json(solicitud);
        });
    },

    darDeBaja:function(req,res){
        SolicitudMedicaModel.findOneAndUpdate({_id:req.params.idSolicitud},{$set:{estado:2}}, {new: true}).exec(function (err, solicitud){
            if(err){
                return res.status(500).json({
                    message: 'Error al actualizar solicitud.',
                    error: err
                });
            }
            else{
                return res.status(200).json({});
            }
        });
    },

    getUltimosDomicilios: function (req,res){
        SolicitudMedicaModel.find({usuario:req.params.idUsuario}).distinct("domicilio").deepPopulate(["domicilio"]).exec(function (err, solicitudesMedicas) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting SolicitudesMedicas.',
                    error: err
                });
            }
            else if(solicitudesMedicas){
                var result=[];
                for(var i = 0; i< solicitudesMedicas.length;i++){
                    result.push(solicitudesMedicas[i].domicilio);
                }
                return res.json(result);
            }
            else{
                return res.status(500).json({
                    message: 'No se han encontrado ultimos domicilios.'
                });
            }
            
        });
    },

    save: function (req, res){
        var antecedentesMedicos=[]
        for (var i=0;i<req.body.antecedentesMedicos.length;i++){
            antecedentesMedicos.push(req.body.antecedentesMedicos[i]._id);
        }
        var now=Date.now();
        var solicitud = new SolicitudMedicaModel({
            sintomas: req.body.sintomas,
            horasSintomas:req.body.horasSintomas,
            minutosSintomas:req.body.minutosSintomas,
            usuario:req.body.usuario._id,
            afiliado:req.body.afiliado._id,
            domicilio:req.body.domicilio._id,
            antecedentesMedicos:antecedentesMedicos,
            fechaAlta:now,
            fechaModificacion:now,
            estado:0
        });

        solicitud.save(function (err, solicitudMedica){
            if(err){
                return res.status(500).json({
                    message: 'Error al crear la solicitud.',
                    error: err
                });
            }
            else{
                SolicitudMedicaModel.findOne({_id:solicitudMedica._id}).deepPopulate(["usuario","afiliado","domicilio","antecedentesMedicos","profesional"]).exec(function (err, solicitud){
                    solicitud.afiliado.usuario=null;
                    solicitud.afiliado.grupoFamiliar=null;
                    solicitud.afiliado.personaFisica=null;
                    solicitud.afiliado.prepagas=null;
                    return res.json(solicitud);
                });
                
            }
        });
    },

    setProfesionalSolicitud: function (req, res){
        SolicitudMedicaModel.findOneAndUpdate({_id:req.body.solicitudMedica._id},{$set:{profesional:req.body.profesional._id, estado:1, fechaModificacion:Date.now()}}, {new: true}).exec(function (err, solicitud){
            if(err){
                return res.status(500).json({
                    message: 'Error al actualizar solicitud.',
                    error: err
                });
            }
            else{
                return res.json(solicitud);
                //solicitud.profesional=req.body.profesional._id;
                //solicitud.save(function (err, solicitudUpdated){
                //    return res.json(solicitudUpdated);
                //});  
            }
        });
    },

    deleteAll: function (req,res){
        SolicitudMedicaModel.remove({},function (){
            return res.status(200).json({
                message: 'Borraste las solicitudes Pablo!!'
            });
        });
    },

    getRuta: function (req, res){
        var solicitud;
        var coordenada;
        SolicitudMedicaModel.findOne({_id:req.params.id,fechaBaja:null}).deepPopulate(['profesional']).exec(function (err,solicitud){
            var error=false;
            if(err){
                return res.status(500).json({
                    message: 'Error obtener la ruta de la solicitud.',
                    error: err
                });
            }
            else if(solicitud && solicitud.profesional != null){
                solicitud=solicitud;
                CoordenadaProfesionalModel.findOne({profesional:solicitud.profesional._id}, function (err, coordenada){
                    if(err){
                        return res.status(500).json({
                            message: 'Error obtener la ruta de la solicitud.',
                            error: err
                        });
                    }
                    else if(coordenada){
                        coordenada=coordenada;
                        SolicitudMedicaModel.find({profesional:solicitud.profesional._id,fechaBaja:null}).sort({ fechaModificacion: 1 }).deepPopulate(['domicilio','profesional']).exec(function (err,solicitudes){
                            var origen = '?origin='+ coordenada.latitud + ',' + coordenada.longitud;
                            //var origen = '?origin='+ '-34.6037687' + ',' + '-58.37924239999999';
                            //var origen = '?origin=Buenos Aires Capital Federal Corrientes 880';
                            var indice=0;
                            var solicitudLimite=req.params.id;
                            for(var i=0;i<solicitudes.length;i++){
                                indice=i;
                                if(solicitudes[i]._id==solicitudLimite){
                                    break;
                                }
                            }
                            var destino = '&destination='+ solicitudes[ indice ].domicilio.provincia + " " + solicitudes[ indice ].domicilio.localidad + ' ' + solicitudes[ indice ].domicilio.calle + ' ' + solicitudes[ indice ].domicilio.numero ;
                            var apiKey = '&key=' + config.googleMaps.apiKey;
                            var waypoints='&waypoints=';
                            for(var i = 0;i< indice ;i++){
                                if(i>0){
                                    waypoints=waypoints+"|";
                                }
                                var waypoint = solicitudes[ i ].domicilio.provincia + " " + solicitudes[ i ].domicilio.localidad + ' ' + solicitudes[ i ].domicilio.calle + ' ' + solicitudes[ i ].domicilio.numero ;
                                waypoints=waypoints+waypoint;
                            }

                            var url = config.googleMaps.directionUrl + origen + destino + waypoints +apiKey;

                            var request = https.get(url, function(response) {
                                var body = '';
                                var statusCode = response.statusCode;
                                response.on('data', function(d) {
                                    body += d;
                                });
                                response.on('end', function() {
                                    if(statusCode == 200){
                                        return res.status(200).json(JSON.parse(body));
                                    }
                                    else{
                                        return res.status(statusCode).json({
                                            error: body
                                        });
                                    }
                                });
                                response.on('error', function() {
                                    return res.status(404).json({
                                        message: 'Error obtener la ruta de la solicitud.',
                                        error: err
                                    });
                                });
                            });
                            request.on('error', function(err) {
                                return res.status(404).json({
                                        message: 'Error obtener la ruta de la solicitud.',
                                        error: err
                                    });
                            });
                        });
                    }
                    else{
                        error=true;
                    }
                });
            }
            else{
                error=true;
            }
            if(error){
               return res.status(500).json({
                    message: 'No se ha encontrado la ruta para solicitud con id '+req.params.id
                }); 
            }
        });
    },

    getRutaProfesional: function (req, res){
        var solicitud;
        var coordenada;
        SolicitudMedicaModel.find({profesional:req.params.idProfesional,estado:1}).sort({ fechaModificacion: 1 }).deepPopulate(['domicilio','profesional']).exec(function (err,solicitudes){
            var error=false;
            if(err){
                return res.status(500).json({
                    message: 'Error obtener la ruta de la solicitud.',
                    error: err
                });
            }

            else if(solicitudes && solicitudes.length>0){
                solicitudes=solicitudes;
                CoordenadaProfesionalModel.findOne({profesional:req.params.idProfesional}, function (err, coordenada){
                    if(err){
                        return res.status(500).json({
                            message: 'Error obtener la ruta de la solicitud.',
                            error: err
                        });
                    }
                    else if(coordenada){
                        coordenada=coordenada;
                        var origen = '?origin='+ coordenada.latitud + ',' + coordenada.longitud;
                        //var origen = '?origin='+ '-34.6037687' + ',' + '-58.37924239999999';
                        //var origen = '?origin=Buenos Aires Capital Federal Corrientes 880';
                        var indice=0;
                        var solicitudLimite=req.query.solicitud;
                        for(var i=0;i<solicitudes.length;i++){
                            indice=i;
                            if(solicitudes[i]._id==solicitudLimite){
                                break;
                            }
                        }
                        var destino = '&destination='+ solicitudes[ indice ].domicilio.provincia + " " + solicitudes[ indice ].domicilio.localidad + ' ' + solicitudes[ indice ].domicilio.calle + ' ' + solicitudes[ indice ].domicilio.numero ;
                        var apiKey = '&key=' + config.googleMaps.apiKey;
                        var waypoints='&waypoints=';
                        for(var i = 0;i< indice ;i++){
                            if(i>0){
                                waypoints=waypoints+"|";
                            }
                            var waypoint = solicitudes[ i ].domicilio.provincia + " " + solicitudes[ i ].domicilio.localidad + ' ' + solicitudes[ i ].domicilio.calle + ' ' + solicitudes[ i ].domicilio.numero ;
                            waypoints=waypoints+waypoint;
                        }

                        var url = config.googleMaps.directionUrl + origen + destino + waypoints +apiKey;

                        var request = https.get(url, function(response) {
                            var body = '';
                            var statusCode = response.statusCode;
                            response.on('data', function(d) {
                                body += d;
                            });
                            response.on('end', function() {
                                if(statusCode == 200){
                                    return res.status(200).json(JSON.parse(body));
                                }
                                else{
                                    return res.status(statusCode).json({
                                        error: body
                                    });
                                }
                            });
                            response.on('error', function() {
                                return res.status(404).json({
                                    message: 'Error obtener la ruta de la solicitud.',
                                    error: err
                                });
                            });
                        });
                        request.on('error', function(err) {
                            return res.status(404).json({
                                    message: 'Error obtener la ruta de la solicitud.',
                                    error: err
                                });
                        });
                    }
                    else{
                        error=true;
                    }
                });
            }
            else{
                error=true;
            }
            if(error){
               return res.status(500).json({
                    message: 'No se ha encontrado la solicitud con id '+req.params.idProfesional
                }); 
            }
        });
    }

};
