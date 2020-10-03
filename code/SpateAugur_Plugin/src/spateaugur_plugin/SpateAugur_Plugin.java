
package spateaugur_plugin;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.Reader;
import java.sql.*;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Scanner;
import java.util.Timer;
import java.util.TimerTask;
import javax.swing.JOptionPane;
import java.net.*;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.ws.rs.core.*;
import javax.ws.rs.client.*;

/**
 *
 * @author Sagar Palo
 */

public class SpateAugur_Plugin extends TimerTask{
    
    String data = new String();
    public static final String DOMAIN = "http://127.0.0.1:5001/hospitaldata";
    public static final String IP = "127.0.0.1:5001";
    public static final String FILENAME = "E:/SpateAugur_Configuration/configuration_file.txt";
    private final static long ONCE_PER_DAY = 1000*60*60*24;
    private final static int TWO_AM = 0;
    private final static int ZERO_MINUTES = 0;
    
    @Override
    public void run() {
        
        try{
            File file = new File(FILENAME);
            
            StringBuilder fileContents = new StringBuilder((int)file.length());
            Scanner scanner = new Scanner(file);
            String lineSeparator = System.getProperty("line.separator");
            
            try {
                while(scanner.hasNextLine()) {
                    fileContents.append(scanner.nextLine());
                }
                data = fileContents.toString();
            } finally {
                scanner.close();
            }
        }
        catch(Exception e){
            e.printStackTrace();
        }
        System.out.println(data);       
        String[] data2 = data.split(",");
        //System.out.println(data2[7]);
        String hospital="", locality="", ip="", dbname="", port="", usrid="", pass = "";
        int index=2;
        System.out.println(data2.length);
        if(data2.length == 8){
            hospital=data2[0];
            locality=data2[1];
            ip=data2[3];
            dbname=data2[5];
            port=data2[4];
            usrid=data2[6];
            pass = data2[7];
            index=Integer.parseInt(data2[2]);
        }
        else if(data2.length == 7){
            hospital=data2[0];
            locality=data2[1];
            ip=data2[3];
            dbname=data2[5];
            port=data2[4];
            usrid=data2[6];
            pass = "";
            index=Integer.parseInt(data2[2]);
        }
        
            String USER = usrid;
            String PASS = pass;
            Connection conn = null;
            System.out.println(pass);
            switch(index){
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                    try {
                        
                        int[] disease_cnt = {0,0,0,0,0,0,0,0,0,0};
                        String[] disease = {"MALARIA","DENGUE","CHICKENGUNIA","VIRAL_FEVER","FLU","TUBERCULOSIS","DIARROHEA","TYPHOID","CHOLERA","JAUNDICE"};
                        String JDBC_DRIVER = "com.mysql.jdbc.Driver";  
                        String DB_URL = "jdbc:mysql://"+ip+":"+port+"/"+dbname;
                        Class.forName(JDBC_DRIVER);
                        System.out.println("Connecting to a selected database...");
                        conn = DriverManager.getConnection(DB_URL, USER, PASS);
                        System.out.println("Connected database successfully...");
                        
                        PreparedStatement s = conn.prepareStatement("select disease, count(*) from patient_data where s_d = ? and s_m = ? and s_y = ? group by disease;");
                        Date d = new Date((new Date().getTime() - 24*3600*1000));
                        System.out.println((d.getYear()+1900) + " " + d.getDate() + " " + (d.getMonth() + 1));
                        s.setInt(1, d.getDate());
                        s.setInt(2, d.getMonth() + 1);
                        s.setInt(3, d.getYear() + 1900);
                        ResultSet r = s.executeQuery();

                        while(r.next()){
                            System.out.println(r.getString(1) + " " + r.getString(2));
                            if(r.getString(1).equalsIgnoreCase("MALARIA")){
                                disease_cnt[0] = Integer.parseInt(r.getString(2));
                            }else if(r.getString(1).equalsIgnoreCase("DENGUE")){
                                disease_cnt[1] = Integer.parseInt(r.getString(2));
                            }else if(r.getString(1).equalsIgnoreCase("CHICKENGUNIA")){
                                disease_cnt[2] = Integer.parseInt(r.getString(2));
                            }else if(r.getString(1).equalsIgnoreCase("VIRAL_FEVER")){
                                disease_cnt[3] = Integer.parseInt(r.getString(2));
                            }else if(r.getString(1).equalsIgnoreCase("FLU")){
                                disease_cnt[4] = Integer.parseInt(r.getString(2));
                            }else if(r.getString(1).equalsIgnoreCase("TUBERCULOSIS")){
                                disease_cnt[5] = Integer.parseInt(r.getString(2));
                            }else if(r.getString(1).equalsIgnoreCase("DIARROHEA")){
                                disease_cnt[6] = Integer.parseInt(r.getString(2));
                            }else if(r.getString(1).equalsIgnoreCase("TYPHOID")){
                                disease_cnt[7] = Integer.parseInt(r.getString(2));
                            }else if(r.getString(1).equalsIgnoreCase("CHOLERA")){
                                disease_cnt[8] = Integer.parseInt(r.getString(2));
                            }else if(r.getString(1).equalsIgnoreCase("JAUNDICE")){
                                disease_cnt[9] = Integer.parseInt(r.getString(2));
                            }
                        }
                        
                        Map<String,Object> params = new LinkedHashMap<>();
                        params.put("LOCATION",locality );
                        params.put("S_D", String.valueOf(d.getDate()));
                        params.put("S_M", String.valueOf(d.getMonth() + 1));
                        params.put("MALARIA", String.valueOf(disease_cnt[0]));
                        params.put("DENGUE", String.valueOf(disease_cnt[1]));
                        params.put("CHICKENGUNIA", String.valueOf(disease_cnt[2]));
                        params.put("VIRAL_FEVER", String.valueOf(disease_cnt[3]));
                        params.put("FLU", String.valueOf(disease_cnt[4]));
                        params.put("TUBERCULOSIS", String.valueOf(disease_cnt[5]));
                        params.put("DIARROHEA", String.valueOf(disease_cnt[6]));
                        params.put("TYPHOID", String.valueOf(disease_cnt[7]));
                        params.put("CHOLERA", String.valueOf(disease_cnt[8]));
                        params.put("JAUNDICE", String.valueOf(disease_cnt[9]));

                        URL url = new URL("http://127.0.0.1:5001/hospitaldata");                            
                        StringBuilder postData = new StringBuilder();
                        for (Map.Entry<String,Object> param : params.entrySet()) {
                            if (postData.length() != 0) postData.append('&');
                            postData.append(URLEncoder.encode(param.getKey(), "UTF-8"));
                            postData.append('=');
                            postData.append(URLEncoder.encode(String.valueOf(param.getValue()), "UTF-8"));
                        }
                        byte[] postDataBytes = postData.toString().getBytes("UTF-8");

                        HttpURLConnection connection = (HttpURLConnection)url.openConnection();
                        connection.setRequestMethod("POST");
                        connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
                        connection.setRequestProperty("Content-Length", String.valueOf(postDataBytes.length));
                        connection.setDoOutput(true);
                        connection.getOutputStream().write(postDataBytes);

                        Reader in = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));

                        for (int c; (c = in.read()) >= 0;)
                            System.out.print((char)c);
                
                    }
                    catch (SQLException ex) {
                        // handle any errors
                        System.out.println("SQLException: " + ex.getMessage());
                        System.out.println("SQLState: " + ex.getSQLState());
                        System.out.println("VendorError: " + ex.getErrorCode());
                    }
                    catch(ClassNotFoundException ex){
                        System.out.println(ex.getMessage());
                    }
                    catch(Exception e){
                        e.printStackTrace();
                    }
                    break;
                case 3:
                    System.out.println("here");
                    try{
                    int[] disease_cnt = {0,0,0,0,0,0,0,0,0,0};
                    String[] disease = {"MALARIA","DENGUE","CHICKENGUNIA","VIRAL_FEVER","FLU","TUBERCULOSIS","DIARROHEA","TYPHOID","CHOLERA","JAUNDICE"};
                    String database = "jdbc:ucanaccess://E:/Hospitaldatabase/hospitaldata.accdb";
                    conn = DriverManager.getConnection(database); 
                    System.out.println("Connected database successfully...");

                    PreparedStatement s = conn.prepareStatement("select disease, count(*) from patient_data where s_d = ? and s_m = ? and s_y = ? group by disease;");
                    java.util.Date d = new java.util.Date((new java.util.Date().getTime() - 24*3600*1000));
                    System.out.println((d.getYear()+1900) + " " + d.getDate() + " " + (d.getMonth() + 1));
                    s.setInt(1, d.getDate());
                    s.setInt(2, d.getMonth() + 1);
                    s.setInt(3, d.getYear() + 1900);
                    ResultSet r = s.executeQuery();

                    while(r.next()){
                        System.out.println(r.getString(1) + " " + r.getString(2));
                        if(r.getString(1).equalsIgnoreCase("MALARIA")){
                            disease_cnt[0] = Integer.parseInt(r.getString(2));
                        }else if(r.getString(1).equalsIgnoreCase("DENGUE")){
                            disease_cnt[1] = Integer.parseInt(r.getString(2));
                        }else if(r.getString(1).equalsIgnoreCase("CHICKENGUNIA")){
                            disease_cnt[2] = Integer.parseInt(r.getString(2));
                        }else if(r.getString(1).equalsIgnoreCase("VIRAL_FEVER")){
                            disease_cnt[3] = Integer.parseInt(r.getString(2));
                        }else if(r.getString(1).equalsIgnoreCase("FLU")){
                            disease_cnt[4] = Integer.parseInt(r.getString(2));
                        }else if(r.getString(1).equalsIgnoreCase("TUBERCULOSIS")){
                            disease_cnt[5] = Integer.parseInt(r.getString(2));
                        }else if(r.getString(1).equalsIgnoreCase("DIARROHEA")){
                            disease_cnt[6] = Integer.parseInt(r.getString(2));
                        }else if(r.getString(1).equalsIgnoreCase("TYPHOID")){
                            disease_cnt[7] = Integer.parseInt(r.getString(2));
                        }else if(r.getString(1).equalsIgnoreCase("CHOLERA")){
                            disease_cnt[8] = Integer.parseInt(r.getString(2));
                        }else if(r.getString(1).equalsIgnoreCase("JAUNDICE")){
                            disease_cnt[9] = Integer.parseInt(r.getString(2));
                        }
                    }

                    System.out.println(disease_cnt[0]);
                    Map<String,Object> params = new LinkedHashMap<>();
                    params.put("LOCATION",locality );
                    params.put("S_D", String.valueOf(d.getDate()));
                    params.put("S_M", String.valueOf(d.getMonth() + 1));
                    params.put("MALARIA", String.valueOf(disease_cnt[0]));
                    params.put("DENGUE", String.valueOf(disease_cnt[1]));
                    params.put("CHICKENGUNIA", String.valueOf(disease_cnt[2]));
                    params.put("VIRAL_FEVER", String.valueOf(disease_cnt[3]));
                    params.put("FLU", String.valueOf(disease_cnt[4]));
                    params.put("TUBERCULOSIS", String.valueOf(disease_cnt[5]));
                    params.put("DIARROHEA", String.valueOf(disease_cnt[6]));
                    params.put("TYPHOID", String.valueOf(disease_cnt[7]));
                    params.put("CHOLERA", String.valueOf(disease_cnt[8]));
                    params.put("JAUNDICE", String.valueOf(disease_cnt[9]));

                    URL url = new URL(DOMAIN);                            
                    StringBuilder postData = new StringBuilder();
                    for (Map.Entry<String,Object> param : params.entrySet()) {
                        if (postData.length() != 0) postData.append('&');
                        postData.append(URLEncoder.encode(param.getKey(), "UTF-8"));
                        postData.append('=');
                        postData.append(URLEncoder.encode(String.valueOf(param.getValue()), "UTF-8"));
                    }
                    byte[] postDataBytes = postData.toString().getBytes("UTF-8");

                    HttpURLConnection connection = (HttpURLConnection)url.openConnection();
                    connection.setRequestMethod("POST");
                    connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
                    connection.setRequestProperty("Content-Length", String.valueOf(postDataBytes.length));
                    connection.setDoOutput(true);
                    connection.getOutputStream().write(postDataBytes);

                    Reader in = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));

                    for (int c; (c = in.read()) >= 0;)
                        System.out.print((char)c);

                    }
                    catch (SQLException ex) {
                        // handle any errors
                        System.out.println("SQLException: " + ex.getMessage());
                        System.out.println("SQLState: " + ex.getSQLState());
                        System.out.println("VendorError: " + ex.getErrorCode());
                    }
                    catch(Exception e){
                        e.printStackTrace();
                    }
                    break;
                          
            }
          
    }
    private static Date getTomorrowMorning12AM(){

        Date date2am = new java.util.Date(); 
        date2am.setHours(19); 
        date2am.setMinutes(29); 
        return date2am;
    }
    
    public static void startTask(){
        SpateAugur_Plugin task = new SpateAugur_Plugin();
        Timer timer = new Timer();  
        timer.schedule(task,getTomorrowMorning12AM(),ONCE_PER_DAY);// for your case u need to give 1000*60*60*24
    }
    public static void main(String args[]){
        startTask();
    }
    
}
