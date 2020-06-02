var myMap = L.map("map", {
  center: [37.5407, -77.4360],
  zoom: 13
});

 
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
tileSize: 512,
maxZoom: 18,
zoomOffset: -1,
id: 'mapbox/streets-v11',
accessToken: 'pk.eyJ1IjoiYmVsYWN5ODciLCJhIjoiY2theDdxdmhsMDRkOTJ3cXRsZjNya2dqNyJ9.CbA_2MAMGvLUI-Sus96Qqw'
}).addTo(myMap);


var path = "confirmed_US.csv"

d3.csv(path).then(function(data){
  console.log(data[0])
  Object.entries(data[0]).forEach(([key,value])=>
  console.log(key));


// const CODE_PATTERN = /^([a-zA-Z]{1}-[0-9]{2}-[0-9]{2}[a-zA-Z]{0,1})$/;
const CODE_PATTERN = /^([0-9]{1,2}.[0-9]{1,2}.[0-9]{2})$/;



const validateCode = function(code) {
  return CODE_PATTERN.test(code);
};

// Test sample of codes.
const testCodes = [
  '1/1/20',
  '5/10/20',
  'B-13-99',
  'B-14-11A',
  'B-13-100'
];
for (code of testCodes) {
  const isValidCode = validateCode(code);
  console.log(isValidCode);
}








  var heatArray = [];
  for (var i = 0; i < data.length; i++) {
 
      heatArray.push([parseInt(data[i].Lat), parseInt(data[i].Long_)]);
    
  }
  console.log(heatArray);
  var heat = L.heatLayer(heatArray, {
    radius: 15,
    blur: 15
  }).addTo(myMap);
  });



// d3.json(url, function(response) {

//   console.log(response);

//   var heatArray = [];

//   for (var i = 0; i < response.length; i++) {
//     var location = response[i].location;

//     if (location) {
//       heatArray.push([location.coordinates[1], location.coordinates[0]]);
//     }
//   }

//   var heat = L.heatLayer(heatArray, {
//     radius: 20,
//     blur: 35
//   }).addTo(myMap);

// });
