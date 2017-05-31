package ar.com.itr.vimedo.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.List;

import ar.com.itr.vimedo.R;
import ar.com.itr.vimedo.entity.SolicitudMedica;

/**
 * Created by pablo_rizzo on 06/12/2016.
 */

public class SolictudesAdapter extends BaseAdapter {

    Context context;
    private List<SolicitudMedica> solicitudesPendientes;

    public SolictudesAdapter(Context context, List<SolicitudMedica> solicitudesPendientes) {
        this.solicitudesPendientes = solicitudesPendientes;
        this.context = context;
    }

    @Override
    public int getCount() {
        return solicitudesPendientes.size();
    }

    @Override
    public Object getItem(int position) {
        return solicitudesPendientes.get(position);
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
            rowView = inflater.inflate(R.layout.solicitudes_list, parent, false);
        }
        ImageView afiImagen = (ImageView)rowView.findViewById(R.id.afi_item_imagen_id);
        TextView nomApe = (TextView) rowView.findViewById(R.id.afi_item_nomape_id);
        TextView credencial = (TextView) rowView.findViewById(R.id.afi_item_credencial_id);
        TextView direccion = (TextView) rowView.findViewById(R.id.afi_item_direccion__id);
        SolicitudMedica sm = solicitudesPendientes.get(position);
        if(sm.getAfiliado().getPersonaFisica().getImagen()!=null && sm.getAfiliado().getPersonaFisica().getImagen().getBitmap()!=null) {
            afiImagen.setImageBitmap(sm.getAfiliado().getPersonaFisica().getImagen().getBitmap());
        }
        nomApe.setText(sm.getAfiliado().getPersonaFisica().getNombre()+" "+sm.getAfiliado().getPersonaFisica().getApellido());
        credencial.setText("Credencial: "+sm.getAfiliado().getCredencial());
        direccion.setText(sm.getDomicilio().getCalle()+ " " + sm.getDomicilio().getNumero()+", "+sm.getDomicilio().getLocalidad()+ ", "+sm.getDomicilio().getProvincia());
        return rowView;
    }
}
