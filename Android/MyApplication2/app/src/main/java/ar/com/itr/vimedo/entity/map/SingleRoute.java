package ar.com.itr.vimedo.entity.map;

import com.google.gson.annotations.SerializedName;

import java.util.List;

import ar.com.itr.vimedo.entity.Entity;

/**
 * Created by pablo_rizzo on 07/12/2016.
 */

public class SingleRoute extends Entity {

    @SerializedName(value="copyrights")
    private String copyrights;
    @SerializedName(value="overview_polyline")
    private OverviewPolyline overviewPolyline;
    @SerializedName(value="summary")
    private String summary;
    @SerializedName(value="legs")
    private List<Leg> legs;

    public String getCopyrights() {
        return copyrights;
    }

    public void setCopyrights(String copyrights) {
        this.copyrights = copyrights;
    }

    public OverviewPolyline getOverviewPolyline() {
        return overviewPolyline;
    }

    public void setOverviewPolyline(OverviewPolyline overviewPolyline) {
        this.overviewPolyline = overviewPolyline;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public List<Leg> getLegs() {
        return legs;
    }

    public void setLegs(List<Leg> legs) {
        this.legs = legs;
    }
}
