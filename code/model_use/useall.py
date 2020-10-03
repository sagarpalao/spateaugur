#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Feb 12 16:39:27 2017

@author: sagar
"""
import os
#import requests
import ast
import pandas as pd
import json
import subprocess
import operator
import math
# import way2sms

#result = requests.get('http://api.airvisual.com/v1/nearest?lat=19.0728300&lon=72.8826100&key=yGQXyQuzsJ6nKiyC3').json()

#aqi = result['data']['current']['pollution']['aqius']
#temp = result['data']['current']['weather']['tp']
#rain = 0
#if 'pop' in result['data']['current']['weather']:
#    rain = result['data']['current']['weather']['pop']

#print(str(aqi) + " " + str(temp) + " " + str(rain))

file = open('../regions_refined')


data= {}
data['region'] = {}   
high = []
disease = ['MALARIA', 'DENGUE', 'CHICKENGUNIA', 'VIRAL_FEVER', 'FLU', 'TUBERCULOSIS', 'DIARROHEA', 'TYPHOID', 'CHOLERA', 'JAUNDICE']

for line in file:
        
    line = line[:-1]
    entity = line.split(" ")
        
    pred = {}
        
    px = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]
    
    print()
    print(entity[0])
       
    for i in range(1,len(entity)):
        
        df = pd.read_csv('../preparing_data/raw/REFINEDDATA/'+entity[i]+'.csv')
        df2 = df.tail(1)       
        df2 = df.drop(df.columns[[0,3,4,5,6,7,8,9,10,11,12]], axis=1)
        l1 = df2.values.tolist()
        
        l1[0] = [str(j) for j in l1[0]]

        print(l1[0])

        #print("fetched: ")
        #print(l1[0])
        #print()

        cmd = []
        cmd.append('python')
        name ='nn_'+entity[i]+'_use.py'
        cmd.append(name)
        #print('nn_'+entity[i]+'_use.py')
        cmd = cmd + l1[0]
        print(cmd)
        p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        out, err = p.communicate()

        print(out, err)
        #print('hi')
        #print(out)
        #print(err)
        #print(type(out))
        out = out[2:-4]
        l = out.split()
        #print('hhi')
        #print(l)
        l = [float(j.decode("utf-8")) for j in l]
        #print(l)
        px = map(operator.add, px,l)
        
    pred['prediction'] = [(math.ceil(x) * 5) for x in px ]
    
    print(pred['prediction'])
    
    for j in range(len(pred['prediction'])):
        if pred['prediction'][j] > 50:
            print('doing... Sending messages')
            x = {}
            x['region'] = entity[0]
            x['prediction'] = pred['prediction'][j]
            x['disease'] = disease[j]
            msg = 'Health Alert: Health Board has predicted outbreak of '+x['disease']+' in your locality. Safety measures and advisable.'
            high.append(x)
            # q=way2sms.sms('9167487411','D9633S')
            # q.send('9167487411',msg)
            # q.msgSentToday()
            # q.logout()
            print(high)
    
    data['region'][entity[0]] = pred
    
    

print()
print(high)
data['high'] = high
data = json.dumps(data)
print(data)

fx = open('../SpateAugurServer/prediction.json','w')
fx.write(data)
