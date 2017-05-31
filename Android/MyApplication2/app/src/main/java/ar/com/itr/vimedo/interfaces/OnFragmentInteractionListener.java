package ar.com.itr.vimedo.interfaces;

import java.util.Map;

/**
 * Created by pablo_rizzo on 16/11/2016.
 */

public interface OnFragmentInteractionListener {

    public void onFragmentMessage(String TAG, Object data);

    public void onFragmentGotoScreen(String screen);

    public void onFragmentGotoScreen(String screen,Map<String,Object> params);
    
}
