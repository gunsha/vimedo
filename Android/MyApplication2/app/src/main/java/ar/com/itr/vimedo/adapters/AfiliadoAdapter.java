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
import ar.com.itr.vimedo.entity.Afiliado;

/**
 * Created by pablo_rizzo on 01/12/2016.
 */

public class AfiliadoAdapter extends BaseAdapter {

    private Context context;
    private List<Afiliado> afiliados;

    public AfiliadoAdapter(Context context,List<Afiliado> afiliados) {
        this.afiliados = afiliados;
        this.context = context;
    }

    @Override
    public int getCount() {
        return afiliados.size();
    }

    @Override
    public Object getItem(int position) {
        return afiliados.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position ;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        View rowView = convertView;
        if (convertView == null) {
            // Create a new view into the list.
            LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            rowView = inflater.inflate(R.layout.afiliado_list, parent, false);
        }
        ImageView afiImagen = (ImageView)rowView.findViewById(R.id.afi_item_imagen_id);
        TextView afiNomApe = (TextView) rowView.findViewById(R.id.afi_item_nomape_id);
        TextView afiCredencial = (TextView) rowView.findViewById(R.id.afi_item_credencial_id);
        Afiliado afiliado = this.afiliados.get(position);
        afiNomApe.setText(afiliado.getPersonaFisica().getNombre() + " " + afiliado.getPersonaFisica().getApellido());
        afiCredencial.setText("Credencial: "+afiliado.getCredencial());
        if(afiliado.getPersonaFisica().getImagen()!=null && afiliado.getPersonaFisica().getImagen().getBitmap()!=null) {
            afiImagen.setImageBitmap(afiliado.getPersonaFisica().getImagen().getBitmap());
        }
        return rowView;
    }
}
