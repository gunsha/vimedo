package ar.com.itr.vimedo;

import android.content.Context;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v7.app.AppCompatActivity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import java.util.Map;

import ar.com.itr.vimedo.interfaces.ApplicationManagerInterface;
import ar.com.itr.vimedo.manager.ApplicationManagerImpl;

/**
 * Created by pablo_rizzo on 16/11/2016.
 */

public abstract class CustomFragment extends Fragment {

    protected MainActivity activity;
    protected ApplicationManagerImpl applicationManager;
    protected Map<String,Object> params;

    abstract public boolean onBackPressed();

    abstract public void processAfterAsyncCall(Integer type, Integer processStatus, String message);

    public CustomFragment() {
    }

    public CustomFragment(Map<String,Object> params) {
        this.params = params;
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        activity = (MainActivity) getActivity();
        applicationManager = (ApplicationManagerImpl) activity.getApplicationManager();
    }
}
