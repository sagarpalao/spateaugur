function getColorBids(e){return 0>=e?"#757780":7>=e?"#2ec4b6":15>=e?"#ff9f1c":23>=e?"#F7B32B":31>=e?"#F55D3E":39>=e?"#C81D25":void 0}function getBidsPercent(e){return 0>=e?0:void 0===e?0:e}function highlightFeature(e){var a=e.target;a.setStyle({weight:2,color:"#666",dashArray:"",fillOpacity:1}),L.Browser.ie||L.Browser.opera||L.Browser.edge||a.bringToFront(),info.update(a.feature.properties)}function resetHighlight(e){mapLayer.resetStyle(e.target),info.update()}function zoomToFeature(e){map.fitBounds(e.target.getBounds())}function onEachFeature(e,a){a.on({mouseover:highlightFeature,mouseout:resetHighlight,click:zoomToFeature})}function mapBidStyles(e){return{fillColor:getColorBids(e.properties.estimatedvalue),weight:2,opacity:1,color:"#00011627",dashArray:3,fillOpacity:.7}}function loadthegraph(){for(var e=datag.features,a=0;a<e.length;a++)if(r=regions[a].toLowerCase(),dataj.region.hasOwnProperty(r)){var t=dataj.region[r].history_week[String(week)][parseInt(dname)];datag.features[a].properties.estimatedvalue=t}mapLayer=L.geoJson(datag,{style:mapBidStyles,onEachFeature:onEachFeature}).addTo(map)}function a1(){return $.getJSON(historyLocalJSON,{},function(e){dataj=e,dname="0",regName=$("#region-select").find(":selected").text().toLowerCase(),diName=$("#disease-select").find(":selected").text().toLowerCase(),$(".diseasespan").html($("#disease-select").find(":selected").text())})}function a2(){return $.getJSON("data/mumbaigeo.json",{},function(e){datag=e})}function a3(){return $.getJSON("data/visualizeaccuracy.json",{},function(e){data=e,dnamenum=0,regName=$("#region-select").find(":selected").text().toLowerCase(),diName=$("#disease-select").find(":selected").text().toLowerCase(),$(".diseasespan").html($("#disease-select").find(":selected").text())})}function runSlider(){"start"===playing_status&&(week!==reqWeek?($("#timeline-seekbar").val(week),loadthegraph(),$(".week-indicator").text(week+" Week"),week++):($(".play-button p").text("▶"),playing_status="stop",week=1,$("#timeline-seekbar").val(week),loadthegraph()))}function loadtheotherchart(){function e(){var e=new google.visualization.DataTable;e.addColumn("date","Date"),e.addColumn("number","Count Actual for Disease"),e.addColumn("number","Count Predicted for Disease"),e.addRows(arr);var a={title:"Malaria",hAxis:{title:"Year",titleTextStyle:{color:"#333"}},vAxis:{minValue:0}},t=new google.visualization.LineChart(document.getElementById("chart_acc_div"));t.draw(e,a)}var a=data.region[regName];arr2=[];for(var t in a)a.hasOwnProperty(t)&&arr2.push(t);arr2.sort(function(e,a){return new Date(e).getTime()-new Date(a).getTime()}),arr=[];for(var r=0;r<arr2.length;r++)a.hasOwnProperty(arr2[r])&&arr.push([new Date(arr2[r]),a[arr2[r]][0][dnamenum]>0?a[arr2[r]][0][dnamenum]:0,a[arr2[r]][1][dnamenum]>0?a[arr2[r]][1][dnamenum]:0]);console.log(arr),google.charts.load("current",{packages:["corechart"]}),google.charts.setOnLoadCallback(e)}function loadthechart(){function e(){var e=new google.visualization.DataTable;e.addColumn("date","Date"),e.addColumn("number","Count"),e.addRows(arr);var a={title:"Disease Chart",hAxis:{title:"Year",titleTextStyle:{color:"#333"}},vAxis:{minValue:0}},t=new google.visualization.AreaChart(document.getElementById("chart_div"));t.draw(e,a)}var a=dataj.region[regName].history_datapoint[diName];arr2=[];for(var t in a)a.hasOwnProperty(t)&&arr2.push(t);arr2.sort(function(e,a){return new Date(e).getTime()-new Date(a).getTime()}),arr=[];for(var r=0;r<arr2.length;r++)a.hasOwnProperty(arr2[r])&&arr.push([new Date(arr2[r]),a[arr2[r]]]);console.log(arr),google.charts.load("current",{packages:["corechart"]}),google.charts.setOnLoadCallback(e)}var arr=[],regions=["Dahisar","Borivali","Kandivali","Malad","Goregaon","Mulund","Jogeshwari","Vile_Parle","Kanjurmarg","Ghatkopar","Kurla","BKC","Bandra","Chembur","Mankhurd","Wadala","Dadar","Sewree","Parel","Lower_Parel","Nagpada","Malabar_Hill","Buleshwar","Wadi","Colaba"],dataj,datag,data,dname,dnamenum,regName,diName,week=1,playing_status="start",reqWeek=52,mapLayer,mapFlat="https://api.mapbox.com/styles/v1/sidddgh/cizmr3k6j00532rpl9yhd926f/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2lkZGRnaCIsImEiOiJjaXl0MGkxZGgwMDFkMzJvNXQzdmYyMHUyIn0.x3U92aG_TUU_ffN5F6_46g",mapDark="https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2lkZGRnaCIsImEiOiJjaXl0MGkxZGgwMDFkMzJvNXQzdmYyMHUyIn0.x3U92aG_TUU_ffN5F6_46g",historyLocalJSON="data/regionhistory.json",historyOnlineJSON="http://192.168.43.63:5001/region/history";$(".week-indicator").text(week+" Week");var map=L.map("map-display",{center:[19.076,72.8777],zoom:11,minZoom:2,maxZoom:18});mapLink='<a href="http://openstreetmap.org">OpenStreetMap</a>',L.tileLayer(mapFlat,{attribution:"Map data &copy; "+mapLink,maxZoom:18}).addTo(map);var info=L.control();info.onAdd=function(e){return this._div=L.DomUtil.create("div","info"),this.update(),this._div},info.update=function(e){this._div.innerHTML="<h4>Disease Predition Rate</h4>"+(e?"<b>"+regions[e.gid]+"</b><br />"+getBidsPercent(e.estimatedvalue)+" people ":"Hover over highlighted places for more info")},info.addTo(map),$("#disease-select").change(function(){dname=$("#disease-select").val(),diName=$("#disease-select").find(":selected").text().toLowerCase(),dnamenum=$("#disease-select").val(),map.removeLayer(datag),week=1,loadthegraph(),loadthechart(),loadtheotherchart(),$(".diseasespan").html($("#disease-select").find(":selected").text())}),$("#region-select").change(function(){regName=$("#region-select").find(":selected").text().toLowerCase(),loadthechart(),loadtheotherchart()}),$.when(a1(),a2(),a3()).done(function(){loadthegraph(),loadthechart()}),$("#timeline-seekbar").on("change mousedown",function(){week=$(this).val(),loadthegraph(),$(".week-indicator").text(week+" Week")}),$(".play-button p").click(function(){switch($(this).text()){case"▶":$(".play-button p").text("⚫"),"start"===playing_status?(week=1,setInterval(function(){runSlider()},500)):(playing_status="start",runSlider());break;case"⚫":$(".play-button p").text("▶"),"stop"===playing_status?(playing_status="start",runSlider()):playing_status="stop"}});