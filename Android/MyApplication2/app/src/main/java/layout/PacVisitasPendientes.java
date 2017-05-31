package layout;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RatingBar;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.PolylineOptions;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import ar.com.itr.vimedo.CustomFragment;
import ar.com.itr.vimedo.R;
import ar.com.itr.vimedo.entity.Especialidad;
import ar.com.itr.vimedo.entity.Profesional;
import ar.com.itr.vimedo.entity.SolicitudMedica;
import ar.com.itr.vimedo.entity.Usuario;
import ar.com.itr.vimedo.entity.map.RutaProfesional;
import ar.com.itr.vimedo.entity.map.RutaSimple;
import ar.com.itr.vimedo.interfaces.OnFragmentInteractionListener;
import ar.com.itr.vimedo.util.Constants;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link PacVisitasPendientes#newInstance} factory method to
 * create an instance of this fragment.
 */
public class PacVisitasPendientes extends CustomFragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private GoogleMap localMap;
    private View actualView;

    private OnFragmentInteractionListener mListener;

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
                if (sm!=null && !sm.isEmpty()) {
                    LatLng locationProf = rs.get(0).getInicio();
                    //Posicionar camara sobre el profesional
                    localMap.moveCamera(CameraUpdateFactory.newLatLngZoom(locationProf,15));
                    //add profesional marker
                    localMap.addMarker(new MarkerOptions()
                            .position(locationProf)
                            .title(activity.getApplicationManager().getProfesional().getPersonaFisica().getNombre()+" "+(activity.getApplicationManager().getProfesional().getPersonaFisica().getApellido()))
                            .snippet("MP: "+activity.getApplicationManager().getProfesional().getMatriculaProvincial())
                            .icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_GREEN)));
                    updateTiempoEstimado(rp);
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

    public PacVisitasPendientes() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment PacVisitasPendientes.
     */
    // TODO: Rename and change types and number of parameters
    public static PacVisitasPendientes newInstance(String param1, String param2) {
        PacVisitasPendientes fragment = new PacVisitasPendientes();
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
        View view = inflater.inflate(R.layout.fragment_pac_visitas_pendientes, container, false);
        actualView = view;
        initScreenComponents(view);
        setEventsFunctionality(view,savedInstanceState );
        return view;
    }

    private void initScreenComponents(View view) {
        SolicitudMedica sm = activity.getApplicationManager().getSolicitudMedicaPendientePaciente();
        if (sm.getProfesional()==null || sm.getProfesional().getId()==null || sm.getProfesional().getId().isEmpty()) {
            ((LinearLayout)view.findViewById(R.id.pac_vis_pen_no_asignado_container_id)).setVisibility(View.VISIBLE);
        } else {
            ((LinearLayout)view.findViewById(R.id.pac_vis_pen_asignado_container_id)).setVisibility(View.VISIBLE);
            if (sm.getProfesional().getPersonaFisica().getImagen()!=null) {
                ImageView pacienteImage = (ImageView) view.findViewById(R.id.pac_vis_pen_prof_img_id);
                pacienteImage.setImageBitmap(sm.getProfesional().getPersonaFisica().getImagen().getBitmap());
            }
            ((TextView)view.findViewById(R.id.pac_vis_pen_nomape_id)).setText(sm.getProfesional().getPersonaFisica().getNombre()+ " " +sm.getProfesional().getPersonaFisica().getApellido());
            ((TextView)view.findViewById(R.id.pac_vis_pen_especialidad_id)).setText(getEspecialidadesFormatedString(sm.getProfesional().getEspecialidades()));
            ((TextView)view.findViewById(R.id.pac_vis_pen_perfil_id)).setText(sm.getProfesional().getPerfil());
            ((TextView)view.findViewById(R.id.pac_vis_pen_horario_estimado_arrivo_id)).setText("Tiempo no determinado");
            ((RatingBar)view.findViewById(R.id.pac_vis_pen_ratingBar)).setRating(calculateRating(sm.getProfesional()));
        }
    }

    private void updateTiempoEstimado(RutaProfesional rp) {
        DateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");
        String horarioMessage = dateFormat.format(calculateTiempoEstimado(rp.getRutas()));
        if (horarioMessage!=null && !horarioMessage.isEmpty()) {
            ((TextView)actualView.findViewById(R.id.pac_vis_pen_horario_estimado_arrivo_id)).setText(horarioMessage);
        }
    }

    private Date calculateTiempoEstimado(List<RutaSimple> rp) {
        Date retValue = null;
        if (rp!=null && rp.size()>0) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(new Date());
            for (RutaSimple ruta : rp){
                String[] tiempoArray = ruta.getDuracion().split(" ");
                if (tiempoArray.length<3) {
                    calendar.add(Calendar.MINUTE,Integer.parseInt(tiempoArray[0]));
                } else if (tiempoArray.length<5) {
                    calendar.add(Calendar.HOUR,Integer.parseInt(tiempoArray[0]));
                    calendar.add(Calendar.MINUTE,Integer.parseInt(tiempoArray[2]));
                }
            }
            calendar.add(Calendar.MINUTE,Constants.MINUTES_ATENTION * (rp.size()-1));
            retValue = calendar.getTime();
        }
        return retValue;
    }

    private void setEventsFunctionality(View view, Bundle savedInstanceState) {
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

    private void loadSolicitudesMedicasRoutes() {
        activity.getApplicationManager().loadSolicitudesMedicasRoute(this);
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentMessage("VISITAS PENDIENTES",uri);
        }
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof OnFragmentInteractionListener) {
            mListener = (OnFragmentInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement OnFragmentInteractionListener");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    private String getEspecialidadesFormatedString (List<Especialidad> especialidades) {
        StringBuffer sb = new StringBuffer();
        int index = 0;
        for(Especialidad esp : especialidades) {
            sb.append(esp.getNombre());
            if (index<(especialidades.size()-1)) {
                sb.append(", ");
            }
            index++;
        }
        return sb.toString();
    }

    private float calculateRating(Profesional prof) {
        return (prof.getGeneralRating()+prof.getAmabilidadRating()+prof.getClaridadRating()+prof.getPuntualidadRating())/4;
    }
}
