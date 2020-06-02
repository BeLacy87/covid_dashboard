var myMap = L.map("map", {
  center: [37.5407, -77.4360],
  zoom: 5
});

 
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
tileSize: 512,
maxZoom: 18,
zoomOffset: -1,
id: 'mapbox/streets-v11',
accessToken: 'pk.eyJ1IjoiYmVsYWN5ODciLCJhIjoiY2theDdxdmhsMDRkOTJ3cXRsZjNya2dqNyJ9.CbA_2MAMGvLUI-Sus96Qqw'
}).addTo(myMap);

var date = "5/1/20"
var path = "confirmed_US.csv"

d3.csv(path).then(function(data){
  console.log(data[0])
  var dateArray=[];
  Object.entries(data[0]).forEach(([key,value])=>{
    const CODE_PATTERN = /^([0-9]{1,2}.[0-9]{1,2}.[0-9]{2})$/;
    const validateCode = function(key) {
    return CODE_PATTERN.test(key);
    };
    const isValidCode = validateCode(key);
    if(isValidCode===true)
    dateArray.push(key);
    });
  console.log(dateArray);
  
  var heatArray = [];
  for (var i = 0; i < data.length; i++) {  
    
     
       heatArray.push([parseInt(data[i].Lat), 
                       parseInt(data[i].Long_), 
                       parseInt(data[i][date])]);


    }
  console.log(heatArray)

  var heat = L.heatLayer(heatArray, {
    radius: 15,
    blur: 15
  }).addTo(myMap);
  });


