var express = require("express");
var app     = express();
var path    = require("path");


app.use(express.static(path.join(__dirname, 'public')));

app.get('/socios/:id',function(req,res){






     res.end(`{
				"nombre":"nombre",
				"apellido":"apellido",
				"nacimiento":"12.28.1968",
				"tipo_documento":"DNI",
				"nro_documento":"2012341234",
				"grupoFamiliar":[]
			}`);

});

app.listen(8008);

console.log("Running at Port 8008");
