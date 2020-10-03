#!flask/bin/python
from flask import Flask
import os
import pandas as pd
import datetime
import math
import json
from operator import add
import csv
import requests
from pymongo import MongoClient

# -*- coding: utf-8 -*-
from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper


def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers
            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            h['Access-Control-Allow-Credentials'] = 'true'
            h['Access-Control-Allow-Headers'] = \
                "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator

app = Flask(__name__)

@app.route('/', methods=['POST'])
@crossdomain(origin='*')
def index():
    malaria = request.form.get('MALARIA')
    print(malaria)
    return 'hi we are running.'
    
@app.route('/region/history')
@crossdomain(origin='*')
def show_region_history():    
    
    file = open('../regions_refined','r')
    
    data = {}
    data['region'] = {}
    
    for line in file:
        
        line = line[:-1]
        entity = line.split(" ")
        
        robj = {}
        
        
        print(entity[0])
        filename = '../preparing_data/raw/REFINEDDATA/'+entity[1]+'.csv'
        df = pd.read_csv(filename)
        sdf = df[['MALARIA','DENGUE','CHICKENGUNIA','VIRAL_FEVER','FLU','TUBERCULOSIS','DIARROHEA','TYPHOID','CHOLERA','JAUNDICE']]
        
        for i in range(2,len(entity)):
            
            filename = '../preparing_data/raw/REFINEDDATA/'+entity[i]+'.csv'
            print(filename)
            df = pd.read_csv(filename)
            df = df[['S_D','S_M','MALARIA','DENGUE','CHICKENGUNIA','VIRAL_FEVER','FLU','TUBERCULOSIS','DIARROHEA','TYPHOID','CHOLERA','JAUNDICE']]
            df2 = df[['MALARIA','DENGUE','CHICKENGUNIA','VIRAL_FEVER','FLU','TUBERCULOSIS','DIARROHEA','TYPHOID','CHOLERA','JAUNDICE']]
            sdf = sdf + df2
            
        print(len(df['S_D'].values))
        print(len(sdf['MALARIA']))
        sdf['S_D'] = df['S_D'].values
        sdf['S_M'] = df['S_M'].values
        
        p2 =[0,0,0,0,0,0,0,0,0,0]
        w = 0
            
        history_perday = {}
        history_week = {}
        history_datapoint = {}
        malaria = {}
        dengue = {}
        chickengunia ={}
        viral_fever ={}
        flu ={}
        tuberculosis = {}
        diarrohea = {}
        typhoid ={}
        cholera ={}
        jaundice ={}
        
        j = 0
        for index, row in sdf.iterrows():
            
            print(str(int(math.ceil(row['S_M'])))+ " " +str(int(math.ceil(row['S_D']))))            
            if (j + 1) % 7 == 0:
                w = w + 1
                history_week[str(w)] = p2
                p2 =[0,0,0,0,0,0,0,0,0,0]
                
            d = datetime.datetime(2015, int(math.ceil(row['S_M'])), int(math.ceil(row['S_D'])))
            dstr = str(d)
            
            p = [row['MALARIA'],row['DENGUE'],row['CHICKENGUNIA'],row['VIRAL_FEVER'],row['FLU'],row['TUBERCULOSIS'],row['DIARROHEA'],row['TYPHOID'],row['CHOLERA'],row['JAUNDICE']]
            malaria[dstr] = row['MALARIA']
            dengue[dstr] = row['DENGUE']
            chickengunia[dstr] = row['CHICKENGUNIA']
            viral_fever[dstr] = row['VIRAL_FEVER']
            flu[dstr] = row['FLU']
            tuberculosis[dstr] = row['TUBERCULOSIS']
            diarrohea[dstr] = row['DIARROHEA']
            typhoid[dstr] = row['TYPHOID']
            cholera[dstr] = row['CHOLERA']
            jaundice[dstr] = row['JAUNDICE']
            
            history_perday[dstr] = p
            
            p2 = map(add, p2, p)
            
            history_datapoint['malaria'] = malaria
            history_datapoint['dengue'] = dengue
            history_datapoint['chickengunia'] = chickengunia
            history_datapoint['viral_fever'] = viral_fever
            history_datapoint['flu'] = flu
            history_datapoint['tuberculosis'] = tuberculosis
            history_datapoint['diarrohea'] = diarrohea
            history_datapoint['typhoid'] = typhoid
            history_datapoint['cholera'] = cholera
            history_datapoint['jaundice'] = jaundice
            j = j + 1
                              
        robj['history_per_day'] = history_perday
        robj['history_week'] = history_week
        robj['history_datapoint'] = history_datapoint
                    
        data['region'][entity[0]] = robj
        
    data = json.dumps(data)
    fx = open('../SpateAugurServer/region_history.json','w')
    fx.write(data)
    return data       
  
@app.route('/region/prediction')
@crossdomain(origin='*')
def show_region_prediction():
    f = open('prediction.json','r')
    data = json.load(f)
    data =  json.dumps(data)
    print(data)
    return data   
    
@app.route('/hospitaldata', methods=['POST'])
@crossdomain(origin='*')
def put_hospital_data():
    
    s_d = request.form.get('S_D')
    malaria = request.form.get('MALARIA')
    location = request.form.get('LOCATION')
    s_m = request.form.get('S_M')
    chickengunia = request.form.get('CHICKENGUNIA')
    viral_fever = request.form.get('VIRAL_FEVER')
    flu = request.form.get('FLU')
    tuberculosis = request.form.get('TUBERCULOSIS')
    dengue = request.form.get('DENGUE')
    diarrohea = request.form.get('DIARROHEA')
    typhoid = request.form.get('TYPHOID')
    cholera = request.form.get('CHOLERA')
    jaundice = request.form.get('JAUNDICE')
    print(s_d)
    print("hi" + malaria)
    
    result = requests.get('http://api.airvisual.com/v1/nearest?lat=19.0728300&lon=72.8826100&key=yGQXyQuzsJ6nKiyC3').json()

    aqi = result['data']['current']['pollution']['aqius']
    temp = result['data']['current']['weather']['tp']
    rain = 0
    if 'pop' in result['data']['current']['weather']:
        rain = result['data']['current']['weather']['pop']
    
    print(str(aqi) + " " + str(temp) + " " + str(rain))
    
    row = [location, s_d, s_m, malaria, dengue, chickengunia, viral_fever, flu, tuberculosis, diarrohea, typhoid, cholera, jaundice, temp, rain, aqi, '1']
    rowx = row
    print('x')
    print(row)
    bottle_list = []
    
    f = open('../regions', "r")
    
    lines = f.readlines()
    print(lines)
    f.close()
    cnt = 0
    for i in range(len(lines)):
        print(lines[i][:-1].lower() + " " + location.lower())
        if lines[i][:-1].lower() == location.lower():           
            cnt = i
            break
    cnt = cnt + 1    

    with open('../preparing_data/raw/REFINEDDATA/temp/temp.csv', 'rb') as b:
        bottles = csv.reader(b)
        bottle_list.extend(bottles)
 
    line_to_override = {cnt:row}
  
    
    with open('../preparing_data/raw/REFINEDDATA/temp/temp.csv', 'wb') as b:
        writer = csv.writer(b)
        for line, row in enumerate(bottle_list):
             data = line_to_override.get(line, row)
             writer.writerow(data)
    
    filename = '../preparing_data/raw/REFINEDDATA/'+location.lower()+'.csv'
    content = open(filename,'r')    
    linec = content.readline()
    linec = linec[:-1]
    data = linec.split(',')
    list1 = data[3:13]
    list2 = data[13:]
    
    n = len(list2) - 3
    
    rowx = rowx[:-1]
    for j in range(n):
        rowx.append(0)  
    
    with open(filename, 'ab') as fp:
        a = csv.writer(fp, delimiter=',')
        print('l')
        print(rowx)
        data = rowx
        a.writerow(data)
    
    
    client = MongoClient()
    db = client.spateaugur
    collectionname = location.lower()+'_refined'
    print(collectionname)
    
    document = db[collectionname].find_one()
    
    listaccess = document.keys()
    listremove = ['LOCALITY','S_D','_id','S_M',"MALARIA","DENGUE","CHICKENGUNIA", "VIRAL_FEVER","FLU","TUBERCULOSIS","DIARROHEA","TYPHOID","CHOLERA","JAUNDICE","TEMP_C","RAIN_MM","AQI"]
    
    listaccess = list(set(listaccess).difference(set(listremove)))
    print("List >>>>")
    print(listaccess)
    data = {
        "LOCALITY":rowx[0],
         "S_D": int(rowx[1]),
         "S_M":int(rowx[2]),
         "MALARIA":int(rowx[3]),
         "DENGUE":int(rowx[4]),
         "CHICKENGUNIA":int(rowx[5]),
         "VIRAL_FEVER":int(rowx[6]),
         "FLU":int(rowx[7]),
         "TUBERCULOSIS":int(rowx[8]),
         "DIARROHEA":int(rowx[9]),
         "TYPHOID":int(rowx[10]),
         "CHOLERA":int(rowx[11]),
         "JAUNDICE":int(rowx[12]),
         "TEMP_C":int(rowx[13]),
         "RAIN_MM":int(rowx[14]),
         "AQI":int(rowx[15])
    }
    for i in range(len(listaccess)):
        data[listaccess[i]] = 0
        
    print('Data: >>>>')
    print(data)
    
    result = db[collectionname].insert_one(data)
    print(result)
    print("Data2 >>>>>")
    print(data)
    #os.system('python ../model_retrain/trainall.py')
    #os.system('python ../model_use/useall.py')
             
    return 'done'
        
    
if __name__ == '__main__':
    app.run(host= '0.0.0.0', port=5001, debug=True)