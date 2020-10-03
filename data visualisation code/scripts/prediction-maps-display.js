
var dataj;
var datag;
var dname;
var regName,diName;
var mapLayer;
var mapFlat = "https://api.mapbox.com/styles/v1/sidddgh/cizmr3k6j00532rpl9yhd926f/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2lkZGRnaCIsImEiOiJjaXl0MGkxZGgwMDFkMzJvNXQzdmYyMHUyIn0.x3U92aG_TUU_ffN5F6_46g";
var mapDark = "https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2lkZGRnaCIsImEiOiJjaXl0MGkxZGgwMDFkMzJvNXQzdmYyMHUyIn0.x3U92aG_TUU_ffN5F6_46g";
var predictionLocalJSON = "data/prediction.json";
var predictionOnlineJSON = "http://192.168.43.63:5001/region/prediction";

var regions = ['Dahisar','Borivali','Kandivali',
'Malad','Goregaon','Mulund','Jogeshwari','Vile_Parle',
'Kanjurmarg','Ghatkopar','Kurla','BKC','Bandra','Chembur',
'Mankhurd','Wadala','Dadar','Sewree','Parel','Lower_Parel',
'Nagpada','Malabar_Hill','Buleshwar','Wadi','Colaba'];


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
      color: 'white',
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


    function a1(){
    return $.getJSON(predictionLocalJSON,{}, function(d) {
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

    $.when(a1(), a2()).done(function(){
        loadthegraph();
        //loadthechart();
    });

    function loadthegraph() {

      var obj = datag['features']
                //console.log(obj.length)
      for (var i = 0; i < obj.length; i++) {

      r = regions[i].toLowerCase();
                      //console.log(r);

        if (dataj['region'].hasOwnProperty(r)) {
            var o = dataj['region'][r]['prediction'][parseInt(dname)];
            datag['features'][i]['properties']['estimatedvalue'] = o;
        }
                        //console.log(i);

      }

      mapLayer =   L.geoJson(
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
        map.removeLayer(datag);
        week = 1;
        loadthegraph();
        //loadthechart();
        $(".diseasespan").html($('#disease-select').find(":selected").text());
    });


    $('#region-select').change(function(){
        regName = $('#region-select').find(":selected").text().toLowerCase();
        //loadthechart();
    });
