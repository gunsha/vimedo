package ar.com.itr.vimedo.entity.map;

import com.google.gson.annotations.SerializedName;

import java.util.List;

import ar.com.itr.vimedo.entity.Entity;

/**
 * Created by pablo_rizzo on 07/12/2016.
 */

public class RouteResponse extends Entity {

    @SerializedName(value="geocoded_waypoints")
    private List<GeocodedWayponit> geocodedWaypoints;
    @SerializedName(value="routes")
    private List<SingleRoute> routes;

    public List<GeocodedWayponit> getGeocodedWaypoints() {
        return geocodedWaypoints;
    }

    public void setGeocodedWaypoints(List<GeocodedWayponit> geocodedWaypoints) {
        this.geocodedWaypoints = geocodedWaypoints;
    }

    public List<SingleRoute> getRoutes() {
        return routes;
    }

    public void setRoutes(List<SingleRoute> routes) {
        this.routes = routes;
    }
}
