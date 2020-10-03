#!flask/bin/python
from flask import Flask
import os
import pandas as pd
import datetime
import math
import json
from operator import add

app = Flask(__name__)

@app.route('/')
def index():
    f = open('../preparing_data/finals/final_aqi_wd.csv','r')
    data = f.read()

    f.close()
    os.system('python3 ../model_code/nn_chembur_train.py')
    return 'hi'

    
@app.route('/region/history')
def show_region_history():    
    
    file = open('../regions_refined','r')
    f2 = open('../test','a')
    data = {}
    data['region'] = []
    
    for line in file:
        
        entity = split(line, " ")
        
        robj = {}
        robj['name'] = entity[0]
        
        xhistory_perday = {}
        xhistory_week = {}
        xhistory_datapoint = {}
        xmalaria = {}
        xdengue = {}
        xchickengunia ={}
        xviral_fever ={}
        xflu ={}
        xtuberculosis = {}
        xdiarrohea = {}
        xtyphoid ={}
        xcholera ={}
        xjaundice ={}
        
        xp2= [0,0,0,0,0,0,0,0,0,0]
        
        for i in range(1,len(entity)):
            
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
            
            
            
            filename = '../preparing_data/raw/REFINEDDATA/'+entity[i]+'.csv'
            print(filename)
            df = pd.read_csv(filename)
            df = df[['S_D','S_M','MALARIA','DENGUE','CHICKENGUNIA','VIRAL_FEVER','FLU','TUBERCULOSIS','DIARROHEA','TYPHOID','CHOLERA','JAUNDICE']]
            
            p2 =[0,0,0,0,0,0,0,0,0,0]
            w = 0
            
            for index, row in df.iterrows():
                
                #print(str(int(math.ceil(row['S_M'])))+ " " +str(int(math.ceil(row['S_D']))))
                if (int(index)+1) % 7 == 0:
                    w = w + 1
                    history_week[w] = p2
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
                history_perday[dstr] = map(add, p, )
                
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
                
                
                
                
                
        robj['history_per_day'] = history_perday
        robj['history_week'] = history_week
        robj['history_datapoint'] = history_datapoint
                    
        data['region'].append(robj)
        f2.write(str(data))
        f2.write("\n\n")
        
    return json.dumps(data)        
        
    
    
if __name__ == '__main__':
    app.run(host= '0.0.0.0', port=5001, debug=True)