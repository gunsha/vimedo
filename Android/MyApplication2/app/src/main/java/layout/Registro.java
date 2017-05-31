package layout;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.text.SpannableString;
import android.text.TextPaint;
import android.text.method.LinkMovementMethod;
import android.text.style.ClickableSpan;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import ar.com.itr.vimedo.CustomFragment;
import ar.com.itr.vimedo.R;
import ar.com.itr.vimedo.common.FormularioRegistro;
import ar.com.itr.vimedo.interfaces.OnFragmentInteractionListener;
import ar.com.itr.vimedo.util.Constants;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link Registro#newInstance} factory method to
 * create an instance of this fragment.
 */
public class Registro extends CustomFragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;

    public Registro() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment Registro.
     */
    // TODO: Rename and change types and number of parameters
    public static Registro newInstance(String param1, String param2) {
        Registro fragment = new Registro();
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
    public View onCreateView(LayoutInflater inflater, ViewGroup container,Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_registro, container, false);
        setEventsFunctionality(view);
        return view;
    }

    private void setEventsFunctionality(final View view) {
        InitComponentSoyProfesionalCB(view);
        InitComponentTermsConditions(view);
        InitComponentContinuarButton(view);
        InitComponentPrepagaSpinner(view);
    }

    private void InitComponentPrepagaSpinner(View view) {
        final View actualView = view;
        // Spinner prepagas
        Spinner prepagaCB = (Spinner) actualView.findViewById(R.id.prepaga_CB);
        List<String> prepagas = new ArrayList<>();
        prepagas.add("Seleccione una Prepaga");
        prepagas.addAll(applicationManager.getPrepagaNameList());
        ArrayAdapter<String> dataAdapter = new ArrayAdapter<String>(getActivity(),android.R.layout.simple_spinner_item, prepagas);
        dataAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        prepagaCB.setAdapter(dataAdapter);
    }

    private void InitComponentContinuarButton(View view) {
        final View actualView = view;
        final Registro registro = this;
        // Boton Continuar
        Button continuarBtn = (Button) actualView.findViewById(R.id.btn_continuar_id);
        continuarBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
            FormularioRegistro fr = getFormData(actualView);
            if (validateFormData(actualView,fr)) {
                enableFormEdit(false);
                try {
                    applicationManager.registerUser(fr,registro);
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
            }
            }
        });
    }

    private void InitComponentTermsConditions(final View view) {
        final View actualView = view;
        // Terms and conditions TextView
        TextView termsTV = (TextView) actualView.findViewById(R.id.reg_terminos_text_id);
        SpannableString ss = new SpannableString(getResources().getString(R.string.reg_terminos));
        ClickableSpan clickableSpan = new ClickableSpan() {
            @Override
            public void onClick(View textView) {
                Toast toast = Toast.makeText(getContext(), "Terminos y condiciones", Toast.LENGTH_SHORT);
                actualView.findViewById(R.id.terminos_CB_id).setEnabled(true);
                toast.show();
            }
            @Override
            public void updateDrawState(TextPaint ds) {
                super.updateDrawState(ds);
                ds.setUnderlineText(false);
            }
        };
        ss.setSpan(clickableSpan,25,ss.length(), 0);
        termsTV.setText(ss,TextView.BufferType.SPANNABLE);
        termsTV.setMovementMethod(LinkMovementMethod.getInstance());
        // Checkbox terminos y condiciones
        CheckBox termsCB = (CheckBox) actualView.findViewById(R.id.terminos_CB_id);
        termsCB.setEnabled(false);
        termsCB.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView,boolean isChecked) {
                actualView.findViewById(R.id.btn_continuar_id).setVisibility(isChecked ? View.VISIBLE : View.GONE);
            }
        });
    }

    private void InitComponentSoyProfesionalCB(final View view) {
        final View actualView = view;
        // Checkbos Soy Profecional
        ((CheckBox)view.findViewById(R.id.soy_prof_CB_id)).setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView,boolean isChecked) {
                actualView.findViewById(R.id.area_credencial).setVisibility(!isChecked ? View.VISIBLE : View.GONE);
                actualView.findViewById(R.id.prepaga_CB).setVisibility(!isChecked ? View.VISIBLE : View.GONE);
                actualView.findViewById(R.id.area_mp).setVisibility(isChecked ? View.VISIBLE : View.GONE);
            }
        });
    }

    private boolean validateFormData(View actualView,FormularioRegistro fr) {
        boolean validationOk = true;
        if(fr.getEsProfesional()) {
            if (fr.getMp()==null || fr.getMp().isEmpty()) {
                Toast toast = Toast.makeText(getContext(), "Debe completar el campo MP", Toast.LENGTH_SHORT);
                toast.show();
                validationOk = false;
            }
        } else {
            if (fr.getCredencial()==null || fr.getCredencial().isEmpty()) {
                Toast toast = Toast.makeText(getContext(), "Debe copletar el campo CREDENCIAL", Toast.LENGTH_SHORT);
                toast.show();
                validationOk = false;
            }
            if (fr.getPrepaga()==null) {
                Toast toast = Toast.makeText(getContext(), "Debe seleccione una prepaga", Toast.LENGTH_SHORT);
                toast.show();
                validationOk = false;
            }
        }
        if (fr.getEmail()==null || fr.getEmail().isEmpty()) {
            Toast toast = Toast.makeText(getContext(), "Debe copletar el campo EMAIL", Toast.LENGTH_SHORT);
            toast.show();
            validationOk = false;
        } else {
            if (!android.util.Patterns.EMAIL_ADDRESS.matcher(fr.getEmail()).matches()) {
                Toast toast = Toast.makeText(getContext(), "Debe ingresar un EMAIL valido", Toast.LENGTH_SHORT);
                toast.show();
                validationOk = false;
            }
        }
        if (fr.getPassword()==null || fr.getPassword().isEmpty()) {
            Toast toast = Toast.makeText(getContext(), "Debe completar el campo PASSWORD", Toast.LENGTH_SHORT);
            toast.show();
            validationOk = false;
        } else {
            if (!fr.getPassword().equals(fr.getRepeatPassword())) {
                Toast toast = Toast.makeText(getContext(), "No coinciden las contraseñas ingresadas", Toast.LENGTH_SHORT);
                toast.show();
                validationOk = false;
            }
        }
        return validationOk;
    }

    private FormularioRegistro getFormData(View view) {
        FormularioRegistro fr = new FormularioRegistro();
        fr.setEsProfesional(((CheckBox)view.findViewById(R.id.soy_prof_CB_id)).isChecked());
        if(fr.getEsProfesional()) {
            fr.setMp(((EditText) view.findViewById(R.id.reg_mp_input_id)).getText().toString());
        } else {
            fr.setCredencial(((EditText) view.findViewById(R.id.reg_credencial_input_id)).getText().toString());
            fr.setPrepaga(applicationManager.getPrepagaByName(((Spinner) view.findViewById(R.id.prepaga_CB)).getSelectedItem().toString()));
        }
        fr.setEmail(((EditText) view.findViewById(R.id.reg_email_input_id)).getText().toString());
        fr.setPassword(((EditText) view.findViewById(R.id.reg_pass_input_id)).getText().toString());
        fr.setRepeatPassword(((EditText) view.findViewById(R.id.reg_confirm_pass_input_id)).getText().toString());
        return fr;
    }

    private void enableFormEdit(boolean enabled) {
        //Toast toast = Toast.makeText(getContext(), "Habilita Edicion:" + enabled, Toast.LENGTH_SHORT);
        //toast.show();
    }


    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentMessage("REGISTER",uri);
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
        switch(processStatus) {
            case Constants.SERVICE_OK:
                if (applicationManager.getTipoUsuario().equals(Constants.TIPO_USUARIO_PACIENTE)) {
                    activity.getScreenManager().goToScreen(Constants.SCREEN_PAC_DESKTOP);
                } else {
                    activity.getScreenManager().goToScreen(Constants.SCREEN_PROF_DESKTOP);
                }
                break;
            default:
                enableFormEdit(true);
                break;
        }
    }
}
