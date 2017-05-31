package layout;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RatingBar;
import android.widget.TextView;
import android.widget.Toast;

import java.io.UnsupportedEncodingException;
import java.util.List;

import ar.com.itr.vimedo.CustomFragment;
import ar.com.itr.vimedo.R;
import ar.com.itr.vimedo.common.FormularioRegistro;
import ar.com.itr.vimedo.entity.CalificacionIndividual;
import ar.com.itr.vimedo.entity.Especialidad;
import ar.com.itr.vimedo.entity.Profesional;
import ar.com.itr.vimedo.entity.SolicitudMedica;
import ar.com.itr.vimedo.entity.Usuario;
import ar.com.itr.vimedo.interfaces.OnFragmentInteractionListener;
import ar.com.itr.vimedo.util.Constants;

/**
 * A simple {@link CustomFragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link PacCalificarMedico#newInstance} factory method to
 * create an instance of this fragment.
 */
public class PacCalificarMedico extends CustomFragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;

    public PacCalificarMedico() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment PacCalificarMedico.
     */
    // TODO: Rename and change types and number of parameters
    public static PacCalificarMedico newInstance(String param1, String param2) {
        PacCalificarMedico fragment = new PacCalificarMedico();
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
        View view = inflater.inflate(R.layout.fragment_pac_calificarmedico, container, false);
        initScreenComponents(view);
        setEventsFunctionality(view);
        return view;
    }

    private void initScreenComponents(View view) {
        SolicitudMedica sm = activity.getApplicationManager().getSolicitudMedicaPendientePaciente();
        if (sm.getProfesional().getPersonaFisica().getImagen()!=null) {
            ImageView pacienteImage = (ImageView) view.findViewById(R.id.pac_calif_prof_img_id);
            pacienteImage.setImageBitmap(sm.getProfesional().getPersonaFisica().getImagen().getBitmap());
        }
        ((TextView)view.findViewById(R.id.pac_calif_nomape_id)).setText(sm.getProfesional().getPersonaFisica().getNombre()+ " " +sm.getProfesional().getPersonaFisica().getApellido());
        ((TextView)view.findViewById(R.id.pac_calif_especialidad_id)).setText(getEspecialidadesFormatedString(sm.getProfesional().getEspecialidades()));
        ((RatingBar)view.findViewById(R.id.pac_rb_general)).setRating(0f);
        ((RatingBar)view.findViewById(R.id.pac_rb_amabilidad)).setRating(0f);
        ((RatingBar)view.findViewById(R.id.pac_rb_claridad)).setRating(0f);
        ((RatingBar)view.findViewById(R.id.pac_rb_puntualidad)).setRating(0f);
    }

    private void setEventsFunctionality(View view) {
        final View actualView = view;
        final PacCalificarMedico pacCalificarMedico = this;
        // Boton Continuar
        Button continuarBtn = (Button) actualView.findViewById(R.id.btn_calificar);
        continuarBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                CalificacionIndividual calificacion;
                calificacion = getCalificacionData(actualView);
                try {
                    applicationManager.calificarProfesional(calificacion,pacCalificarMedico);
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
            }
        });
    }

    private CalificacionIndividual getCalificacionData(View actualView) {
        Usuario usuario = new Usuario();
        Profesional profesional = new Profesional();
        SolicitudMedica solicitudMedica = new SolicitudMedica();
        usuario.setId(activity.getApplicationManager().getUserLogued().getId());
        profesional.setId(activity.getApplicationManager().getProfesional().getId());
        solicitudMedica.setId(activity.getApplicationManager().getSolicitudMedicaPendientePaciente().getId());
        CalificacionIndividual calificacion = new CalificacionIndividual();
        calificacion.setUsuario(usuario);
        calificacion.setProfesional(profesional);
        calificacion.setSolicitudMedica(solicitudMedica);
        calificacion.setGeneralRating(((RatingBar)actualView.findViewById(R.id.pac_rb_general)).getRating());
        calificacion.setAmabilidadRating(((RatingBar)actualView.findViewById(R.id.pac_rb_amabilidad)).getRating());
        calificacion.setClaridadRating(((RatingBar)actualView.findViewById(R.id.pac_rb_claridad)).getRating());
        calificacion.setPuntualidadRating(((RatingBar)actualView.findViewById(R.id.pac_rb_puntualidad)).getRating());
        return calificacion;
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentMessage("PAC_CALIFICAR_MEDICO",uri);
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

    @Override
    public boolean onBackPressed() {
        return true;
    }

    @Override
    public void processAfterAsyncCall(Integer type, Integer processStatus, String message) {
        Toast toast = Toast.makeText(getContext(), message, Toast.LENGTH_SHORT);
        toast.show();
        switch(type) {
            case Constants.TYPE_CALIFICACION_OK:
                activity.getApplicationManager().loadSolicitudesMedicasPaciente(this);
                break;
            case Constants.TYPE_CARGA_SOLICITUDES_MEDICAS:
                activity.getScreenManager().goToScreen(Constants.SCREEN_PAC_DESKTOP);
                break;
            default:
                break;
        }
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

}