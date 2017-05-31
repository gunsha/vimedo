package ar.com.itr.vimedo.entity.map;

import com.google.gson.annotations.SerializedName;

import ar.com.itr.vimedo.entity.Entity;

/**
 * Created by pablo_rizzo on 07/12/2016.
 */

public class Duration extends Entity {

    @SerializedName(value="text")
    private String text;
    @SerializedName(value="value")
    private Integer value;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Integer getValue() {
        return value;
    }

    public void setValue(Integer value) {
        this.value = value;
    }
}
