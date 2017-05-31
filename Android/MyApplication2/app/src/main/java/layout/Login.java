package layout;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import java.io.UnsupportedEncodingException;

import ar.com.itr.vimedo.CustomFragment;
import ar.com.itr.vimedo.R;
import ar.com.itr.vimedo.common.FormularioLogin;
import ar.com.itr.vimedo.interfaces.OnFragmentInteractionListener;
import ar.com.itr.vimedo.util.Constants;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link Login#newInstance} factory method to
 * create an instance of this fragment.
 */
public class Login extends CustomFragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;

    public Login() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment Login.
     */
    // TODO: Rename and change types and number of parameters
    public static Login newInstance(String param1, String param2) {
        Login fragment = new Login();
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
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_login, container, false);
        setEventsFunctionality(view);
        return view;
    }

    private void setEventsFunctionality(View view) {
        InitComponentRegister(view);
        InitComponentOlvideContrasenia(view);
        InitComponentLoginButton(view);

    }

    private void InitComponentLoginButton(View view) {
        final View actualView = view;
        final Login login = this;
        Button continuarBtn = (Button) actualView.findViewById(R.id.log_btn_ingresar_id);
        continuarBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                FormularioLogin fl = getFormData(actualView);
                if (validateFormData(actualView,fl)) {
                    enableFormEdit(false);
                    try {
                        applicationManager.loginUser(fl,login);
                    } catch (UnsupportedEncodingException e) {
                        e.printStackTrace();
                    }
                }
            }
        });

    }

    private void InitComponentOlvideContrasenia(View view) {
        view.findViewById(R.id.log_olv_pass_text_id).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mListener.onFragmentGotoScreen(Constants.SCREEN_FORGET_PASSWORD);
            }
        });
    }

    private void InitComponentRegister(View view) {
        view.findViewById(R.id.log_registrarse_text_id).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mListener.onFragmentGotoScreen(Constants.SCREEN_REGISTER);
            }
        });
    }

    private void enableFormEdit(boolean enabled) {
        //Toast toast = Toast.makeText(getContext(), "Habilita Edicion:" + enabled, Toast.LENGTH_SHORT);
        //toast.show();
    }

    private FormularioLogin getFormData(View view) {
        FormularioLogin fl = new FormularioLogin();
        fl.setEmail(((EditText) view.findViewById(R.id.log_email_input_id)).getText().toString());
        fl.setPassword(((EditText) view.findViewById(R.id.log_password_input_id)).getText().toString());
        return fl;
    }

    private boolean validateFormData(View actualView, FormularioLogin fl) {
        boolean validationOk = true;
        if (fl.getEmail()==null || fl.getEmail().isEmpty()) {
            Toast toast = Toast.makeText(getContext(), "Debe ingresar un EMAIL", Toast.LENGTH_SHORT);
            toast.show();
            validationOk = false;
        } else {
            if (!android.util.Patterns.EMAIL_ADDRESS.matcher(fl.getEmail()).matches()) {
                Toast toast = Toast.makeText(getContext(), "Debe ingresar un EMAIL valido", Toast.LENGTH_SHORT);
                toast.show();
                validationOk = false;
            }
        }
        if (fl.getPassword()==null || fl.getPassword().isEmpty()) {
            Toast toast = Toast.makeText(getContext(), "Debe ingresar el PASSWORD", Toast.LENGTH_SHORT);
            toast.show();
            validationOk = false;
        }
        return validationOk;
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentMessage("LOGIN",uri);
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
        if (message!=null && !message.isEmpty()) {
            Toast toast = Toast.makeText(getContext(), message, Toast.LENGTH_SHORT);
            toast.show();
        }
        switch(processStatus) {
            case Constants.SERVICE_OK:
                if(applicationManager.getTipoUsuario().equals(Constants.TIPO_USUARIO_PACIENTE)) {
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
