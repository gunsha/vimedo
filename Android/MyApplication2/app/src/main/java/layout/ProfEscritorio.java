package layout;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import java.util.List;

import ar.com.itr.vimedo.CustomFragment;
import ar.com.itr.vimedo.R;
import ar.com.itr.vimedo.entity.Especialidad;
import ar.com.itr.vimedo.entity.Profesional;
import ar.com.itr.vimedo.interfaces.OnFragmentInteractionListener;
import ar.com.itr.vimedo.util.Constants;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link ProfEscritorio#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ProfEscritorio extends CustomFragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;

    public ProfEscritorio() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment ProfEscritorio.
     */
    // TODO: Rename and change types and number of parameters
    public static ProfEscritorio newInstance(String param1, String param2) {
        ProfEscritorio fragment = new ProfEscritorio();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentMessage("PROF_DESKTOP",uri);
        }
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
        View view = inflater.inflate(R.layout.fragment_prof_escritorio, container, false);
        initScreenComponents(view);
        setEventsFunctionality(view);
        return view;
    }

    private void initScreenComponents(View view) {
        Profesional prof = activity.getApplicationManager().getUserLogued().getProfesional();
        if (prof.getPersonaFisica().getImagen()!=null) {
            ImageView profImage = (ImageView) view.findViewById(R.id.esc_prof_user_icon_id);
            profImage.setImageBitmap(prof.getPersonaFisica().getImagen().getBitmap());
        }
        ((TextView)view.findViewById(R.id.esc_prof_nombre_apellido_id)).setText(prof.getPersonaFisica().getNombre()+ " " +prof.getPersonaFisica().getApellido());
        ((TextView)view.findViewById(R.id.esc_prof_especialidades_id)).setText(getEspecialidadesFormatedString(prof.getEspecialidades()));
    }

    private void setEventsFunctionality(View view) {
        InitComponentVisitasPendientesButton(view);
    }

    private void InitComponentVisitasPendientesButton(View view) {
        final CustomFragment cf = this;
        ImageButton visitasPendientesButton = (ImageButton) view.findViewById(R.id.esc_pac_visitas_pendientes_id);
        visitasPendientesButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                activity.getApplicationManager().loadSolicitudesMedicasProfesional(cf);
            }
        });
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof OnFragmentInteractionListener) {
            mListener = (OnFragmentInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString() + " must implement OnFragmentInteractionListener");
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
        if (message!=null && !message.isEmpty()) {
            Toast toast = Toast.makeText(getContext(), message, Toast.LENGTH_SHORT);
            toast.show();
        }
        switch(type) {
            case Constants.TYPE_CARGA_SOLICITUDES_MEDICAS:
                switch(processStatus) {
                    case Constants.SERVICE_OK:
                        activity.onFragmentGotoScreen(Constants.SCREEN_PROF_VISITAS_PENDIENTES);
                        break;
                    default:
                        break;
                }
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
