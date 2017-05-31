package ar.com.itr.vimedo.exception;

/**
 * Created by pablo_rizzo on 24/11/2016.
 */

public class RestServiceException extends Exception {
    public RestServiceException() {
    }

    public RestServiceException(String message) {
        super(message);
    }

    public RestServiceException(String message, Throwable cause) {
        super(message, cause);
    }

    public RestServiceException(Throwable cause) {
        super(cause);
    }
}
