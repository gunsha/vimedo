package layout;

import android.content.Context;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.Toast;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.BitmapDescriptor;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.PolylineOptions;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import ar.com.itr.vimedo.CustomFragment;
import ar.com.itr.vimedo.R;
import ar.com.itr.vimedo.adapters.SolictudesAdapter;
import ar.com.itr.vimedo.entity.SolicitudMedica;
import ar.com.itr.vimedo.entity.map.Location;
import ar.com.itr.vimedo.entity.map.RutaProfesional;
import ar.com.itr.vimedo.entity.map.RutaSimple;
import ar.com.itr.vimedo.interfaces.OnFragmentInteractionListener;
import ar.com.itr.vimedo.util.Constants;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link ProfVisitasPendientes#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ProfVisitasPendientes extends CustomFragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    private SolictudesAdapter adapterSolicitud;
    private ListView solicitudesLV;
    private SolicitudMedica solicitudMedicaSelected;
    private GoogleMap localMap;


    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;

    public ProfVisitasPendientes() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment ProfVisitasPendientes.
     */
    // TODO: Rename and change types and number of parameters
    public static ProfVisitasPendientes newInstance(String param1, String param2) {
        ProfVisitasPendientes fragment = new ProfVisitasPendientes();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_prof_visitas_pendientes, container, false);
        setEventsFunctionality(view, savedInstanceState);
        return view;
    }

    private void loadSolicitudesMedicasRoutes() {
        //activity.getApplicationManager().loadSolicitudesMedicasRoute(this);
        activity.getApplicationManager().loadProfesionalRoutes(this);
    }

    private void setEventsFunctionality(View view, Bundle savedInstanceState) {
        InitComponentSolicitudesList(view);
        InitComponentSolicitudesMap(view, savedInstanceState);
    }

    private void InitComponentSolicitudesMap(View view, Bundle savedInstanceState) {
        MapView mapView = (MapView) view.findViewById(R.id.prof_vis_pen_pacientes_Map_id);
        mapView.onCreate(savedInstanceState);
        mapView.onResume();
        mapView.getMapAsync(new OnMapReadyCallback() {
            @Override
            public void onMapReady(GoogleMap map) {
                localMap = map;
                localMap.getUiSettings().setZoomControlsEnabled(true);
                localMap.getUiSettings().setZoomControlsEnabled(true);
                localMap.getUiSettings().setMapToolbarEnabled(true);
                localMap.getUiSettings().setMyLocationButtonEnabled(true);
                loadSolicitudesMedicasRoutes();
            }
        });
    }

    private void InitComponentSolicitudesList(View view) {
        ListView solicitudesLV = (ListView) view.findViewById(R.id.prof_vis_pen_pacientes_LV_id);
        adapterSolicitud = new SolictudesAdapter(getContext(),activity.getApplicationManager().getSolicitudesMedicasPendientesProfesional());
        solicitudesLV.setAdapter(adapterSolicitud);
        solicitudesLV.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Map<String,Object> params = new HashMap<String,Object>();
                solicitudMedicaSelected = (SolicitudMedica) adapterSolicitud.getItem(position);
                params.put(Constants.MAP_PARAM_NAME_SOLICITUD_MEDICA,solicitudMedicaSelected);
                activity.onFragmentGotoScreen(Constants.SCREEN_PROF_SOL_MED_DETAIL,params);
            }
        });
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
    }

    @Override
    public boolean onBackPressed() {
        return true;
    }

    @Override
    public void processAfterAsyncCall(Integer type, Integer processStatus, String message) {
       switch (type) {
           case Constants.TYPE_CARGA_RUTAS_SOLICITUDES_MEDICAS:
               RutaProfesional rp = activity.getApplicationManager().getProfesional().getRutaProfesional();
               List<RutaSimple> rs = rp.getRutas();
               List<SolicitudMedica> sm = activity.getApplicationManager().getSolicitudesMedicasPendientesProfesional();
               List<Integer> colorList = activity.getApplicationManager().getColorList();
               if (sm!=null && !sm.isEmpty() && rs!=null && rs.size()==sm.size()) {
                   LatLng locationProf = rs.get(0).getInicio();
                   int index=0;
                   for(SolicitudMedica solMed : sm) {
                       PolylineOptions options = new PolylineOptions().width(5).color(colorList.get(index)).geodesic(true);
                       options.addAll(rs.get(index).getRuta());
                       localMap.addPolyline(options);
                       localMap.addMarker(
                               new MarkerOptions()
                                       .position(rs.get(index).getFin())
                                       .title(solMed.getAfiliado().getPersonaFisica().getApellido()+" "+(solMed.getAfiliado().getPersonaFisica().getNombre()))
                                       .snippet("Credencial: "+(solMed.getAfiliado().getCredencial()))
                                       .icon(getMarkerIcon(colorList.get(index))));
                       index++;
                       //add marker
                   }
                   //Posicionar camara sobre el profesional
                   localMap.moveCamera(CameraUpdateFactory.newLatLngZoom(locationProf,15));
                   //add profesional marker
                   localMap.addMarker(new MarkerOptions()
                           .position(locationProf)
                           .title(activity.getApplicationManager().getUserLogued().getProfesional().getPersonaFisica().getNombre()+" "+(activity.getApplicationManager().getUserLogued().getProfesional().getPersonaFisica().getApellido()))
                           .snippet("MP: "+activity.getApplicationManager().getUserLogued().getProfesional().getMatriculaProvincial())
                           .icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_GREEN)));

               }
               localMap.setOnMarkerClickListener(new GoogleMap.OnMarkerClickListener() {
                   @Override
                   public boolean onMarkerClick(Marker marker) {
                       Toast toast = Toast.makeText(getContext(), marker.getTitle(), Toast.LENGTH_SHORT);
                       toast.show();
                       return false;
                   }
               });
               break;
           default:
                break;
       }
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
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

    private BitmapDescriptor getMarkerIcon(int color) {
        float[] hsv = new float[3];
        Color.colorToHSV(color, hsv);
        return BitmapDescriptorFactory.defaultMarker(hsv[0]);
    }

}
