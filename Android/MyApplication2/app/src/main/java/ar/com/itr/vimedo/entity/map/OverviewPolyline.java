package ar.com.itr.vimedo.entity.map;

import com.google.gson.annotations.SerializedName;

import ar.com.itr.vimedo.entity.Entity;

/**
 * Created by pablo_rizzo on 07/12/2016.
 */

public class OverviewPolyline extends Entity {

    @SerializedName(value="points")
    private String points;

    public String getPoints() {
        return points;
    }

    public void setPoints(String points) {
        this.points = points;
    }
}
