package ar.com.itr.vimedo.manager;

import android.content.Context;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.loopj.android.http.AsyncHttpClient;
import com.loopj.android.http.JsonHttpResponseHandler;
import com.loopj.android.http.RequestParams;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import ar.com.itr.vimedo.common.FormularioLogin;
import ar.com.itr.vimedo.common.FormularioPedidoMedico;
import ar.com.itr.vimedo.common.FormularioRegistro;
import ar.com.itr.vimedo.entity.CalificacionIndividual;
import ar.com.itr.vimedo.entity.Prepaga;
import ar.com.itr.vimedo.interfaces.RestManagerInterface;
import cz.msebera.android.httpclient.Header;
import cz.msebera.android.httpclient.entity.ByteArrayEntity;


/**
 * Created by pablo_rizzo on 21/11/2016.
 */
public class RestManagerImpl implements RestManagerInterface {

    private String HOST = "http://10.251.23.101";

    private String PORT = "3000";

    private AsyncHttpClient client = new AsyncHttpClient();

    private static RestManagerImpl ourInstance = new RestManagerImpl();

    public static RestManagerImpl getInstance() {
        return ourInstance;
    }

    private RestManagerImpl() {
    }

    @Override
    public void getSolicitudMedicaRoute(Context context, String solicitudMedicaId, JsonHttpResponseHandler jsonHttpResponseHandler) {
        String baseURL = HOST + ":" + PORT + "/solicitudesMedicas/ruta/"+solicitudMedicaId;
        client.get(context, baseURL, jsonHttpResponseHandler);
    }

    @Override
    public void getProfesionalRoutes(Context context, String profesionalId, JsonHttpResponseHandler jsonHttpResponseHandler) {
        String baseURL = HOST + ":" + PORT + "/solicitudesMedicas/ruta/profesional/"+profesionalId;
        client.get(context, baseURL, jsonHttpResponseHandler);
    }

    @Override
    public void getEspecialidades(Context context, JsonHttpResponseHandler jsonHttpResponseHandler) {
        String baseURL = HOST + ":" + PORT + "/especialidades";
        client.get(context, baseURL, jsonHttpResponseHandler);
    }

    @Override
    public void getPrepagas(Context context,JsonHttpResponseHandler jsonHttpResponseHandler) {
        String baseURL = HOST + ":" + PORT + "/prepagas";
        client.get(context, baseURL, jsonHttpResponseHandler);
    }

    @Override
    public void getAntecedentes(Context context, JsonHttpResponseHandler jsonHttpResponseHandler) {
        String baseURL = HOST + ":" + PORT + "/antecedentesMedicos";
        client.get(context, baseURL, jsonHttpResponseHandler);
    }

    @Override
    public void getDomiciliosUtilizados(Context context, JsonHttpResponseHandler jsonHttpResponseHandler) {
        String baseURL = HOST + ":" + PORT + "/antecedentesMedicos";
        client.get(context, baseURL, jsonHttpResponseHandler);
    }

    @Override
    public void getSolicitudesMedicasPaciente(Context context, String usuarioId, JsonHttpResponseHandler jsonHttpResponseHandler) {
        String baseURL = HOST + ":" + PORT + "/solicitudesMedicas/usuario/"+usuarioId;
        client.get(context, baseURL, jsonHttpResponseHandler);
    }

    @Override
    public void getSolicitudesMedicasProfesional(Context context, String profesionalId, JsonHttpResponseHandler jsonHttpResponseHandler) {
        String baseURL = HOST + ":" + PORT + "/solicitudesMedicas/profesional/"+profesionalId;
        client.get(context, baseURL, jsonHttpResponseHandler);
    }

    @Override
    public void solicitarMedico(Context context, FormularioPedidoMedico pedidoMedico, JsonHttpResponseHandler jsonHttpResponseHandler) throws UnsupportedEncodingException {
        String baseURL = HOST + ":" + PORT + "/solicitudesMedicas";
        Gson gson = new Gson();
        String pedidoMedicoJson = gson.toJson(pedidoMedico);
        ByteArrayEntity entity = new ByteArrayEntity(pedidoMedicoJson.getBytes("UTF-8"));
        client.post(context, baseURL, entity, "application/json", jsonHttpResponseHandler);
    }

    @Override
    public void calificarMedico(Context context, CalificacionIndividual calificacion, JsonHttpResponseHandler jsonHttpResponseHandler) throws UnsupportedEncodingException {
        String baseURL = HOST + ":" + PORT + "/profesionales/calificar";
        Gson gson = new Gson();
        String calificacionJson = gson.toJson(calificacion);
        ByteArrayEntity entity = new ByteArrayEntity(calificacionJson.getBytes("UTF-8"));
        client.post(context, baseURL, entity, "application/json", jsonHttpResponseHandler);
    }

    @Override
    public void registerUser(Context context,FormularioRegistro registro,JsonHttpResponseHandler jsonHttpResponseHandler) throws UnsupportedEncodingException {
        String baseURL = HOST + ":" + PORT + "/users/register";
        Gson gson = new Gson();
        String registriJson = gson.toJson(registro);
        ByteArrayEntity entity = new ByteArrayEntity(registriJson.getBytes("UTF-8"));
        client.post(context, baseURL, entity, "application/json", jsonHttpResponseHandler);
    }

    @Override
    public void loginUser(Context context, FormularioLogin login, JsonHttpResponseHandler jsonHttpResponseHandler) throws UnsupportedEncodingException {
        String baseURL = HOST + ":" + PORT + "/users/login";
        Gson gson = new Gson();
        String loginJson = gson.toJson(login);
        ByteArrayEntity entity = new ByteArrayEntity(loginJson.getBytes("UTF-8"));
        client.post(context, baseURL, entity, "application/json", jsonHttpResponseHandler);
    }

    @Override
    public void finalizarSolicitudMedica(Context context, String solicitudMedicaId, JsonHttpResponseHandler jsonHttpResponseHandler) {
        String baseURL = HOST + ":" + PORT + "/solicitudesMedicas/profesional/finalizarSolicitud/"+solicitudMedicaId;
        client.put(context,baseURL,null,jsonHttpResponseHandler);
    }
}
