package ar.com.itr.vimedo.entity;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;

import com.google.gson.annotations.SerializedName;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

/**
 * Created by pablo_rizzo on 21/11/2016.
 */

public class Imagen extends Entity {

    @SerializedName(value = "_id")
    private String id;
    @SerializedName(value = "imagenData")
    private String imagenData;
    private transient Bitmap bitmap;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getImagenData() {
        return imagenData;
    }

    public void setImagenData(String imagenData) {
        this.imagenData = imagenData;
    }

    public Bitmap getBitmap() {

        if (bitmap==null && imagenData!=null && !imagenData.isEmpty()) {
            byte[] decodedString = imagenData.getBytes();
            decodedString = Base64.decode(decodedString, Base64.DEFAULT);
            InputStream is = new ByteArrayInputStream(decodedString);
            bitmap = BitmapFactory.decodeStream(is);
        }
        return bitmap;
    }
}
