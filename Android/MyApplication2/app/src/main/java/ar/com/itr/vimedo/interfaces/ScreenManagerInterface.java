package ar.com.itr.vimedo.interfaces;

import android.support.v4.app.Fragment;

import java.util.Map;

import ar.com.itr.vimedo.CustomFragment;

/**
 * Created by pablo_rizzo on 14/11/2016.
 */

public interface ScreenManagerInterface {

    void goToScreen(String screenInit);

    void goToScreen(String screenInit,Map<String,Object> params);

    void backToPreviousScreen();

    boolean isInScreen(String screen);

    public CustomFragment getScreenFragment();
}
