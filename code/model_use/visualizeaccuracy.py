#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Feb 12 16:39:27 2017

@author: sagar
"""
import os
#import requests
import pandas as pd
import json
import subprocess
import operator
import math
import datetime

file = open('../regions_refined')


data= {}
data['region'] = {}   
high = []
disease = ['MALARIA', 'DENGUE', 'CHICKENGUNIA', 'VIRAL_FEVER', 'FLU', 'TUBERCULOSIS', 'DIARROHEA', 'TYPHOID', 'CHOLERA', 'JAUNDICE']

for line in file:
        
    line = line[:-1]
    entity = line.split(" ")
       
    px = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]
    cx = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]
    
    print(entity[0])
    tup = {}
    
    for m in range(0,182):
        
        px = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]
        cx = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]
        df3 = [0,0]
        
        for i in range(1,len(entity)):
            
            df = pd.read_csv('../preparing_data/raw/REFINEDDATA/'+entity[i]+'.csv')
            df2 = df.iloc[[m]]      
            df2 = df2.drop(df.columns[[0,3,4,5,6,7,8,9,10,11,12]], axis=1)
            
            df3 = df.iloc[[m]]
            df3 = df3[[1,2]].values.tolist()[0]
            
            df1 = df.iloc[[m]]
            df1 = df1[[3,4,5,6,7,8,9,10,11,12]]
                            
            l1 = df2.values.tolist()
            l1[0] = [str(j) for j in l1[0]]
            cmd = []
            cmd.append('python3')
            name ='nn_'+entity[i]+'_use.py'
            cmd.append(name)
            #print('nn_'+entity[i]+'_use.py')
            cmd = cmd + l1[0]
            #print(cmd)
            p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            out, err = p.communicate()
            #print('hi')
            #print(out)
            out = out[2:-4]
            l = out.split()
            #print('hhi')
            #print(l)
            l = [float(j) for j in l]
            px = map(operator.add, px,l)
            #print(cx)
            #print(df1.values.tolist()[0])
            cx = map(operator.add, cx,df1.values.tolist()[0])
           
        temp = [px,cx]
        d = datetime.datetime(2016, int(math.ceil(df3[1])), int(math.ceil(df3[0])))
        dstr = str(d)
        tup[dstr] = temp
        
    data['region'][entity[0]] = tup  

data = json.dumps(data)
print(data)

fx = open('../SpateAugurServer/visualizeaccuracy.json','w')
fx.write(data)
