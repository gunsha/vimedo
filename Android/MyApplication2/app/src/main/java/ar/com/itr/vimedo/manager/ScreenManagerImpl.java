package ar.com.itr.vimedo.manager;


import android.support.v4.app.FragmentTransaction;
import android.support.v7.app.AppCompatActivity;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import ar.com.itr.vimedo.CustomFragment;
import ar.com.itr.vimedo.R;
import ar.com.itr.vimedo.interfaces.ScreenManagerInterface;
import ar.com.itr.vimedo.util.Constants;
import layout.PacCalificarMedico;
import layout.ProfEscritorio;
import layout.Login;
import layout.PacEscritorio;
import layout.PacVisitasPendientes;
import layout.ProfSolicitudMedicaDetail;
import layout.ProfVisitasPendientes;
import layout.Registro;
import layout.SolicitarMedico;
import layout.SolicitarMedicoOk;

/**
 * Created by pablo_rizzo on 14/11/2016.
 */

public class ScreenManagerImpl implements ScreenManagerInterface {

    private String actualScreen;
    private List<String> previousScreen = new ArrayList<>();
    private Map<String,Object> params;

    private AppCompatActivity fragmentActivity;
    private CustomFragment screenFragment;

    private boolean fromBackButton = false;
    public ScreenManagerImpl(AppCompatActivity activity) {
        this.fragmentActivity = activity;
    }

    @Override
    public void goToScreen(String screen) {
        boolean screenChanged = true;
        switch (screen) {
            case Constants.SCREEN_INIT:
                screenFragment = new Login();
                break;
            case Constants.SCREEN_REGISTER:
                screenFragment = new Registro();
                break;
            case Constants.SCREEN_PROF_DESKTOP:
                screenFragment = new ProfEscritorio();
                break;
            case Constants.SCREEN_PAC_DESKTOP:
                screenFragment = new PacEscritorio();
                break;
            case Constants.SCREEN_FORGET_PASSWORD:
                screenFragment = new Login();
                break;
            case Constants.SCREEN_SOLICITAR_MEDICO:
                screenFragment = new SolicitarMedico();
                break;
            case Constants.SCREEN_SOLICITAR_MEDICO_OK:
                screenFragment = new SolicitarMedicoOk();
                break;
            case Constants.SCREEN_PAC_VISITAS_PENDIENTES:
                screenFragment = new PacVisitasPendientes();
                break;
            case Constants.SCREEN_PROF_VISITAS_PENDIENTES:
                screenFragment = new ProfVisitasPendientes();
                break;
            case Constants.SCREEN_PROF_SOL_MED_DETAIL:
                screenFragment = new ProfSolicitudMedicaDetail(params);
                break;
            case Constants.SCREEN_PAC_CALIFICAR_PROFESIONAL:
                screenFragment = new PacCalificarMedico();
                break;
            default:
                screenChanged = false;
                break;
        }
        if (screenChanged) {
            if (!fromBackButton) {
                previousScreen.add(actualScreen);
            } else {
                fromBackButton = false;
            }
            actualScreen = screen;
        }
        FragmentTransaction ft = fragmentActivity.getSupportFragmentManager().beginTransaction();
        ft.replace(R.id.mainContainer, screenFragment);
        ft.commit();
        params = null;
    }

    @Override
    public void goToScreen(String screen, Map<String, Object> params) {
        this.params = params;
        goToScreen(screen);
    }

    @Override
    public void backToPreviousScreen() {
        String ps = previousScreen.get(previousScreen.size()-1);
        previousScreen.remove(previousScreen.size()-1);
        fromBackButton = true;
        goToScreen(ps);
    }

    @Override
    public boolean isInScreen(String screen) {
        if (screen!=null && screen.equals(actualScreen)) {
            return true;
        }
        return false;
    }

    @Override
    public CustomFragment getScreenFragment() {
        return screenFragment;
    }
}