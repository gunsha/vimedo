package ar.com.itr.vimedo.manager;

import android.content.Context;
import android.content.res.AssetManager;
import android.graphics.Color;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.loopj.android.http.JsonHttpResponseHandler;

import org.apache.commons.io.IOUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import ar.com.itr.vimedo.CustomFragment;
import ar.com.itr.vimedo.R;
import ar.com.itr.vimedo.common.FormularioLogin;
import ar.com.itr.vimedo.common.FormularioPedidoMedico;
import ar.com.itr.vimedo.common.FormularioRegistro;
import ar.com.itr.vimedo.entity.Afiliado;
import ar.com.itr.vimedo.entity.Antecedente;
import ar.com.itr.vimedo.entity.CalificacionIndividual;
import ar.com.itr.vimedo.entity.Domicilio;
import ar.com.itr.vimedo.entity.Especialidad;
import ar.com.itr.vimedo.entity.GrupoFamiliar;
import ar.com.itr.vimedo.entity.Prepaga;
import ar.com.itr.vimedo.entity.Profesional;
import ar.com.itr.vimedo.entity.SolicitudMedica;
import ar.com.itr.vimedo.entity.Usuario;
import ar.com.itr.vimedo.entity.map.RouteResponse;
import ar.com.itr.vimedo.interfaces.ApplicationManagerInterface;
import ar.com.itr.vimedo.interfaces.RestManagerInterface;
import ar.com.itr.vimedo.interfaces.ScreenManagerInterface;
import ar.com.itr.vimedo.util.Constants;
import ar.com.itr.vimedo.util.MapUtils;
import cz.msebera.android.httpclient.Header;
import layout.PacCalificarMedico;

/**
 * Created by pablo_rizzo on 21/11/2016.
 */

public class ApplicationManagerImpl implements ApplicationManagerInterface {

    private Context context;
    private AppCompatActivity activity;
    private ScreenManagerInterface screenManager;
    private RestManagerInterface restManager = RestManagerImpl.getInstance();
    private GrupoFamiliar grupoFamiliar;
    private Profesional profesional;
    private Usuario usuario;
    private List<SolicitudMedica> solicitudesMedicasPendientes;
    private List<Domicilio> domiciliosGrupoFamiiar;
    private List<Domicilio> domiciliosUtilizados;
    private List<Prepaga> prepagas;
    private List<Antecedente> antecedentes;
    private List<Especialidad> especialidades;
    private List<String> horaList;
    private List<String> minutoList;
    private List<Integer> mapColors;
    private boolean loged;

    public ApplicationManagerImpl(AppCompatActivity activity,ScreenManagerInterface screenManager,Context context) {
        this.context = context;
        this.activity = activity;
        this.screenManager = screenManager;
        loadMapColors();
    }

    public RestManagerInterface getRestManager() {
        return restManager;
    }

    public void setRestManager(RestManagerInterface restManager) {
        this.restManager = restManager;
    }

    public GrupoFamiliar getGrupoFamiliar() {
        return grupoFamiliar;
    }

    public void setGrupoFamiliar(GrupoFamiliar grupoFamiliar) {
        this.grupoFamiliar = grupoFamiliar;
    }

    public Profesional getProfesional() {
        return profesional;
    }

    public void setProfesional(Profesional profesional) {
        this.profesional = profesional;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public List<Prepaga> getPrepagas() {
        return prepagas;
    }

    public void setPrepagas(List<Prepaga> prepagas) {
        this.prepagas = prepagas;
    }

    public List<Antecedente> getAntecedentes() {
        return antecedentes;
    }

    public void setAntecedentes(List<Antecedente> antecedentes) {
        this.antecedentes = antecedentes;
    }

    public boolean isLoged() { return loged; }

    private void loadMapColors() {
        AssetManager assetManager =  activity.getAssets();
        mapColors = new ArrayList<Integer>();
        try {
            InputStream ims = assetManager.open("vimedoColors.json");
            JSONArray jarray = new JSONArray(IOUtils.toString(ims,"UTF-8"));
            for (int index = 0; index < jarray.length(); index++) {
                JSONObject row = jarray.getJSONObject(index);
                mapColors.add(new Integer(Color.parseColor((String) row.get("hex"))));
            }
        } catch (IOException e) {
            e.printStackTrace();
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }


    private void initTimeArrays() {
        horaList = new ArrayList<>();
        minutoList = new ArrayList<>();
        for(int index=0;index<24;index++) {
            horaList.add(String.format("%02d", index)+" hs.");
        }
        for(int index=0;index<60;index=index+5) {
            getMinutoList().add(String.format("%02d", index)+" mtos.");
        }
    }

    @Override
    public void initApplication() {
        loadInitialData();
        initTimeArrays();
        screenManager.goToScreen(Constants.SCREEN_INIT);
    }

    @Override
    public List<String> getPrepagaNameList() {
        List<String> prepagaList = new ArrayList<>();
        if (prepagas!=null) {
            for(Prepaga prepaga : prepagas) {
                prepagaList.add(prepaga.getNombre());
            }
        }
        return prepagaList;
    }

    @Override
    public Prepaga getPrepagaByName(String name) {
        if(name!=null && prepagas!=null){
            for(Prepaga prepaga : prepagas) {
                if(name.equals(prepaga.getNombre())) {
                    return prepaga;
                }
            }
        }
        return null;
    }

   @Override
    public List<String> getAntecedenteNameList() {
        List<String> antecedenteList = new ArrayList<>();
        if (antecedentes!=null) {
            for(Antecedente antecedente : antecedentes) {
                antecedenteList.add(antecedente.getNombre());
            }
        }
        return antecedenteList;
    }

    @Override
    public List<String> getHoraList() {
        return horaList;
    }

    @Override
    public List<String> getMinutoList() {
        return minutoList;
    }

    @Override
    public Antecedente getAntecedenteById(String id) {
        if(id!=null && antecedentes!=null){
            for(Antecedente antecedente : antecedentes) {
                if(id.equals(antecedente.getId())) {
                    return antecedente;
                }
            }
        }
        return null;
    }

    @Override
    public Antecedente getAntecedenteByName(String name) {
        if(name!=null && antecedentes!=null){
            for(Antecedente antecedente : antecedentes) {
                if(name.equals(antecedente.getNombre())) {
                    return antecedente;
                }
            }
        }
        return null;
    }

    @Override
    public Especialidad getEspecialidadById(String id) {
        if (id!=null && !id.isEmpty()) {
            for(Especialidad especialidad : especialidades) {
                if (id.equals(especialidad.getId())) {
                    return especialidad;
                }
            }
        }
        return null;
    }

    @Override
    public Especialidad getEspecialidadByName(String nombre) {
        if (nombre!=null && !nombre.isEmpty()) {
            for(Especialidad especialidad : especialidades) {
                if (nombre.equals(especialidad.getNombre())) {
                    return especialidad;
                }
            }
        }
        return null;
    }

    @Override
    public void calificarProfesional(CalificacionIndividual calificacion, final CustomFragment cf) throws UnsupportedEncodingException {
        RestManagerImpl.getInstance().calificarMedico(context,calificacion,new JsonHttpResponseHandler() {
            @Override
            public void onStart() {
            }
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                if (statusCode==200) {
                    cf.processAfterAsyncCall(Constants.TYPE_CALIFICACION_OK,Constants.SERVICE_OK,"Se calificó exitosamente");
                }
            }
            @Override
            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject errorResponse) {
                String message = "";
                int resultCode = Constants.SERVICE_FAILURE;
                if (statusCode==404) {
                    try {
                        message = errorResponse.getString("message");
                        resultCode = Constants.GENERAL_FAILURE;
                    } catch (JSONException e) {
                    }
                } else {
                    message = "Falla en el servicio para calificar al profesional";
                }
                cf.processAfterAsyncCall(null,resultCode,message);
            }
            @Override
            public void onRetry(int retryNo) {
            }
            @Override
            public void onProgress(long bytesWritten, long totalSize) {
            }
            @Override
            public void onFinish(){
            }
        });
    }

    @Override
    public void loadProfesionalRoutes(final CustomFragment cf) {
        RestManagerImpl.getInstance().getProfesionalRoutes(context,profesional.getId(),new JsonHttpResponseHandler() {
            @Override
            public void onStart() {
            }
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                if (statusCode==200) {
                    profesional = profesional == null ? new Profesional() : profesional;
                    profesional.setRutaProfesional(MapUtils.getRutaProfesionalFromGoogleResponse(response));
                }
                cf.processAfterAsyncCall(Constants.TYPE_CARGA_RUTAS_SOLICITUDES_MEDICAS,null,null);
            }
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONArray response) {
            }
            @Override
            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject errorResponse) {
            }
            @Override
            public void onFailure(int statusCode, Header[] headers, String responseString, Throwable throwable) {
            }
            @Override
            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONArray errorResponse) {
            }
            @Override
            public void onRetry(int retryNo) {
            }
            @Override
            public void onProgress(long bytesWritten, long totalSize) {
            }
            @Override
            public void onFinish(){
            }
        });
    }

    @Override
    public void loadSolicitudesMedicasRoute(final CustomFragment cf) {
        if (solicitudesMedicasPendientes!=null && !solicitudesMedicasPendientes.isEmpty()) {
            final Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").create();
            for(final SolicitudMedica sm : solicitudesMedicasPendientes) {
                RestManagerImpl.getInstance().getSolicitudMedicaRoute(context,sm.getId(),new JsonHttpResponseHandler() {
                    @Override
                    public void onStart() {
                    }
                    @Override
                    public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                       if (statusCode==200) {
                           profesional = profesional == null ? new Profesional() : profesional;
                           profesional.setRutaProfesional(MapUtils.getRutaProfesionalFromGoogleResponse(response));
                        }
                        cf.processAfterAsyncCall(Constants.TYPE_CARGA_RUTAS_SOLICITUDES_MEDICAS,null,null);
                    }
                    @Override
                    public void onSuccess(int statusCode, Header[] headers, JSONArray response) {
                    }
                    @Override
                    public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject errorResponse) {
                    }
                    @Override
                    public void onFailure(int statusCode, Header[] headers, String responseString, Throwable throwable) {
                    }
                    @Override
                    public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONArray errorResponse) {
                    }
                    @Override
                    public void onRetry(int retryNo) {
                    }
                    @Override
                    public void onProgress(long bytesWritten, long totalSize) {
                    }
                    @Override
                    public void onFinish(){
                    }
                });
            }
        }
    }

    @Override
    public void loadSolicitudesMedicasProfesional(final CustomFragment cf) {
        RestManagerImpl.getInstance().getSolicitudesMedicasProfesional(context,getUsuario().getProfesional().getId(),new JsonHttpResponseHandler() {
            @Override
            public void onStart() {
            }
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONArray response) {
                if (statusCode==200) {
                    Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").create();
                    solicitudesMedicasPendientes = new ArrayList<SolicitudMedica>();
                    try {
                        for (int i = 0; i < response.length(); i++) {
                            JSONObject jo = response.getJSONObject(i);
                            SolicitudMedica solicitudMedica = gson.fromJson(jo.toString(), SolicitudMedica.class);
                            solicitudesMedicasPendientes.add(solicitudMedica);
                        }
                        cf.processAfterAsyncCall(Constants.TYPE_CARGA_SOLICITUDES_MEDICAS,Constants.SERVICE_OK, "");
                    } catch (JSONException e) {
                        e.printStackTrace();
                    } catch (Exception e) {
                        cf.processAfterAsyncCall(Constants.TYPE_CARGA_SOLICITUDES_MEDICAS,Constants.GENERAL_FAILURE, "Falló la carga de las solicitudes pendientes");
                    }
                }
            }
            @Override
            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject errorResponse) {
                int resultCode = Constants.SERVICE_FAILURE;
                String message = "Falló la carga de las solicitudes pendientes";
                cf.processAfterAsyncCall(null,resultCode,message);
            }
            @Override
            public void onFailure(int statusCode, Header[] headers, String responseString, Throwable throwable) {
                int resultCode = Constants.SERVICE_FAILURE;
                String message = "Falló la carga de las solicitudes pendientes";
                cf.processAfterAsyncCall(null,resultCode,message);
            }
            @Override
            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONArray errorResponse) {
                int resultCode = Constants.SERVICE_FAILURE;
                String message = "Falló la carga de las solicitudes pendientes";
                cf.processAfterAsyncCall(null,resultCode,message);
            }
            @Override
            public void onRetry(int retryNo) {
            }
            @Override
            public void onProgress(long bytesWritten, long totalSize) {
            }
            @Override
            public void onFinish(){
            }
        });
    }

    @Override
    public void loadSolicitudesMedicasPaciente(final CustomFragment cf) {
        RestManagerImpl.getInstance().getSolicitudesMedicasPaciente(context,getUsuario().getId(),new JsonHttpResponseHandler() {
            @Override
            public void onStart() {
            }
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONArray response) {
                if (statusCode==200) {
                    Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").create();
                    solicitudesMedicasPendientes = new ArrayList<SolicitudMedica>();
                    try {
                        for (int i = 0; i < response.length(); i++) {
                            JSONObject jo = response.getJSONObject(i);
                            SolicitudMedica solicitudMedica = gson.fromJson(jo.toString(), SolicitudMedica.class);
                            solicitudesMedicasPendientes.add(solicitudMedica);
                            profesional = solicitudMedica.getProfesional();
                        }
                        cf.processAfterAsyncCall(Constants.TYPE_CARGA_SOLICITUDES_MEDICAS,Constants.SERVICE_OK, "");
                    } catch (JSONException e) {
                        e.printStackTrace();
                    } catch (Exception e) {
                        cf.processAfterAsyncCall(Constants.TYPE_CARGA_SOLICITUDES_MEDICAS,Constants.GENERAL_FAILURE, "Falló la carga de las solicitudes pendientes");
                    }
                }
            }
            @Override
            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject errorResponse) {
                int resultCode = Constants.SERVICE_FAILURE;
                String message = "Falló la carga de las solicitudes pendientes";
                cf.processAfterAsyncCall(null,resultCode,message);
            }
            @Override
            public void onFailure(int statusCode, Header[] headers, String responseString, Throwable throwable) {
                int resultCode = Constants.SERVICE_FAILURE;
                String message = "Falló la carga de las solicitudes pendientes";
                cf.processAfterAsyncCall(null,resultCode,message);
            }
            @Override
            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONArray errorResponse) {
                int resultCode = Constants.SERVICE_FAILURE;
                String message = "Falló la carga de las solicitudes pendientes";
                cf.processAfterAsyncCall(null,resultCode,message);
            }
            @Override
            public void onRetry(int retryNo) {
            }
            @Override
            public void onProgress(long bytesWritten, long totalSize) {
            }
            @Override
            public void onFinish(){
            }
        });
    }

    @Override
    public void registerUser(FormularioRegistro fr, final CustomFragment cf) throws UnsupportedEncodingException {
        RestManagerImpl.getInstance().registerUser(context,fr,new JsonHttpResponseHandler() {
            @Override
            public void onStart() {
            }
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                if (statusCode==200) {
                    Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").create();
                    try {
                        JSONObject jsonUsuario = response.getJSONObject("usuario");
                        usuario = gson.fromJson(jsonUsuario.toString(),Usuario.class);
                        if (usuario.getAfiliado()!=null) {
                            JSONObject jsonGrupoFamiliar = response.getJSONObject("grupoFamiliar");
                            grupoFamiliar = gson.fromJson(jsonGrupoFamiliar.toString(),GrupoFamiliar.class);
                            domiciliosUtilizados = new ArrayList<Domicilio>();
                            solicitudesMedicasPendientes = new ArrayList<SolicitudMedica>();
                        }
                        cf.processAfterAsyncCall(null,Constants.SERVICE_OK,"El registro se realizó exitosamente");
                    } catch (JSONException e) {
                        cf.processAfterAsyncCall(null,Constants.GENERAL_FAILURE,"Falló el registro");
                    }
                }
            }
            @Override
            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject errorResponse) {
                String message = "";
                int resultCode = Constants.SERVICE_FAILURE;
                if (statusCode==404) {
                    try {
                        message = errorResponse.getString("message");
                        resultCode = Constants.GENERAL_FAILURE;
                    } catch (JSONException e) {
                    }
                } else {
                    message = "Falla en el servicio";
                }
                cf.processAfterAsyncCall(null,resultCode,message);
            }
            @Override
            public void onRetry(int retryNo) {
            }
            @Override
            public void onProgress(long bytesWritten, long totalSize) {
            }
            @Override
            public void onFinish(){
            }
        });
    }

    @Override
    public void solicitarMedico(FormularioPedidoMedico fpm, final CustomFragment cf) throws UnsupportedEncodingException {
        RestManagerImpl.getInstance().solicitarMedico(context, fpm, new JsonHttpResponseHandler() {
            @Override
            public void onStart() {
            }

            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                if (statusCode==200) {
                    solicitudesMedicasPendientes = new ArrayList<SolicitudMedica>();
                    Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").create();
                    try {
                        SolicitudMedica solicitud = gson.fromJson(response.toString(), SolicitudMedica.class);
                        solicitudesMedicasPendientes.add(solicitud);
                        cf.processAfterAsyncCall(null,Constants.SERVICE_OK, "");
                    } catch (Exception e) {
                        cf.processAfterAsyncCall(null,Constants.GENERAL_FAILURE, "Falló la solicitud de médico");
                    }
                }
            }

            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONArray response) {
                if (statusCode==200) {
                    Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").create();
                    solicitudesMedicasPendientes = new ArrayList<SolicitudMedica>();
                    try {
                        for (int i = 0; i < response.length(); i++) {
                                JSONObject jo = response.getJSONObject(i);
                                SolicitudMedica solicitudMedica = gson.fromJson(jo.toString(), SolicitudMedica.class);
                                solicitudesMedicasPendientes.add(solicitudMedica);
                        }
                        cf.processAfterAsyncCall(null,Constants.SERVICE_OK, "La solicitud se realizó exitosamente");
                    } catch (JSONException e) {
                        e.printStackTrace();
                    } catch (Exception e) {
                        cf.processAfterAsyncCall(null,Constants.GENERAL_FAILURE, "Falló la solicitud de médico");
                    }
                }
            }

            @Override
            public void onFailure(int statusCode, Header[] headers, String responseString, Throwable throwable) {
                String message = "";
                int resultCode = Constants.SERVICE_FAILURE;
                message = "Falla en el servicio";
                cf.processAfterAsyncCall(null,resultCode,message);
            }

            @Override
            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject errorResponse) {
                String message = "";
                int resultCode = Constants.SERVICE_FAILURE;
                if (statusCode==404) {
                    try {
                        message = errorResponse.getString("message");
                        resultCode = Constants.GENERAL_FAILURE;
                    } catch (JSONException e) {
                    }
                } else {
                    message = "Falla en el servicio";
                }
                cf.processAfterAsyncCall(null,resultCode,message);
            }
            @Override
            public void onRetry(int retryNo) {
            }
            @Override
            public void onProgress(long bytesWritten, long totalSize) {
            }
            @Override
            public void onFinish() {
            }
        });
    }

    @Override
    public void loginUser(FormularioLogin fl, final CustomFragment cf) throws UnsupportedEncodingException {
        RestManagerImpl.getInstance().loginUser(context, fl, new JsonHttpResponseHandler() {
            @Override
            public void onStart() {
                Log.d("Register Service","onStart");
            }
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                Log.d("Status Code",Integer.toString(statusCode));
                if (statusCode==200) {
                    Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").create();
                    try {
                        JSONObject jsonUsuario = response.getJSONObject("usuario");
                        usuario = gson.fromJson(jsonUsuario.toString(),Usuario.class);
                        if (usuario.getAfiliado()!=null) {
                            JSONObject jsonGrupoFamiliar = response.getJSONObject("grupoFamiliar");
                            JSONArray jsonUltimosDomicilios = response.getJSONArray("ultimosDomicilios");
                            JSONArray jsonSolicitudesPendientes = response.getJSONArray("solicitudesPendientes");
                            grupoFamiliar = gson.fromJson(jsonGrupoFamiliar.toString(),GrupoFamiliar.class);
                            domiciliosUtilizados = new ArrayList<Domicilio>();
                            solicitudesMedicasPendientes = new ArrayList<SolicitudMedica>();
                            for(int index=0; index<jsonUltimosDomicilios.length();index++) {
                                JSONObject jo = jsonUltimosDomicilios.getJSONObject(index);
                                domiciliosUtilizados.add(gson.fromJson(jo.toString(),Domicilio.class));
                            }
                            for(int index=0; index<jsonSolicitudesPendientes.length();index++) {
                                JSONObject jo = jsonSolicitudesPendientes.getJSONObject(index);
                                solicitudesMedicasPendientes.add(gson.fromJson(jo.toString(),SolicitudMedica.class));
                            }
                        } else {
                            profesional = usuario.getProfesional();
                        }
                        cf.processAfterAsyncCall(null,Constants.SERVICE_OK,"Bienvenido a VIMEDO");
                    } catch (JSONException e) {
                        cf.processAfterAsyncCall(null,Constants.GENERAL_FAILURE,"Falló el login");
                    }
                }
            }
            @Override
            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject errorResponse) {
                String message = "";
                int resultCode = Constants.SERVICE_FAILURE;;
                if (statusCode==404) {
                    try {
                        message = errorResponse.getString("message");
                        resultCode = Constants.GENERAL_FAILURE;
                    } catch (JSONException e) {
                    }
                } else {
                    message = "Falla en el servicio";
                }
                cf.processAfterAsyncCall(null,resultCode,message);
            }
            @Override
            public void onRetry(int retryNo) {
            }
            @Override
            public void onProgress(long bytesWritten, long totalSize) {
            }
            @Override
            public void onFinish(){

            }
        });
    }

    @Override
    public void finalizarSolicitudMedica(String solicitudMedicaId, final CustomFragment cf) {
        RestManagerImpl.getInstance().finalizarSolicitudMedica(context, solicitudMedicaId, new JsonHttpResponseHandler() {
            @Override
            public void onStart() {
            }

            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                if (statusCode == 200) {
                   cf.processAfterAsyncCall(Constants.TYPE_SOLICITUD_FINALIZADA, Constants.SERVICE_OK, null);
                }
            }

            @Override
            public void onFailure(int statusCode, Header[] headers, String responseString, Throwable throwable) {
                String message = "";
                int resultCode = Constants.SERVICE_FAILURE;
                message = "Falla en el servicio";
                cf.processAfterAsyncCall(null, resultCode, message);
            }

            @Override
            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject errorResponse) {
                String message = "";
                int resultCode = Constants.SERVICE_FAILURE;
                if (statusCode == 404) {
                    try {
                        message = errorResponse.getString("message");
                        resultCode = Constants.GENERAL_FAILURE;
                    } catch (JSONException e) {
                    }
                } else {
                    message = "Falla en el servicio";
                }
                cf.processAfterAsyncCall(null, resultCode, message);
            }

            @Override
            public void onRetry(int retryNo) {
            }

            @Override
            public void onProgress(long bytesWritten, long totalSize) {
            }

            @Override
            public void onFinish() {
            }
        });
    }

    @Override
    public String getTipoUsuario() {
       if (usuario.getAfiliado()!=null) {
           return Constants.TIPO_USUARIO_PACIENTE;
       } else {
           if (usuario.getProfesional()!=null) {
               return Constants.TIPO_USUARIO_MEDICO;
           }
       }
        return Constants.TIPO_USUARIO_UNDEFINED;
    }

    @Override
    public List<Domicilio> getDomiciliosGrupoFamiliar() {
        if (domiciliosGrupoFamiiar==null) {
            domiciliosGrupoFamiiar = new ArrayList<>();
            if (usuario.getAfiliado().getPersonaFisica().getDomicilios()!=null) {
                domiciliosGrupoFamiiar.addAll(usuario.getAfiliado().getPersonaFisica().getDomicilios());
            }
            if (grupoFamiliar!=null && grupoFamiliar.getAfiliados()!=null) {
                List<Afiliado> afiliados = grupoFamiliar.getAfiliados();
                for(Afiliado afiliado : afiliados) {
                    if (afiliado.getPersonaFisica()!=null && afiliado.getPersonaFisica().getDomicilios()!=null) {
                        List<Domicilio> domicilios = afiliado.getPersonaFisica().getDomicilios();
                        for (Domicilio domicilio: domicilios) {
                            addUniqueDomicilioToList(domicilio);
                        }
                    }
                }
            }
        }
        return domiciliosGrupoFamiiar;
    }

    private void addUniqueDomicilioToList(Domicilio domicilio) {
        boolean domicilioExist = false;
        for(Domicilio domicilioTemp : domiciliosGrupoFamiiar) {
            if (domicilioTemp.equals(domicilio)) {
                domicilioExist = true;
            }
        }
        if (!domicilioExist) {
            domiciliosGrupoFamiiar.add(domicilio);
        }
    }

    @Override
    public void loadDomiciliosUtilizados() {
        RestManagerImpl.getInstance().getDomiciliosUtilizados(context,new JsonHttpResponseHandler() {
            @Override
            public void onStart() {
                domiciliosUtilizados = new ArrayList<Domicilio>();
            }
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONArray response) {
                Log.d("Status Code",Integer.toString(statusCode));
                Gson gson = new GsonBuilder().create();
                for (int i = 0; i < response.length(); i++) {
                    try {
                        JSONObject jo = response.getJSONObject(i);
                        Domicilio domicilio = gson.fromJson(jo.toString(), Domicilio.class);
                        domiciliosUtilizados.add(domicilio);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
            @Override
            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject errorResponse) {
            }
            @Override
            public void onRetry(int retryNo) {
            }
            @Override
            public void onProgress(long bytesWritten, long totalSize) {
            }
            @Override
            public void onFinish() {
            }
        });
    }

    @Override
    public List<Domicilio> getDomiciliosUtilizados() {
        return domiciliosUtilizados;
    }

    @Override
    public List<Afiliado> getAfiliadosGrupoFamiliar() {
        List<Afiliado> afiliadosGF = new ArrayList<Afiliado>();
        afiliadosGF.add(usuario.getAfiliado());
        afiliadosGF.addAll(grupoFamiliar.getAfiliados());
        return afiliadosGF;
    }

    @Override
    public Usuario getUserLogued() {
        return usuario;
    }

    @Override
    public boolean isSolicitudesPendientes() {
        return !(solicitudesMedicasPendientes==null || solicitudesMedicasPendientes.isEmpty());
    }

    @Override
    public List<SolicitudMedica> getSolicitudesMedicasPendientesProfesional() {
        return solicitudesMedicasPendientes;
    }

    @Override
    public SolicitudMedica getSolicitudMedicaPendientePaciente() {
        return (solicitudesMedicasPendientes == null || solicitudesMedicasPendientes.isEmpty()) ? null : solicitudesMedicasPendientes.get(0);
    }

    @Override
    public List<Integer> getColorList() {
        return mapColors;
    }

    @Override
    public void deleteSolicitudMedicaProfesionalFromList(SolicitudMedica sm) {
        getSolicitudesMedicasPendientesProfesional().remove(sm);
    }

    private void loadInitialData() {
        loadPrepagas();
        loadAntecedentes();
        loadEspecialidades();
    }

    private void loadEspecialidades() {
        RestManagerImpl.getInstance().getEspecialidades(context,new JsonHttpResponseHandler() {
            @Override
            public void onStart() {
            }
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONArray response) {
                Log.d("Status Code",Integer.toString(statusCode));
                especialidades = new ArrayList<Especialidad>();
                Gson gson = new GsonBuilder().create();
                for (int i = 0; i < response.length(); i++) {
                    try {
                        JSONObject jo = response.getJSONObject(i);
                        Especialidad especialidad = gson.fromJson(jo.toString(), Especialidad.class);
                        especialidades.add(especialidad);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
            @Override
            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject errorResponse) {
            }
            @Override
            public void onRetry(int retryNo) {
            }
            @Override
            public void onProgress(long bytesWritten, long totalSize) {
            }
            @Override
            public void onFinish() {
            }
        });
    }

    private void loadAntecedentes() {
        RestManagerImpl.getInstance().getAntecedentes(context,new JsonHttpResponseHandler() {
            @Override
            public void onStart() {
            }
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONArray response) {
                Log.d("Status Code",Integer.toString(statusCode));
                antecedentes = new ArrayList<Antecedente>();
                Gson gson = new GsonBuilder().create();
                for (int i = 0; i < response.length(); i++) {
                    try {
                        JSONObject jo = response.getJSONObject(i);
                        Antecedente antecedente = gson.fromJson(jo.toString(), Antecedente.class);
                        antecedentes.add(antecedente);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
            @Override
            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject errorResponse) {
            }
            @Override
            public void onRetry(int retryNo) {
            }
            @Override
            public void onProgress(long bytesWritten, long totalSize) {
            }
            @Override
            public void onFinish() {
            }
        });
    }

    private void loadPrepagas() {
        RestManagerImpl.getInstance().getPrepagas(context,new JsonHttpResponseHandler() {
            @Override
            public void onStart() {
            }
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONArray response) {
                Log.d("Status Code",Integer.toString(statusCode));
                prepagas = new ArrayList<Prepaga>();
                Gson gson = new GsonBuilder().create();
                for (int i = 0; i < response.length(); i++) {
                    try {
                        JSONObject jo = response.getJSONObject(i);
                        Prepaga prepaga = gson.fromJson(jo.toString(), Prepaga.class);
                        prepagas.add(prepaga);

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
            @Override
            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject errorResponse) {
            }
            @Override
            public void onRetry(int retryNo) {
            }
            @Override
            public void onProgress(long bytesWritten, long totalSize) {
            }
            @Override
            public void onFinish() {
            }
        });
    }
}
