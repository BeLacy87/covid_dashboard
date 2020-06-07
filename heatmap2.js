function drawPlot(path, currentDate) {
  console.log(path)
  dataSet=path
  var heatArray = [];
  d3.selectAll("canvas").remove();
d3.csv(path).then(function(d){
  // console.log(d[0][currentDate])
  for (var i = 0; i < d.length; i++) {
    if (d[i].Long_){
      heatArray.push([
        parseFloat(d[i].Lat),
        parseFloat(d[i].Long_),
        parseInt(d[i][currentDate])]
        )
    }
    else {
      heatArray.push([
        parseFloat(d[i].Lat),
        parseFloat(d[i].Long),
        parseInt(d[i][currentDate])]
        )
      }
    }
  //  console.log(heatArray) 
   L.heatLayer(heatArray, {radius: 15, blur: 15})
   .addTo(myMap)
  }
)
}
function changeDate (d){
   currentDate = d
   drawPlot(dataSet, currentDate)   
 }

function update(index) {
  // Ensure the slider can't go past the valid range of values    
  i=dateArray[index]
  console.log(i)  
  console.log(minDate)
  if (i < minDate) {
      i = minDate
  }
  else if (i > maxDate) {
      i = maxDate
  };    
  // Update position and text of label according to slider scale
  handle.attr("cx", dateScale(index));
  label.attr("x", dateScale(index))
      .text(dateArray[index]);    
  // Now update the graph for that year
  drawPlot(dataSet, i)
  };

 
function optionChanged (d){
  var dataSets = {
    "confirmed" : "confirmed_US.csv",
    "deaths" : "deaths_us.csv",
    "global_confirmed" : "confirmed_global.csv",
    "deaths_global" : "deaths_global.csv"
    }
  console.log(`option changed to ${d}`)
  
  drawPlot(dataSets[d], currentDate)
}

  var streetmap=L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1IjoiYmVsYWN5ODciLCJhIjoiY2theDdxdmhsMDRkOTJ3cXRsZjNya2dqNyJ9.CbA_2MAMGvLUI-Sus96Qqw'
    });

  var myMap = L.map("map", {
    center: [39, -95],
    zoom: 4,
    layers: [streetmap]
  });

var dataSets = {
  "confirmed" : "confirmed_US.csv",
  "deaths" : "deaths_us.csv",
  "global_confirmed" : "confirmed_global.csv",
  "deaths_global" : "deaths_global.csv"
  }

function init (dataSet, currentDate){
  drawPlot(dataSet, currentDate);
  getDateArray(dataSet)
  
  d3.selectAll("td").remove();
  d3.selectAll("option").remove();
  var dropMenu = d3.select("#selDataset")
  var newOption = dropMenu.append("option")
  newOption.text("confirmed")
  var newOption = dropMenu.append("option")
  newOption.text("deaths")
  var newOption = dropMenu.append("option")
  newOption.text("global_confirmed")  
  var newOption = dropMenu.append("option")
  newOption.text("deaths_global")  


      // })
}

var dataSet = "confirmed_US.csv"
var minDate = "1/22/20";
var maxDate = "5/21/20";
var sliderStartX= 100;
var currentDate = minDate;
var currentValue = 0;

var dateArray=[]
var epochArray = []
var dateArrayIndices=[]
var chartWidth = 720

var svg = d3.select("#slider")
  .append("svg")
  .attr("width", chartWidth)


function getDateArray(dataSet){
  
  d3.csv(dataSet).then(function(data) { 
  
  var counter = 1;
  Object.entries(data[0]).forEach(([key,value])=>{
    const CODE_PATTERN = /^([0-9]{1,2}.[0-9]{1,2}.[0-9]{2})$/;
    const validateCode = function(key) {
      return CODE_PATTERN.test(key);
        };
    const isValidCode = validateCode(key);
      if(isValidCode===true){
        dateArray.push(key)
        dateArrayIndices.push(counter)
        counter += 1
        };
      })           
      var dropMenu = d3.select("#selDate")
      dateArray.forEach(function(date){
      var newOption = dropMenu.append("option")
      newOption.text(date)
      })
 
    }
  )

} ;
var currentIndex = dateArray.indexOf(currentDate) 
init(dataSet, currentDate);

var dateScale = d3.scaleLinear()
  .domain([0, 131])
  .range([sliderStartX, chartWidth])

var slider = svg.append("g")
  .attr("class", "slider")
  .attr("transform", "translate(0, 30)");

slider.append("line")
  .attr("class", "track")
  .attr("x1", sliderStartX)
  .attr("x2", chartWidth)
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
  .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
  .attr("class", "track-overlay")
  .call(d3.drag()
      .on("start.interrupt", function() { slider.interrupt(); })
      .on("start drag", function() {
        
        if (currentIndex !== Math.floor(dateScale.invert(d3.event.x))) {
          console.log(currentIndex)
          currentValue = d3.event.x;
          currentIndex = Math.floor(dateScale.invert(currentValue));
          update(currentIndex)
          console.log(currentIndex)         
          }
      })
  );

slider.insert("g", ".track-overlay")
  .attr("class", "ticks")
  .selectAll("text")
  .data(dateScale.ticks())
  .enter()
  .append("text")
  .attr("x", d => dateScale(d))
  .attr("y", 20)
  .attr("font-size", 12)
  .attr("text-anchor", "middle")
  .text(d => d);

// This is the circle on top of the slider
var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("cx", sliderStartX)
    .attr("r", 9);

// Text label on the circle for which year is selected
var label = slider.append("text")  
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .attr("font-size", 12)
    .attr("x", sliderStartX)
    .text(currentDate)
    .attr("transform", "translate(0 , -15)");


function drawPlayButton(button) {
  d3.select("#button").attr("class", "inactive");

  button.selectAll(".pause-parts").remove();

  button.attr("fill", "green")
      .attr("class", "inactive");

  button.append("path")
      .attr("d", "M10,8 L10,32 L32,20 Z")
      .attr("fill", "white")
      .attr("cursor", "pointer");
};

// Draw a pause button once we have "played" the slider movement
function drawPauseButton(button) {
  d3.select("#button").attr("class", "active");

  button.select("path").remove();

  button.attr("fill", "red")
      .attr("class", "active");

  button.append("rect")
      .attr("class", "pause-parts")
      .attr("x", 10)
      .attr("y", 10)
      .attr("width", 8)
      .attr("height", 20)
      .attr("fill", "white")
      .attr("cursor", "pointer");

  button.append("rect")
      .attr("class", "pause-parts")
      .attr("x", 22)
      .attr("y", 10)
      .attr("width", 8)
      .attr("height", 20)
      .attr("fill", "white")
      .attr("cursor", "pointer");
};

// Initialize shape for both the play and pause button
var button = svg.append("g")
  .attr("id", "button-g")
  .attr("transform", "translate(20, 10)");

button.append("rect")
  .attr("id", "button")
  .attr("width", 40)
  .attr("height", 40)
  .attr("rx", 4)
  .attr("stroke", "black")
  .attr("cursor", "pointer");

// Initialize the page to have the play button
drawPlayButton(button);



// This function will run only for the "play" button functionality
function step() {
  // var currentIndex = dateArray.indexOf(currentDate)
  // console.log(currentIndex)
  update(currentIndex);

  if (currentIndex >= d3.max(dateArrayIndices)) {
      drawPlayButton(d3.select("#button-g"));
      currentIndex = d3.min(dateArrayIndices);
      clearInterval(timer);
  };
  
  currentIndex = currentIndex + 1;
};

// Click event on the button
button.on("click", function() {
  var button = d3.select(this);

  if (d3.select("#button").attr("class") == "inactive") {
      drawPauseButton(button);
      
      // Define the interval to recursively run a function
      timer = setInterval(step, 50)
  }
  else {
      drawPlayButton(button)

      // Stop the currently running interval
      clearInterval(timer);
      ;
  }
});
