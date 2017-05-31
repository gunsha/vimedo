package ar.com.itr.vimedo.interfaces;

import android.content.Context;

import com.loopj.android.http.JsonHttpResponseHandler;

import java.io.UnsupportedEncodingException;
import java.util.List;

import ar.com.itr.vimedo.common.FormularioLogin;
import ar.com.itr.vimedo.common.FormularioPedidoMedico;
import ar.com.itr.vimedo.common.FormularioRegistro;
import ar.com.itr.vimedo.entity.CalificacionIndividual;
import ar.com.itr.vimedo.entity.Prepaga;

/**
 * Created by pablo_rizzo on 21/11/2016.
 */

public interface RestManagerInterface {

    public void getSolicitudMedicaRoute(Context context, String solicitudMedicaId, JsonHttpResponseHandler jsonHttpResponseHandler);

    public void getProfesionalRoutes(Context context, String profesionalId, JsonHttpResponseHandler jsonHttpResponseHandler);

    public void getEspecialidades(Context context, JsonHttpResponseHandler jsonHttpResponseHandler);

    public void getPrepagas(Context context, JsonHttpResponseHandler jsonHttpResponseHandler);

    public void getAntecedentes(Context context, JsonHttpResponseHandler jsonHttpResponseHandler);

    public void getDomiciliosUtilizados(Context context, JsonHttpResponseHandler jsonHttpResponseHandler);

    public void getSolicitudesMedicasPaciente(Context context,  String usuario, JsonHttpResponseHandler jsonHttpResponseHandler);

    public void getSolicitudesMedicasProfesional(Context context,  String usuario, JsonHttpResponseHandler jsonHttpResponseHandler);

    public void solicitarMedico(Context context, FormularioPedidoMedico pedidoMedico, JsonHttpResponseHandler jsonHttpResponseHandler) throws UnsupportedEncodingException;

    public void calificarMedico(Context context, CalificacionIndividual calificacion, JsonHttpResponseHandler jsonHttpResponseHandler) throws UnsupportedEncodingException;

    public void registerUser(Context context,FormularioRegistro registro,JsonHttpResponseHandler jsonHttpResponseHandler) throws UnsupportedEncodingException;

    public void loginUser(Context context, FormularioLogin fl, JsonHttpResponseHandler jsonHttpResponseHandler) throws UnsupportedEncodingException;

    public void finalizarSolicitudMedica(Context context, String solicitudMedicaId, JsonHttpResponseHandler jsonHttpResponseHandler);

}
