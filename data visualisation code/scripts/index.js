var predictionLocalJSON = "data/prediction.json";
var predictionOnlineJSON = "http://192.168.43.63:5001/region/prediction";
var dataj;


function a1(){
return $.getJSON(predictionLocalJSON,{}, function(d) {
dataj = d;
});
}

$.when(a1()).done(function(){
  loadPredictedDisease();
});

function loadPredictedDisease(){
  var obj = dataj
  var high = obj['high']
  high.sort(function(a,b){
    return parseInt(b.prediction) - parseInt(a.prediction)
  });

  for (var i = 0; i < high.length; i++) {
      if (high[i]['prediction'] < 20) {
        $('.disease-container').append("<div class='disease-one'> <p class='disease-name lowest'>"+ high[i]['disease'] +"</p><p class='disease-info'><span class='disease-percent lowest-color'>"+ high[i]['prediction'] + " </span> people maybe affected in <span class='disease-place lowest-color'>"+ high[i]['region']+"</span></p></div>");
        $('.lowest').css("background-color","#fdfffc");
        $('.lowest-color').css("color","#fdfffc");
      }else if (high[i]['prediction'] < 40) {
        $('.disease-container').append("<div class='disease-one'> <p class='disease-name low'>"+ high[i]['disease'] +"</p><p class='disease-info'><span class='disease-percent low-color'>"+ high[i]['prediction'] + " </span> people maybe affected in  <span class='disease-place low-color'>"+ high[i]['region']+"</span></p></div>");
        $('.low').css("background-color","#ff9f1c");
        $('.low-color').css("color","#ff9f1c");
      }else if (high[i]['prediction'] < 60) {
        $('.disease-container').append("<div class='disease-one'> <p class='disease-name normal'>"+ high[i]['disease'] +"</p><p class='disease-info'><span class='disease-percent normal-color'>"+ high[i]['prediction'] + " </span> people maybe affected in  <span class='disease-place normal-color'>"+ high[i]['region']+"</span></p></div>");
        $('.normal').css("background-color","#2ec4b6");
        $('.normal-color').css("color","#2ec4b6");
      }else if (high[i]['prediction'] < 80) {
        $('.disease-container').append("<div class='disease-one'> <p class='disease-name high'>"+ high[i]['disease'] +"</p><p class='disease-info'><span class='disease-percent high-color'>"+ high[i]['prediction'] + " </span> people maybe affected in  <span class='disease-place high-color'>"+ high[i]['region']+"</span></p></div>");
        $('.high').css("background-color","#e899a6");
        $('.high-color').css("color","#e899a6");
      }else{
        $('.disease-container').append("<div class='disease-one'> <p class='disease-name highest'>"+ high[i]['disease'] +"</p><p class='disease-info'><span class='disease-percent highest-color'>"+ high[i]['prediction'] + " </span> people maybe affected in  <span class='disease-place highest-color'>"+ high[i]['region']+"</span></p></div>");
        $('.highest').css("background-color","#e83151");
        $('.highest-color').css("color","#e83151");
      }
  }
}
