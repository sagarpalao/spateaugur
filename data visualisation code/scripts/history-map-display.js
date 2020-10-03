

var arr = [];
var regions = ['Dahisar','Borivali','Kandivali',
'Malad','Goregaon','Mulund','Jogeshwari','Vile_Parle',
'Kanjurmarg','Ghatkopar','Kurla','BKC','Bandra','Chembur',
'Mankhurd','Wadala','Dadar','Sewree','Parel','Lower_Parel',
'Nagpada','Malabar_Hill','Buleshwar','Wadi','Colaba'];

var dataj;
var datag;
var data;
var dname;
var dnamenum;
var regName,diName;
var week = 1;
var playing_status = "start";
var reqWeek = 52;
var mapLayer;
var mapFlat = "https://api.mapbox.com/styles/v1/sidddgh/cizmr3k6j00532rpl9yhd926f/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2lkZGRnaCIsImEiOiJjaXl0MGkxZGgwMDFkMzJvNXQzdmYyMHUyIn0.x3U92aG_TUU_ffN5F6_46g";
var mapDark = "https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2lkZGRnaCIsImEiOiJjaXl0MGkxZGgwMDFkMzJvNXQzdmYyMHUyIn0.x3U92aG_TUU_ffN5F6_46g";
var historyLocalJSON = "data/regionhistory.json";
var historyOnlineJSON = "http://192.168.43.63:5001/region/history";


/*
1st green = #2ec4b6
2nd yellow = #ff9f1c
3rd Orange = #FF5A5F
4th Dark Orange = #F55D3E
5th Dark red  = #C81D25
*/

$(".week-indicator").text(week+" Week");

  function getColorBids(disease_value){
    if (disease_value <= 0) {
      return "#757780";
    }else if (disease_value <= 7 ) {
      return "#2ec4b6";
    }else if (disease_value <= 15) {
      return "#ff9f1c";
    }else if (disease_value <= 23) {
      return "#F7B32B";
    }else if (disease_value <= 31) {
      return "#F55D3E";
    }else if (disease_value <= 39) {
      return "#C81D25";
    }
  }

  function getBidsPercent(disease_value){
    if (disease_value <= 0) {
      return 0;
    }else if (disease_value === undefined) {
      return 0;
    }else {
      return disease_value;
    }
  }

  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 1
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
  }

  function resetHighlight(e) {
  mapLayer.resetStyle(e.target);
  info.update();
  }


  function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
  }

  function onEachFeature(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
  });
  }

  function mapBidStyles(feature){
    return{
      fillColor: getColorBids(feature.properties.estimatedvalue),
      weight: 2,
      opacity: 1,
      color: '#00011627',
      dashArray: 3,
      fillOpacity: 0.7
    }
  }


  var map = L.map('map-display',{
      center : [19.0760,72.8777],
      zoom : 11,
      minZoom : 2,
      maxZoom : 18
    });

    mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
    L.tileLayer(
      mapFlat, {
       attribution: 'Map data &copy; ' + mapLink,
       maxZoom: 18,
      }).addTo(map);

function loadthegraph() {

  var obj = datag['features']
            //console.log(obj.length)
  for (var i = 0; i < obj.length; i++) {

  r = regions[i].toLowerCase();
                  //console.log(r);

    if (dataj['region'].hasOwnProperty(r)) {
        var o = dataj['region'][r]['history_week'][String(week)][parseInt(dname)];
        datag['features'][i]['properties']['estimatedvalue'] = o;
    }
                    //console.log(i);

  }

  mapLayer =  L.geoJson(
      datag,
      {
        style: mapBidStyles,
        onEachFeature: onEachFeature
      }).addTo(map);
}

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Disease Predition Rate</h4>' +  (props ?
        '<b>' + regions[props.gid] + '</b><br />' + getBidsPercent(props.estimatedvalue) + ' people '
        : 'Hover over highlighted places for more info');
};

info.addTo(map);


$('#disease-select').change(function(){
    dname = $('#disease-select').val();
    diName = $('#disease-select').find(":selected").text().toLowerCase();
    dnamenum = $('#disease-select').val();
    map.removeLayer(datag);
    week = 1;
    loadthegraph();
    loadthechart();
    loadtheotherchart();
    $(".diseasespan").html($('#disease-select').find(":selected").text());
});


$('#region-select').change(function(){
    regName = $('#region-select').find(":selected").text().toLowerCase();
    loadthechart();
    loadtheotherchart();
});


function a1(){
return $.getJSON(historyLocalJSON,{}, function(d) {
dataj = d;
dname = '0';
regName = $('#region-select').find(":selected").text().toLowerCase();
diName = $('#disease-select').find(":selected").text().toLowerCase();
$(".diseasespan").html($('#disease-select').find(":selected").text());
});
}

function a2(){
return $.getJSON('data/mumbaigeo.json',{}, function(d) {
datag = d;
});
}

function a3(){
  return $.getJSON('data/visualizeaccuracy.json',{}, function(d) {
    data = d;
    dnamenum = 0;
    regName = $('#region-select').find(":selected").text().toLowerCase();
    diName = $('#disease-select').find(":selected").text().toLowerCase();
    $(".diseasespan").html($('#disease-select').find(":selected").text());
});
}

$.when(a1(), a2(), a3()).done(function(){
    loadthegraph();
    //loadtheotherchart();
    loadthechart();
});

var dmap ['MALARIA', 'DENGUE', 'CHICKENGUNIA', 'VIRAL_FEVER', 'FLU',
'TUBERCULOSIS', 'DIARROHEA', 'TYPHOID', 'CHOLERA',
'JAUNDICE'];

  $('#timeline-seekbar').on("change mousedown", function() {
      week = $(this).val();
      loadthegraph();
      $(".week-indicator").text(week+" Week");
  });

function runSlider() {

  if (playing_status === "start" ) {

    if (week !== reqWeek) {
      //console.log(week);
      $("#timeline-seekbar").val(week);
      loadthegraph();
      $(".week-indicator").text(week+" Week");
      week++;
    }else{
      $('.play-button p').text('▶');
      playing_status = "stop";
      week = 1;
      $("#timeline-seekbar").val(week);
      loadthegraph();
    }
  }

}

  $('.play-button p').click(function(){
    switch ($(this).text()) {
      case "▶":
        $('.play-button p').text('⚫');
        if (playing_status === "start") {
          week = 1;
          setInterval(function(){

            runSlider();

          },500);
        }else{
          playing_status = "start";
          runSlider();
        }
          //console.log(playing_status);

        break;
      case "⚫":
        $('.play-button p').text('▶');
        if (playing_status === "stop") {
          playing_status = "start";
          runSlider();
        }else{
          playing_status = "stop";
        }
        break;
      default:

    }
  });


  function loadtheotherchart(){

    var obj = data['region'][regName];
    arr2 = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            arr2.push(key);
        }
    };
    arr2.sort(function(a,b) {
        return new Date(a).getTime() - new Date(b).getTime()
    });
    arr = []
    for (var i = 0; i < arr2.length; i++) {
        if (obj.hasOwnProperty(arr2[i])) {
            arr.push([new Date(arr2[i]),((obj[arr2[i]][0][dnamenum] > 0 ) ? obj[arr2[i]][0][dnamenum] : 0) ,((obj[arr2[i]][1][dnamenum] > 0) ? obj[arr2[i]][1][dnamenum] : 0) ]);
        }
    }

    console.log(arr);

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      var data = new google.visualization.DataTable();
      data.addColumn('date', 'Date');
      data.addColumn('number', 'Count Actual for Disease');
      data.addColumn('number', 'Count Predicted for Disease')
      data.addRows(arr);


      var options = {
        title: 'Accuracy Chart',
        hAxis: {title: 'Year',  titleTextStyle: {color: '#333'}},
        vAxis: {minValue: 0}
      };

      var chart = new google.visualization.LineChart(document.getElementById('chart_acc_div'));
      chart.draw(data, options);
    }
  }

  function loadthechart(){
            var obj = dataj['region'][regName]['history_datapoint'][diName];
            arr2 = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    arr2.push(key);
                }
            };
            arr2.sort(function(a,b) {
                return new Date(a).getTime() - new Date(b).getTime()
            });
            arr = []
            for (var i = 0; i < arr2.length; i++) {
                if (obj.hasOwnProperty(arr2[i])) {
                    arr.push([new Date(arr2[i]),obj[arr2[i]]]);
                }
            }

            console.log(arr);

            google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
              var data = new google.visualization.DataTable();
              data.addColumn('date', 'Date');
              data.addColumn('number', 'Count');
              data.addRows(arr);


              var options = {
                title: 'Disease Chart',
                hAxis: {title: 'Year',  titleTextStyle: {color: '#333'}},
                vAxis: {minValue: 0}
              };

              var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
              chart.draw(data, options);
            }
          }
