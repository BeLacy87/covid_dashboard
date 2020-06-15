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
  "confirmed cases in US" : confirmed_us,
"deaths in US" : deaths_us,
"confirmed cases global" : confirmed_global,
"global deaths" : deaths_global
}
var deaths_global="https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv"
var deaths_us="https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv"
var confirmed_global="https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"
var confirmed_us = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv"
// var dataSet = "confirmed_US.csv"
var dataSet = confirmed_us
var minDate = "1/22/20";
var maxDate = "5/21/20";
var sliderStartX= 100;
var currentDate = minDate;
var currentValue = 0;
var dateArray=[];
var dateArrayIndices=[];
var epochArray = [];
var chartWidth = 720;
var currentIndex = dateArray.indexOf(toString(currentDate))


function init (dataSet, currentDate){
  d3.selectAll("canvas").remove();
  var svg = d3.select("#slider")
    .append("svg")
    .attr("width", chartWidth)
   //get dateArray and dateArrayIndicies
  d3.csv(dataSet).then(function(data) {   
      var counter = 0;
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
          // return dateArrayIndices
         })              
      var dropMenu = d3.select("#selDate")
      dateArray.forEach(function(date){
      var newOption = dropMenu.append("option")
      newOption.text(date)
       })    
      const min = Math.min(...dateArrayIndices)
      const max = Math.max(...dateArrayIndices)
      
  d3.selectAll("td").remove();
  d3.selectAll("option").remove();
  var dropMenu = d3.select("#selDataset")
  var newOption = dropMenu.append("option")
  newOption.text("confirmed cases in US")
  var newOption = dropMenu.append("option")
  newOption.text("deaths in US")
  var newOption = dropMenu.append("option")
  newOption.text("confirmed cases global")  
  var newOption = dropMenu.append("option")
  newOption.text("global deaths") 

  var dateScale = d3.scaleLinear() 
  .domain([min,max])
  // .domain(d3.extent([0,180]))
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
      .on("start.interrupt", function() { 
        slider.interrupt(); })
      .on("start drag", function() {        
        if (currentIndex !== Math.floor(dateScale.invert(d3.event.x))) 
          {console.log(currentIndex);
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

    function update(index) {
      console.log(index)
      if (index < min ) 
        {index = min}
      else if (index > max) 
        {index = max};    
      handle.attr("cx", dateScale(index));
      label.attr("x", dateScale(index))
          .text(dateArray[index]);    
      changeDate(index)
      };  
  })
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
}

function step() {
  update(currentIndex);

  if (currentIndex >= d3.max(dateArrayIndices)) {
      drawPlayButton(d3.select("#button-g"));
      currentIndex = d3.min(dateArrayIndices);
      clearInterval(timer);
  };
  
  currentIndex = currentIndex + 1;
};

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
   currentDate = dateArray[d]
   drawPlot(dataSet, currentDate)    
 }

function optionChanged (d){
  var dataSets = {
    "confirmed cases in US" : confirmed_us,
    "deaths in US" : deaths_us,
    "confirmed cases global" : confirmed_global,
    "global deaths" : deaths_global
    }
  console.log(`option changed to ${d}`)
  dataSet=dataSets[d]
  drawPlot (dataSet, currentDate)
  return dataSet
}


//get dateArray and dateArrayIndicies
d3.csv(dataSet).then(function(data) {   
  var counter = 0;
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
      // return dateArrayIndices
     })  
  console.log(dateArray)
  var dropMenu = d3.select("#selDate")
  dateArray.forEach(function(date){
  var newOption = dropMenu.append("option")
  newOption.text(date)
   })  
}) 


init(dataSet, currentDate);


//end of init







