# SpateAugur

## What’s the current state?
* The concept of Smart India, Digital India is currently soaring.
* But very less focus is given to: Public Health - in terms of Disease Prediction, Prevention & Control.
* In India the punch of ubiquity and pervasive computing in HealthCare is not that hard.
* Statistics - Mumbai Health Report 2015
    * 7650 people in Mumbai died because of common diseases in the year 2015.
    * 30% of the total death population in Mumbai die due to common diseases or epidemic hit.
    
    <i> Courtesy: Mumbai Health Report | International Workshop on Climate Change Vulnerability Assessment and Urban Development Planning for Asian Coastal Cities </i>

<hr/>

## What is SpateAugur ?
* SpateAugur is an informative health eco-system which is used for predicting epidemics and diseases.
* This eco-system will predict,
    * What is the probability of a disease/epidemic to outbreak in a region.
    * What are the numbers of people who will get inflected by the disease.
* Such predictions act as an alarm for health control boards to take appropriate decision.

<hr/>

## What Can it do? 

### Epidemic Outbreak Prediction  
The key functional requirement of SpateAugur is it should predict epidemic/disease outbreak in different region of city. The prediction should come as:
* Which region of a city is to be infected by epidemic and which epidemic?
* What is the probability that the disease will outbreak in the region?
* What are the expected number of people to be infected by the disease in that region?
* The epidemic is prioritized based on its impact in the city and the health officials are notified and so they can maintain constant surveillance.

### Visualization  
The system gives the health official the visualization of the spread of disease. The visualization has the following requirements.
* Timeline: The system displays the timeline which defines the flow of spread of disease from region to region in the city. This visualization helps the official to determine the nature of spread of each disease.
* Disease Heat Map: It defines heat map of how the infectious the disease is in a region in form of a heat map.
* Prediction Heat Map: It defines how latent is it for a disease to outbreak in a region in form of a heat map.

### Fetch Dynamic Data  
The system is a self-learning and ever learning model. To learn it needs dynamic and periodic data. It fetches this data from various sources. Data is the pivotal mean for the model to learn. It fetches data as,
* Plugin: A plugin is a part of SpateAugur software which collects data from the health center, hospitals and dispensaries. The plugin can read data from multiple form of databases including support for Oracle, MS-Access, MS SQL Server.
* API: A set of APIs are used to collect data such as Sewage Network (offered by MCGM), Weather network (offered by CPCB), Transport frequency (offered by TISS) and Air Flow network (offered by CPCB).

### Public Notifications  
* When a disease is predicted to be outbreak in a region, SpateAugur notifies the users in the region to take precautionary measures. For example, If it is predicted Cholera to spread in a regions. The users will be notified as: ‘Please drink safe water, boiled water or purified water. Don’t eat street food for a while. The health officials has predicted an outbreak of cholera in your area.’ 
* This notification will be send to the users by mean of SMS/Push Notifications, so that all grade of public in the region are notified and are ready to fight back the epidemic.

<hr/>

## How:

### Data Collection Unit
It is responsible to collect data in real time. Primarily two set of data is collected. It includes:
1) Data from Health Agencies, Hospitals and dispensaries of the patient:   
Data key ingredients are: 
    * Region of the patient
    * Detected diseases
    * Timestamp when patient enrolled and when patient was discharged.
2) Data about the Disease Spread Network
    * Sewage Network form MCGM
    * Air Network form CPCB
    * Human Contact Network from TISS
    * Weather Condition from CPCB

The collected data is processed to make it suitable for stage B.

### Deep RNN (Recurrent Neural Network)
This is the model which learns about the historic evidence of disease spreads and from current situation to make prediction of spread of disease.

To train and make the Deep RNN periodically learn we need to provide it 3 inputs:
1) Data from hospitals: which is the input to the Deep RNN.
2) Three networks: Sewage Network, Air Network and the Human Contact Network are weighted as per their impact. For e.g. Sewage network weights is in terms of the number of drainage, open/close drainage and WQI of the sewage constitutes to its weight.
3) Health statistics: from NGOs constitute for the bias weight in the RNN.

The RNN is constructed as a deep network which trains itself periodically as well as from past history records.

### Visualization & Public Notification
By means of diverse visualization we make the health control board understand the situation of diseases and its spread probability to different regions. The public in the region where outbreak can occur are notified by Push Notifications/SMS.

<hr/>

## Benefits:
* General Public
* Health Officials
* Hospitals
* Reduction in Mortality Rate

