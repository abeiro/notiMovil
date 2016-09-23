package com.red_folder.phonegap.plugin.backgroundservice;


/**
 * Created by abeiro on 16/09/16.
 */


import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import android.R;

import javax.net.ssl.HttpsURLConnection;

public class NotiMovilService extends BackgroundService {

    JSONObject currentConf = null;
    int nRuns = 0;
    Boolean warned = false;
    String token = "";
    String lastMsg="";

    public void clearToken() {
    
		warned=false;
		nRuns=0;
		token="";
		
    }
    
    public void checkUnreaded(String lastUnreaded) {
        Log.d("NotiMovilService", "memory:<"+lastMsg+"> received <"+lastUnreaded+">");

        if (lastMsg=="") {
            SharedPreferences sharedPref = getSharedPreferences("es.ruralsur.notimovil.prefs",Context.MODE_PRIVATE);
            lastMsg=sharedPref.getString("lastMsg","");


        }
        if (!lastMsg.equals(lastUnreaded)) {
            lastMsg=lastUnreaded;

            SharedPreferences sharedPref = getSharedPreferences("es.ruralsur.notimovil.prefs",Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = sharedPref.edit();
            editor.putString("lastMsg", lastMsg);
            editor.commit();

            sendNotificationUnreaded();
        }
    }

    @Override
    protected JSONObject doWork() {
        JSONObject result = new JSONObject();

        try {

            SimpleDateFormat df = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
            String now = df.format(new Date(System.currentTimeMillis()));
            String msg = " " + now;
            if (token!="") {
                msg += " token: " + token;
                sendPostRequestSimple(token, "LAST", "https://dmz.cajaruraldelsur.es/ws/notiMovil/");
                nRuns=0;

            }
            else {
                SharedPreferences sharedPref = getSharedPreferences("es.ruralsur.notimovil.prefs",Context.MODE_PRIVATE);
                token=sharedPref.getString("savedToken","");
                if (token!="") {
                    msg += " token: " + token;
                    sendPostRequestSimple(token, "LAST", "https://dmz.cajaruraldelsur.es/ws/notiMovil/");
                    nRuns=0;
                } else {
                    msg += " token: REQUEST:<" + token + ">";
                    result.put("cmd", "REQ_CONFIG");
                }
            }

            Log.d("NotiMovilService", msg);
            result.put("Message", msg);
            nRuns++;


        } catch (JSONException e) {
            // In production code, you would have some exception handling here
        }

        if ((nRuns > 1) && (token=="")) {
            // Unable to get working token. Warn here.
            if (!warned) {
                warned = true;
                sendNotification();

            }


        }

        return result;
    }

    @Override
    protected JSONObject getConfig() {
        Log.d("NotiMovilService", "Getting config");
        if (currentConf == null)
            return null;
        return currentConf;
    }

    @Override
    protected void setConfig(JSONObject config) {
        Log.d("NotiMovilService", "Setting config called:" + config.toString());
        try {
            if (config == null)
                return;
            if (!config.isNull("CMD")) {
                sendNotification();
            } else if (!config.isNull("token")) {
                Log.d("NotiMovilService", "Setting config done: " + config.get("token").toString());
                token = config.get("token").toString();
                currentConf = config;

                SharedPreferences sharedPref = getSharedPreferences("es.ruralsur.notimovil.prefs",Context.MODE_PRIVATE);
                SharedPreferences.Editor editor = sharedPref.edit();
                editor.putString("savedToken", token);
                editor.commit();


            }

        } catch (Exception e) {
            Log.d("NotiMovilService", "Setting config error: " + config.toString(), e);
        }

    }

    @Override
    protected JSONObject initialiseLatestResult() {
        return null;
    }

    protected void sendNotification() {
        Log.d("NotiMovilService", "Sending notification start");
        try {
            PackageManager manager = this.getPackageManager();
            Intent i = manager.getLaunchIntentForPackage("es.crsur.notimovil");
            i.addCategory(Intent.CATEGORY_LAUNCHER);
            PendingIntent pIntent = PendingIntent.getActivity(this, 0, i, 0);
            Log.d("NotiMovilService", "Sending notification intent created");

            Notification n = new Notification.Builder(this)
                    .setContentTitle("Notificaciones CRSUR")
                    .setContentText("La configuración de la cuenta es incorrecta")
                    .setSmallIcon(android.R.drawable.ic_dialog_alert)
                    .setContentIntent(pIntent)
                    .setAutoCancel(true)
                    //.addAction(R.drawable.icon, "Call", pIntent)
                    //.addAction(R.drawable.icon, "More", pIntent)
                    //.addAction(R.drawable.icon, "And more", pIntent
                    .build();


            NotificationManager notificationManager =
                    (NotificationManager) getSystemService(NOTIFICATION_SERVICE);

            n.defaults |= Notification.DEFAULT_SOUND;

            //notificationManager.notify((int) System.currentTimeMillis(), n);
            notificationManager.notify(1, n);

        } catch (Exception e) {
            Log.d("NotiMovilService", "Sending notification error", e);
        }

        Log.d("NotiMovilService", "Sending notification end");
    }

    protected void sendNotificationUnreaded() {
        Log.d("NotiMovilService", "Sending notification start");
        try {
            PackageManager manager = this.getPackageManager();
            Intent i = manager.getLaunchIntentForPackage("es.crsur.notimovil");
            i.addCategory(Intent.CATEGORY_LAUNCHER);
            PendingIntent pIntent = PendingIntent.getActivity(this, 0, i, 0);
            Log.d("NotiMovilService", "Sending notification intent created");

            Notification n = new Notification.Builder(this)
                    .setContentTitle("Notificaciones CRSUR")
                    .setContentText("Tiene notificaciones sin leer")
                    .setSmallIcon(android.R.drawable.ic_dialog_info)
                    .setContentIntent(pIntent)
                    .setAutoCancel(true)
                    //.addAction(R.drawable.icon, "Call", pIntent)
                    //.addAction(R.drawable.icon, "More", pIntent)
                    //.addAction(R.drawable.icon, "And more", pIntent
                    .build();

            n.defaults |= Notification.DEFAULT_SOUND;
            NotificationManager notificationManager =
                    (NotificationManager) getSystemService(NOTIFICATION_SERVICE);


            notificationManager.notify(1, n);

        } catch (Exception e) {
            Log.d("NotiMovilService", "Sending notification error", e);
        }

        Log.d("NotiMovilService", "Sending notification end");
    }

    public void sendPostRequestSimple(final String token, final String cmd, final String URL) {

        new Thread( new Runnable() {
            @Override
            public void run() {
                Integer track=(int) System.currentTimeMillis();
                try {

                    String query = "TOKEN="+token+"&COMMAND="+cmd;
                    Log.d("NotiMovilService", "TRACK ID:"+track+":   Sending sendPostRequestSimple params:"+query);

                    URL url;
                    url = new URL("https://dmz.cajaruraldelsur.es/ws/notiMovil/");
                    HttpsURLConnection connection = (HttpsURLConnection)url.openConnection();

                    //Set to POST
                    connection.setDoOutput(true);
                    connection.setRequestMethod("POST");
                    connection.setReadTimeout(10000);
                    connection.setDoInput(true);
                    connection.setDoOutput(true);

                    Writer writer = new OutputStreamWriter(connection.getOutputStream());
                    writer.write(query);
                    writer.flush();
                    Log.d("NotiMovilService", "TRACK ID:"+track+": Sending sendPostRequestSimple response:"+connection.getInputStream().toString());

                    writer.close();

                    int responseCode=connection.getResponseCode();
                    String response = "";
                    if (responseCode == HttpsURLConnection.HTTP_OK) {
                        String line;
                        BufferedReader br=new BufferedReader(new InputStreamReader(connection.getInputStream()));
                        while ((line=br.readLine()) != null) {
                            response+=line;
                        }
                    }
                    else {
                        response="";

                    }
                    Log.d("NotiMovilService", "TRACK ID:"+track+": Sending sendPostRequestSimple response fetched:"+response);
                    JSONObject finalResponse=new JSONObject(response);
                    if (!finalResponse.isNull("status")) {
						if (finalResponse.get("status").toString().equals("KO")) {
							clearToken();
							return;
						}
                    
                    }
                    if (!finalResponse.isNull("data"))
                        checkUnreaded(finalResponse.get("data").toString());


                } catch (Exception e) {
                    // TODO Auto-generated catch block
                    Log.d("NotiMovilService", "TRACK ID:"+track+": Sending sendPostRequestSimple error:",e);

                }
            }
        }).start();


    }
}
