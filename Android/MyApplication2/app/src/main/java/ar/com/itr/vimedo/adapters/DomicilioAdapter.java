package ar.com.itr.vimedo.adapters;

import android.content.Context;
import android.graphics.Color;
import android.support.v4.content.ContextCompat;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.List;

import ar.com.itr.vimedo.entity.Domicilio;
import ar.com.itr.vimedo.R;

/**
 * Created by pablo_rizzo on 30/11/2016.
 */

public class DomicilioAdapter extends BaseAdapter {

    private Context context;
    private List<Domicilio> domicilios;

    public DomicilioAdapter(Context context, List<Domicilio> domicilioList) {
        super();
        this.context = context;
        this.domicilios = domicilioList;
    }

    @Override
    public int getCount() {
        return domicilios.size();
    }

    @Override
    public Object getItem(int position) {
        return domicilios.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        View rowView = convertView;
        if (convertView == null) {
            // Create a new view into the list.
            LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            rowView = inflater.inflate(R.layout.domicilio_list, parent, false);
        }
        // Set data into the view.
        TextView direcion = (TextView) rowView.findViewById(R.id.domi_item_direccion_id);
        TextView locProv = (TextView) rowView.findViewById(R.id.domi_item_localidad_prov_id);
        Domicilio domicilio = this.domicilios.get(position);
        direcion.setText(domicilio.getCalle() + " " + domicilio.getNumero());
        locProv.setText(domicilio.getLocalidad() + ", " + domicilio.getProvincia());
        return rowView;
    }
}
