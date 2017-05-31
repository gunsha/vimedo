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
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import ar.com.itr.vimedo.CustomFragment;
import ar.com.itr.vimedo.R;
import ar.com.itr.vimedo.entity.PersonaFisica;
import ar.com.itr.vimedo.interfaces.OnFragmentInteractionListener;
import ar.com.itr.vimedo.util.Constants;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link PacEscritorio#newInstance} factory method to
 * create an instance of this fragment.
 */
public class PacEscritorio extends CustomFragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;

    private PersonaFisica pacientePersona;

    public PacEscritorio() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment PacEscritorio.
     */
    // TODO: Rename and change types and number of parameters
    public static PacEscritorio newInstance(String param1, String param2) {
        PacEscritorio fragment = new PacEscritorio();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentMessage("PAC_DESKTOP",uri);
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
        View view = inflater.inflate(R.layout.fragment_pac_escritorio, container, false);
        pacientePersona = applicationManager.getUsuario().getAfiliado().getPersonaFisica();
        setEventsFunctionality(view);
        return view;
    }

    private void setEventsFunctionality(View view) {
        InitComponentUserImage(view);
        InitComponentUserName(view);
        InitComponentUserDocument(view);
        InitComponentSolicitarMedicoButton(view);
        InitComponentVisitasPendientesButton(view);
        setComponentsVisibility(view);
    }

    private void InitComponentUserImage(View view) {
        if (pacientePersona.getImagen()!=null && pacientePersona.getImagen().getBitmap()!=null) {
            ImageView pacienteNomApe = (ImageView) view.findViewById(R.id.esc_pac_user_icon_id);
            pacienteNomApe.setImageBitmap(pacientePersona.getImagen().getBitmap());
        }
    }

    private void InitComponentUserName(View view) {
        TextView pacienteNomApe = (TextView) view.findViewById(R.id.pac_nombre_apellido_id);
        pacienteNomApe.setText(pacientePersona.getNombre()+" "+pacientePersona.getApellido());
    }

    private void InitComponentUserDocument(View view) {
        TextView pacienteDocumento = (TextView) view.findViewById(R.id.pac_documento_id);
        pacienteDocumento.setText(pacientePersona.getTipoDocumento()+" "+pacientePersona.getNroDocumento());
    }

    private void InitComponentSolicitarMedicoButton(View view) {
        ImageButton solicitarMedicoButton = (ImageButton) view.findViewById(R.id.esc_pac_pedir_medico_id);
        solicitarMedicoButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                activity.onFragmentGotoScreen(Constants.SCREEN_SOLICITAR_MEDICO);
            }
        });
    }

    private void InitComponentVisitasPendientesButton(View view) {
        final CustomFragment cf = this;
        ImageButton visitasPendientesButton = (ImageButton) view.findViewById(R.id.esc_pac_visitas_pendientes_id);
        visitasPendientesButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
            activity.getApplicationManager().loadSolicitudesMedicasPaciente(cf);
            }
        });
    }

    private void setComponentsVisibility(View view) {
        if (activity.getApplicationManager().isSolicitudesPendientes()) {
            ((LinearLayout) view.findViewById(R.id.esc_pac_pedir_medico_container_id)).setVisibility(View.GONE);
        } else {
            ((LinearLayout) view.findViewById(R.id.esc_pac_visitas_pendientes_container_id)).setVisibility(View.GONE);
        }
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
        if (type!=null) {
            switch(type) {
                case Constants.TYPE_CARGA_SOLICITUDES_MEDICAS:
                    switch(processStatus) {
                        case Constants.SERVICE_OK:
                            if (Constants.SOLICITUD_MEDICA_ESTADO_FINALIZADA_X_MEDICO.equals(activity.getApplicationManager().getSolicitudMedicaPendientePaciente().getEstado())) {
                                activity.onFragmentGotoScreen(Constants.SCREEN_PAC_CALIFICAR_PROFESIONAL);
                            } else {
                                activity.onFragmentGotoScreen(Constants.SCREEN_PAC_VISITAS_PENDIENTES);
                            }
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
        }
    }
}
