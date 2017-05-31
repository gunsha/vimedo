package layout;

import android.app.Dialog;
import android.content.Context;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.content.ContextCompat;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.Spinner;
import android.widget.Toast;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import ar.com.itr.vimedo.CustomFragment;
import ar.com.itr.vimedo.R;
import ar.com.itr.vimedo.adapters.AfiliadoAdapter;
import ar.com.itr.vimedo.adapters.DomicilioAdapter;
import ar.com.itr.vimedo.common.FormularioPedidoMedico;
import ar.com.itr.vimedo.entity.Afiliado;
import ar.com.itr.vimedo.entity.Antecedente;
import ar.com.itr.vimedo.entity.Domicilio;
import ar.com.itr.vimedo.entity.Usuario;
import ar.com.itr.vimedo.interfaces.OnFragmentInteractionListener;
import ar.com.itr.vimedo.util.Constants;
import ar.com.itr.vimedo.util.MultiSelectionSpinner;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link SolicitarMedico#newInstance} factory method to
 * create an instance of this fragment.
 */
public class SolicitarMedico extends CustomFragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private DomicilioAdapter adapterDomicilios;
    private DomicilioAdapter adapterDomiciliosUtilizados;
    private AfiliadoAdapter adapterAfiliados;
    private ListView afiliadoLV;
    private ListView domicilioLV;
    private ListView domicilioUtilizadoLV;
    private Domicilio domicilioSelected;
    private Afiliado afiliadoSelected;
    private OnFragmentInteractionListener mListener;

    public SolicitarMedico() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment SolicitarMedico.
     */
    // TODO: Rename and change types and number of parameters
    public static SolicitarMedico newInstance(String param1, String param2) {
        SolicitarMedico fragment = new SolicitarMedico();
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
        View view = inflater.inflate(R.layout.fragment_solic_medico, container, false);
        setEventsFunctionality(view);
        return view;
    }

    private void setEventsFunctionality(View view) {
        InitComponentAntecedentes(view);
        InitComponentHours(view);
        InitComponentMinutes(view);
        InitComponentAfiliadoList(view);
        InitComponentDomicilioList(view);
        InitComponentDomicilioUtiizadoList(view);
        InitComponentOtroDomicilioButton(view);
        InitComponentRegistrarPedidoButton(view);
        setListViewHeightBasedOnChildren(afiliadoLV);
        setListViewHeightBasedOnChildren(domicilioLV);
        setListViewHeightBasedOnChildren(domicilioUtilizadoLV);
    }

    private void InitComponentRegistrarPedidoButton(View view) {
        final View actualView = view;
        final SolicitarMedico solicitarMedico = this;
        Button registrarSolicitudBtn = (Button)view.findViewById(R.id.btn_registrar_solicitud_medico_id);
        registrarSolicitudBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                FormularioPedidoMedico fpm = getFormData(actualView);
                if (validateFormData(actualView,fpm)) {
                    enableFormEdit(false);
                    try {
                        applicationManager.solicitarMedico(fpm,solicitarMedico);
                    } catch (UnsupportedEncodingException e) {
                        e.printStackTrace();
                    }
                }
            }
        });
    }

    private void enableFormEdit(boolean b) {
    }

    private boolean validateFormData(View actualView, FormularioPedidoMedico fpm) {
        boolean validationOk = true;
        if (fpm.getSintomas()==null || fpm.getSintomas().isEmpty()) {
            Toast toast = Toast.makeText(getContext(), "Debe completar el campo de síntomas", Toast.LENGTH_SHORT);
            toast.show();
            validationOk = false;
        }
        if (fpm.getDomicilio()==null) {
            Toast toast = Toast.makeText(getContext(), "Debe seleccionar un domicilio", Toast.LENGTH_SHORT);
            toast.show();
            validationOk = false;
        }
        if (fpm.getAfiliado()==null) {
            Toast toast = Toast.makeText(getContext(), "Debe seleccionar un afiliado", Toast.LENGTH_SHORT);
            toast.show();
            validationOk = false;
        }
        return validationOk;
    }

    private FormularioPedidoMedico getFormData(View view) {
        String horaString;
        String minutoString;
        Afiliado afiliado = null;
        Domicilio domicilio = null;
        Usuario usuario = new Usuario();
        usuario.setId(activity.getApplicationManager().getUserLogued().getId());
        if (afiliadoSelected!=null) {
            afiliado = new Afiliado();
            afiliado.setId(afiliadoSelected.getId());
        }
        if (domicilioSelected!=null) {
            domicilio = new Domicilio();
            domicilio.setId(domicilioSelected.getId());
        }
        FormularioPedidoMedico fpm = new FormularioPedidoMedico();
        fpm.setAfiliado(afiliado);
        fpm.setDomicilio(domicilio);
        fpm.setUsuario(usuario);
        fpm.setSintomas(((EditText)view.findViewById(R.id.sol_med_sintomas)).getText().toString());
        horaString = ((Spinner)view.findViewById(R.id.sol_med_horas)).getSelectedItem().toString();
        minutoString = ((Spinner)view.findViewById(R.id.sol_med_minutos)).getSelectedItem().toString();
        fpm.setHorasSintomas(Integer.parseInt((horaString.split(" "))[0].trim()));
        fpm.setMinutosSintomas(Integer.parseInt((minutoString.split(" "))[0].trim()));
        fpm.setAntecedenteList(getAntecedentesFromArray(((MultiSelectionSpinner)view.findViewById(R.id.sol_med_antecedentes)).getSelectedStrings()));
        return fpm;
    }

    private List<Antecedente> getAntecedentesFromArray(List<String> antecedentesStrings) {
        List<Antecedente> antecedentesRet = new ArrayList<>();
        for(String antecedenteName : antecedentesStrings ) {
            Antecedente temp =  activity.getApplicationManager().getAntecedenteByName(antecedenteName);
            if (temp!=null) {
                antecedentesRet.add(temp);
            }
        }
        return antecedentesRet;
    }

    private void InitComponentOtroDomicilioButton(View view) {
        View actualView = view;
        Button otroDomicilioBtn = (Button)view.findViewById(R.id.otro_domi_btn_id);
        otroDomicilioBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Dialog dialog = new Dialog(getActivity());
                dialog.setContentView(R.layout.domicilio_ingreso);
                dialog.setCancelable(true);
                dialog.show();
            }
        });

    }

    private void InitComponentAfiliadoList(View view) {
        afiliadoLV = (ListView) view.findViewById(R.id.afiliado_list_id);
        adapterAfiliados = new AfiliadoAdapter(getContext(),activity.getApplicationManager().getAfiliadosGrupoFamiliar());
        afiliadoLV.setAdapter(adapterAfiliados);
        afiliadoLV.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                afiliadoSelected = (Afiliado)adapterAfiliados.getItem(position);
                for(int index = 0; index < parent.getChildCount(); index++) {
                    parent.getChildAt(index).setBackgroundColor(Color.TRANSPARENT);
                }
                view.setBackgroundColor(ContextCompat.getColor(getContext(),R.color.green_01));
            }
        });
    }

    private void InitComponentDomicilioList(View view) {
        domicilioLV = (ListView) view.findViewById(R.id.domicilio_list_id);
        adapterDomicilios = new DomicilioAdapter(getContext(),activity.getApplicationManager().getDomiciliosGrupoFamiliar());
        domicilioLV.setAdapter(adapterDomicilios);
        domicilioLV.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                domicilioSelected = (Domicilio)adapterDomicilios.getItem(position);
                for (int index = 0; index < parent.getChildCount(); index++) {
                    parent.getChildAt(index).setBackgroundColor(Color.TRANSPARENT);
                }
                view.setBackgroundColor(ContextCompat.getColor(getContext(),R.color.green_01));
                clearListsStyles(domicilioUtilizadoLV);
            }
        });
    }

    private void InitComponentDomicilioUtiizadoList(View view) {
        List<Domicilio> domiciliosUtilizadosTemp = new ArrayList<>();
        domiciliosUtilizadosTemp.addAll(activity.getApplicationManager().getDomiciliosUtilizados());
        domicilioUtilizadoLV = (ListView) view.findViewById(R.id.domicilio_util_list_id);
        adapterDomiciliosUtilizados = new DomicilioAdapter(getContext(),domiciliosUtilizadosTemp);
        domicilioUtilizadoLV.setAdapter(adapterDomiciliosUtilizados);
        domicilioUtilizadoLV.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                domicilioSelected = (Domicilio)adapterDomicilios.getItem(position);
                for (int index = 0; index < parent.getChildCount(); index++) {
                    parent.getChildAt(index).setBackgroundColor(Color.TRANSPARENT);
                }
                view.setBackgroundColor(ContextCompat.getColor(getContext(),R.color.green_01));
                clearListsStyles(domicilioLV);
            }
        });
    }

    private void clearListsStyles(ListView lv) {
        for(int index=0;index<lv.getChildCount();index++) {
            View wantedView = lv.getChildAt(index);
            wantedView.setBackgroundColor(Color.TRANSPARENT);
        }
        lv.invalidateViews();
    }

    private void InitComponentHours(View view) {
        Spinner mss = (Spinner)view.findViewById(R.id.sol_med_horas);
        ArrayAdapter<String> dataAdapter = new ArrayAdapter<String>(activity,R.layout.support_simple_spinner_dropdown_item,activity.getApplicationManager().getHoraList());
        mss.setAdapter(dataAdapter);
        mss.setSelection(0);
    }

    private void InitComponentMinutes(View view) {
        Spinner mss = (Spinner)view.findViewById(R.id.sol_med_minutos);
        ArrayAdapter<String> dataAdapter = new ArrayAdapter<String>(activity,R.layout.support_simple_spinner_dropdown_item,activity.getApplicationManager().getMinutoList());
        mss.setAdapter(dataAdapter);
        mss.setSelection(0);
    }

    private void InitComponentAntecedentes(View view) {
        final List<String> antecedentesTemp = new ArrayList<String>();
        antecedentesTemp.addAll(activity.getApplicationManager().getAntecedenteNameList());
        MultiSelectionSpinner mss = (MultiSelectionSpinner)view.findViewById(R.id.sol_med_antecedentes);
        mss.setPromptItem("Antecedentes Médicos");
        mss.setItems(antecedentesTemp);
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentMessage("SOLICITAR MEDICO",uri);
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

    public static void setListViewHeightBasedOnChildren(ListView listView) {
        ListAdapter listAdapter = listView.getAdapter();
        if (listAdapter == null) {
            // pre-condition
            return;
        }

        int totalHeight = 0;
        for (int i = 0; i < listAdapter.getCount(); i++) {
            View listItem = listAdapter.getView(i, null, listView);
            listItem.measure(0, 0);
            totalHeight += listItem.getMeasuredHeight();
        }

        ViewGroup.LayoutParams params = listView.getLayoutParams();
        params.height = totalHeight
                + (listView.getDividerHeight() * (listAdapter.getCount() - 1));
        listView.setLayoutParams(params);
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
        switch(processStatus) {
            case Constants.SERVICE_OK:
                activity.getScreenManager().goToScreen(Constants.SCREEN_SOLICITAR_MEDICO_OK);
                break;
            default:
                enableFormEdit(true);
                break;
        }
    }
}
