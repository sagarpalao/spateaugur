f = open('mongointeract.py','w+')

f1 = open('regions','r')

f.write('import os\n')

for line in f1: 
    
    line = line[:-1]

    importname = line+'_refined'
    filename = line+'.csv'
    
    cmd = 'os.system(\'"C:\Program Files\MongoDB\Server\\\\3.6\\\\bin\mongoimport.exe" -d spateaugur -c '+importname+' --type csv --file '+filename+' --headerline\')'
    print(cmd)
    f.write(cmd+'\n')
    
f.close()