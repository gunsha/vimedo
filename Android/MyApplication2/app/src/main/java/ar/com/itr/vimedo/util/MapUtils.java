package ar.com.itr.vimedo.util;

import com.google.android.gms.maps.model.LatLng;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import ar.com.itr.vimedo.entity.map.RutaProfesional;
import ar.com.itr.vimedo.entity.map.RutaSimple;

/**
 * Created by pablo_rizzo on 20/12/2016.
 */

public final class MapUtils {
    public static RutaProfesional getRutaProfesionalFromGoogleResponse(JSONObject routesDetail) {
        RutaProfesional rutas = new RutaProfesional();
        List<RutaSimple> rutaList = new ArrayList<RutaSimple>();
        //List<LatLng> marcadores = new ArrayList<LatLng>();
        try {
            JSONObject routes = routesDetail.getJSONArray("routes").getJSONObject(0);
            JSONArray legs = routes.getJSONArray("legs");
            // Leo cada ruta independiente
            for(int index=0;index<legs.length();index++) {
                RutaSimple rs = new RutaSimple();
                Double inicioLat;
                Double inicioLng;
                Double finLat;
                Double finLng;
                JSONObject leg = legs.getJSONObject(index);
                rs.setDistancia(leg.getJSONObject("distance").getString("text"));
                rs.setDuracion(leg.getJSONObject("duration").getString("text"));
                inicioLat = new Double(leg.getJSONObject("start_location").getString("lat"));
                inicioLng = new Double(leg.getJSONObject("start_location").getString("lng"));
                finLat = new Double(leg.getJSONObject("end_location").getString("lat"));
                finLng = new Double(leg.getJSONObject("end_location").getString("lng"));
                rs.setInicio(new LatLng(inicioLat,inicioLng));
                rs.setFin(new LatLng(finLat,finLng));
                // Leo los step de la ruta
                JSONArray steps = leg.getJSONArray("steps");
                List<LatLng> polilyne = new ArrayList<LatLng>();
                polilyne.add(rs.getInicio());
                for(int indexSteps=0;indexSteps<steps.length();indexSteps++) {
                    JSONObject step = steps.getJSONObject(indexSteps);
                    Double stepLat = new Double(step.getJSONObject("start_location").getString("lat"));
                    Double stepLng = new Double(step.getJSONObject("start_location").getString("lng"));
                    polilyne.add(new LatLng(stepLat,stepLng));
                }
                polilyne.add(rs.getFin());
                rs.setRuta(polilyne);
                rutaList.add(rs);
            }
            rutas.setRutas(rutaList);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return rutas;
    }

    private List<LatLng> decodePoly(String encoded) {
        List<LatLng> poly = new ArrayList<LatLng>();
        int index = 0, len = encoded.length();
        int lat = 0, lng = 0;
        while (index < len) {
            int b, shift = 0, result = 0;
            do {
                b = encoded.charAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            int dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
            lat += dlat;
            shift = 0;
            result = 0;
            do {
                b = encoded.charAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            int dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
            lng += dlng;
            LatLng p = new LatLng((double) lat / 1E5, (double) lng / 1E5);
            poly.add(p);
        }
        return poly;
    }
}
