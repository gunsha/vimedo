package ar.com.itr.vimedo.entity.map;

import com.google.gson.annotations.SerializedName;

import java.util.List;

import ar.com.itr.vimedo.entity.Entity;

/**
 * Created by pablo_rizzo on 07/12/2016.
 */

public class GeocodedWayponit extends Entity {

    @SerializedName(value="geocoder_status")
    String geocoderStatus;
    @SerializedName(value="partial_match")
    Boolean partialMatch;
    @SerializedName(value="place_id")
    String placeId;
    @SerializedName(value="types")
    List<String> types;

    public String getGeocoderStatus() {
        return geocoderStatus;
    }

    public void setGeocoderStatus(String geocoderStatus) {
        this.geocoderStatus = geocoderStatus;
    }

    public Boolean getPartialMatch() {
        return partialMatch;
    }

    public void setPartialMatch(Boolean partialMatch) {
        this.partialMatch = partialMatch;
    }

    public String getPlaceId() {
        return placeId;
    }

    public void setPlaceId(String placeId) {
        this.placeId = placeId;
    }

    public List<String> getTypes() {
        return types;
    }

    public void setTypes(List<String> types) {
        this.types = types;
    }
}
