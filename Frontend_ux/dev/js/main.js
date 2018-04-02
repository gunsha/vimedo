var componentForm = {
    street_number: {
        type: 'short_name',
        name: 'numero'
    },
    route: {
        type: 'long_name',
        name: 'calle'
    },
    locality: {
        type: 'short_name',
        name: 'localidad'
    },
    administrative_area_level_1: {
        type: 'long_name',
        name: 'provincia'
    },
    country: {
        type: 'long_name',
        name: 'pais'
    },
    postal_code: {
        type: 'short_name',
        name: 'cp'
    },
    sublocality_level_1:{
        type: 'short_name',
        name: 'localidad'
    }
};

var visitaPromedio = 30;

function _getDemoraTime(segundos,visita,solicitudes){
    if(!visita)
        visita = visitaPromedio;
    if(!solicitudes)
        solicitudes = 0;
    if(solicitudes>1){
        segundos += (visita*solicitudes)*60
    }

    var minutosTotales = segundos/60;
    var horas = Math.floor(minutosTotales/60);
    var minutos = Math.floor(minutosTotales%60);
    return [segundos,(horas>0 ? horas + 'h ':' ')+(minutos>0?minutos+'m ':'')]
}

function _getRequestRuta(solicitud,profesional){
    var latlng = new google.maps.LatLng(solicitud.domicilio.latitud, solicitud.domicilio.longitud);
        var ultimoDomicilio;
        var wps = [];

        wps.push({
            location: new google.maps.LatLng(profesional.personaFisica.domicilios[0].latitud, profesional.personaFisica.domicilios[0].longitud),
            stopover: false
        })

        if(profesional.solicitudesMedicas.length != 0){
            var solicitudes = profesional.solicitudesMedicas;
            for (var i = 0; i < solicitudes.length; i++) {
                wps.push({
                    location: new google.maps.LatLng(solicitudes[i].domicilio.latitud, solicitudes[i].domicilio.longitud),
                    stopover: true
                })
            }
        }

        wps.push({
            location: latlng,
            stopover: true
        })

        return {
            origin: wps[0].location,
            destination: wps[wps.length-1].location,
            waypoints: wps,
            optimizeWaypoints: false,
            travelMode: google.maps.TravelMode.DRIVING
          };
}

function getDireccion(place){
    var direccion = {};
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType].type];
            // document.getElementById(addressType).value = val;
            direccion[componentForm[addressType].name] = val;
        }
    }
    direccion.latitud = place.geometry.location.lat();
    direccion.longitud = place.geometry.location.lng();
    direccion.coordenadas = place.geometry.location.lat() + ',' + place.geometry.location.lng();
    return direccion;
}

var monthsShortDot$1 = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_');
var monthsShort$2 = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');

moment.defineLocale('es', {
    months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
    monthsShort: function(m, format) {
        if (!m) {
            return monthsShortDot$1;
        } else if (/-MMM-/.test(format)) {
            return monthsShort$2[m.month()];
        } else {
            return monthsShortDot$1[m.month()];
        }
    },
    monthsParseExact: true,
    weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
    weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
    weekdaysMin: 'do_lu_ma_mi_ju_vi_sá'.split('_'),
    weekdaysParseExact: true,
    longDateFormat: {
        LT: 'H:mm',
        LTS: 'H:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D [de] MMMM [de] YYYY',
        LLL: 'D [de] MMMM [de] YYYY H:mm',
        LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
    },
    calendar: {
        sameDay: function() {
            return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        nextDay: function() {
            return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        nextWeek: function() {
            return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        lastDay: function() {
            return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        lastWeek: function() {
            return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        sameElse: 'L'
    },
    relativeTime: {
        future: 'en %s',
        past: 'hace %s',
        s: 'unos segundos',
        m: 'un minuto',
        mm: '%d minutos',
        h: 'una hora',
        hh: '%d horas',
        d: 'un día',
        dd: '%d días',
        M: 'un mes',
        MM: '%d meses',
        y: 'un año',
        yy: '%d años'
    },
    dayOfMonthOrdinalParse: /\d{1,2}º/,
    ordinal: '%dº',
    week: {
        dow: 1, // Monday is the first day of the week.
        doy: 4 // The week that contains Jan 4th is the first week of the year.
    }
});