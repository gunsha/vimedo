//metodo general para controlar la validacion, tener en cuenta si mas adelante produce problemas que todos los controladores usen el mismo.
var validate  = {
	errorElement: 'span',
	errorClass: 'help-inline',
	focusInvalid: false,
	rules: null,
	messages: null,
	invalidHandler: function (event, validator) { //display error alert on form submit   
	},
	highlight: function (e) {
		$(e).closest('.form-group').removeClass('info').addClass('error');
	},
	success: function (e) {
		$(e).closest('.form-group').removeClass('error').addClass('info');
		$(e).remove();

	},
	errorPlacement: function (error, element) {
		if(element.is(':checkbox') || element.is(':radio')) {
			var controls = element.closest('.controls');
			if(controls.find(':checkbox,:radio').length > 1) controls.append(error);
			else error.insertAfter(element.nextAll('.lbl:eq(0)').eq(0));
		}
		else if(element.is('.select2')) {
			error.insertAfter(element.siblings('[class*="select2-container"]:eq(0)'));
		}
		else if(element.is('.chzn-select')) {
			error.insertAfter(element.siblings('[class*="chzn-container"]:eq(0)'));
		}
		else error.insertAfter(element);
	},
	submitHandler: function (form) {
	},
	invalidHandler: function (form) {
	}
};

var validateV2  = {
	errorElement: 'span',
	errorClass: 'help-inline',
	focusInvalid: false,
	rules: null,
	messages: null,
	invalidHandler: function (event, validator) { // display error alert on form submit
	},
	highlight: function (e) {
		$(e).closest('.form-group').removeClass('info').addClass('error');
	},
	success: function (e) {

		var $currentElement = $(e[0].outerHTML);
		var fort=$currentElement[0].getAttribute("id");
		$("#"+$currentElement[0].getAttribute("id")).closest('.form-group').removeClass('error');

		$(e).closest('.form-group').removeClass('error').addClass('info');
		$(e).remove();


		
	},
	errorPlacement: function (error, element) {
		var errorContainer = $(element).attr('errorTarget');
		$(element).addClass('conError');
		if(errorContainer != null && errorContainer != '') {
			$(error).css('display','block');
			$(error).css('color','red');
			error.appendTo('.'+errorContainer);	
		}else if (element.is(':checkbox') || element.is(':radio')) {
			var controls = element.closest('.controls');
			if (controls.find(':checkbox,:radio').length > 1) controls.append(error);
			else error.insertAfter(element.nextAll('.lbl:eq(0)').eq(0));
		} else if (element.is('.select2')) {
			error.insertAfter(element.siblings('[class*="select2-container"]:eq(0)'));
		} else if (element.is('.chzn-select')) {
			error.insertAfter(element.siblings('[class*="chzn-container"]:eq(0)'));
		} else if (element.is('.date-picker')) {
			error.insertAfter(element.siblings('[class*="add-on"]:eq(0)'));
		} else {
			error.insertAfter(element);
		}
	},
	submitHandler: function (form) {
	},
	invalidHandler: function (form) {
	}
};
//metodo general para bloquear la pantalla(util para llamados rest asincronicos)
var bloquearPantalla=function(){
	$.blockUI({ message: null }); 
};
//metodo general para desbloquear la pantalla(util para llamados rest asincronicos)
var desbloquearPantalla=function(){
	$.unblockUI();
};

var decodePolyline = function(str, precision) {
    var index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte = null,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, precision || 5);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {{}

        // Reset shift, result, and byte
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push({lat:lat / factor, lng: lng / factor});
    }

    return coordinates;
};

var getColor = function(){
	var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};
