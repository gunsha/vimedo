package ar.com.itr.vimedo.entity.map;

import com.google.gson.annotations.SerializedName;

import ar.com.itr.vimedo.entity.Entity;

/**
 * Created by pablo_rizzo on 07/12/2016.
 */

public class Leg extends Entity {

    @SerializedName(value="distance")
    Distance distance;
    @SerializedName(value="duration")
    Duration duration;
    @SerializedName(value="end_address")
    private String endAddress;
    @SerializedName(value="end_location")
    private Location endLocation;
    @SerializedName(value="start_address")
    private String startAddress;
    @SerializedName(value="start_location")
    private Location startLocation;

    public Distance getDistance() {
        return distance;
    }

    public void setDistance(Distance distance) {
        this.distance = distance;
    }

    public Duration getDuration() {
        return duration;
    }

    public void setDuration(Duration duration) {
        this.duration = duration;
    }

    public String getEndAddress() {
        return endAddress;
    }

    public void setEndAddress(String endAddress) {
        this.endAddress = endAddress;
    }

    public Location getEndLocation() {
        return endLocation;
    }

    public void setEndLocation(Location endLocation) {
        this.endLocation = endLocation;
    }

    public String getStartAddress() {
        return startAddress;
    }

    public void setStartAddress(String startAddress) {
        this.startAddress = startAddress;
    }

    public Location getStartLocation() {
        return startLocation;
    }

    public void setStartLocation(Location startLocation) {
        this.startLocation = startLocation;
    }
}
