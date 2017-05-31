package layout;

import android.annotation.SuppressLint;
import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import java.io.UnsupportedEncodingException;
import java.util.Map;

import ar.com.itr.vimedo.CustomFragment;
import ar.com.itr.vimedo.R;
import ar.com.itr.vimedo.common.FormularioRegistro;
import ar.com.itr.vimedo.entity.Afiliado;
import ar.com.itr.vimedo.entity.SolicitudMedica;
import ar.com.itr.vimedo.interfaces.OnFragmentInteractionListener;
import ar.com.itr.vimedo.util.Constants;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link ProfSolicitudMedicaDetail#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ProfSolicitudMedicaDetail extends CustomFragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    private SolicitudMedica solicitudMedicaParam;

    private OnFragmentInteractionListener mListener;

    public ProfSolicitudMedicaDetail() {
    }

    @SuppressLint("ValidFragment")
    public ProfSolicitudMedicaDetail(Map<String, Object> params) {
        super(params);
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment ProfSolicitudMedicaDetail.
     */
    // TODO: Rename and change types and number of parameters
    public static ProfSolicitudMedicaDetail newInstance(String param1, String param2) {
        ProfSolicitudMedicaDetail fragment = new ProfSolicitudMedicaDetail();
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
        solicitudMedicaParam = (SolicitudMedica) params.get(Constants.MAP_PARAM_NAME_SOLICITUD_MEDICA);
        View view = inflater.inflate(R.layout.fragment_prof_solicitud_medica_detail, container, false);
        initScreenComponents(view);
        setEventsFunctionality(view);
        return view;
    }

    private void initScreenComponents(View view) {
        InitComponentContinuarButton(view);
        initTextFieldsComponents(view);
    }

    private void InitComponentContinuarButton(View view) {
        final CustomFragment self = this;
        Button continuarBtn = (Button) view.findViewById(R.id.btn_continuar_id);
        continuarBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (solicitudMedicaParam!=null && solicitudMedicaParam.getId()!=null) {
                    applicationManager.finalizarSolicitudMedica(solicitudMedicaParam.getId(),self);
                }
            }
        });
    }

    private void initTextFieldsComponents(View view) {
        if (solicitudMedicaParam!=null && solicitudMedicaParam.getId()!=null) {
            if(solicitudMedicaParam.getAfiliado().getPersonaFisica().getImagen()!=null) {
                ImageView profImage = (ImageView) view.findViewById(R.id.sm_detail_pac_user_icon_id);
                profImage.setImageBitmap(solicitudMedicaParam.getAfiliado().getPersonaFisica().getImagen().getBitmap());
            }
            TextView pacienteNomApe = (TextView) view.findViewById(R.id.sm_detail_pac_nombre_apellido_id);
            TextView pacienteDoc = (TextView) view.findViewById(R.id.sm_detail_pac_documento_id);
            TextView pacienteCredencial = (TextView) view.findViewById(R.id.sm_detail_pac_credencial_id);
            TextView sintomas = (TextView) view.findViewById(R.id.sm_detail_pac_sintomas_id);
            TextView antecedentesMedicos = (TextView) view.findViewById(R.id.sm_detail_pac_antec_medicos_id);
            pacienteNomApe.setText(solicitudMedicaParam.getAfiliado().getPersonaFisica().getNombre()+" "+solicitudMedicaParam.getAfiliado().getPersonaFisica().getApellido());
            pacienteDoc.setText(solicitudMedicaParam.getAfiliado().getPersonaFisica().getTipoDocumento()+": "+solicitudMedicaParam.getAfiliado().getPersonaFisica().getNroDocumento());
            pacienteCredencial.setText(solicitudMedicaParam.getAfiliado().getCredencial());
            sintomas.setText(solicitudMedicaParam.getSintomas());
            antecedentesMedicos.setText(solicitudMedicaParam.getAntecedentesMedicosString());
        }
    }

    private void setEventsFunctionality(View view) {
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
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
        if(type!=null) {
            switch (type) {
                case Constants.TYPE_SOLICITUD_FINALIZADA:
                    activity.getApplicationManager().deleteSolicitudMedicaProfesionalFromList(solicitudMedicaParam);
                    activity.onFragmentGotoScreen(Constants.SCREEN_PROF_VISITAS_PENDIENTES);
                    break;
                default:
                    break;
            }
        }
    }
}
