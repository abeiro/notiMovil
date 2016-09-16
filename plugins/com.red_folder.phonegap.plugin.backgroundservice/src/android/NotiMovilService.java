package com.red_folder.phonegap.plugin.backgroundservice;


/**
 * Created by abeiro on 16/09/16.
 */

import com.red_folder.phonegap.plugin.backgroundservice.BackgroundService;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;
import java.text.SimpleDateFormat;
import java.util.Date;

public class NotiMovilService extends BackgroundService {

    JSONObject currentConf;
    @Override
    protected JSONObject doWork() {
        JSONObject result = new JSONObject();

        try {
            // Following three lines simply produce a text string with Hello World and the date & time (UK format)
            SimpleDateFormat df = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
            String now = df.format(new Date(System.currentTimeMillis()));
            String msg = " " + now;

            // We output the message to the logcat
            Log.d("NotiMovilService", msg);

            // We also provide the same message in our JSON Result
            result.put("Message", msg);
        } catch (JSONException e) {
            // In production code, you would have some exception handling here
        }

        return result;
    }

    @Override
    protected JSONObject getConfig() {
        Log.d("NotiMovilService", "Getting config");
        return currentConf;
    }

    @Override
    protected void setConfig(JSONObject config) {
        Log.d("NotiMovilService", "Setting config");
        currentConf=config;
    }

    @Override
    protected JSONObject initialiseLatestResult() {
        return null;
    }

}
