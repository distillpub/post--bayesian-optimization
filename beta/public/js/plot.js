// https://www.d3-graph-gallery.com/graph/density_slider.html
// Function to compute density
function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, d3.mean(V, function(v) { return kernel(x - v); })];
    });
  };
}
function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}

function returnCurrAlpha(data, curr_eps) {
  // console.log("insisfe retrn funciron.");
  var curr_data = new Array();
  var ll = data[curr_eps].store['x'].length;
  var i;
  for (i=0; i<ll; i++) {
    curr_data.push({
      x: data[curr_eps].store['x'][i],
      alphaPI: data[curr_eps].store['alphaPI'][i]
      gt: data[curr_eps].store['gt'][i]
    });
  }
  return curr_data;
}


// get the data
d3.json("data/pi_cdf.json", function(data) {
  console.log('Logging json read!')
  console.log(data);

  var curr_eps = "0";
  var curr_data = returnCurrAlpha(data, curr_eps);

  // ---------------------------

  // set the dimensions and margins of the graph
  var margin = {top: 30, right: 30, bottom: 30, left: 50},
  width = 460 - margin.left - margin.right,
  height = 200 - margin.top - margin.bottom;
  // append the svg object to the body of the page
  var svg = d3.select("#Teaser1")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
  // add the x Axis
  var x = d3.scaleLinear()
            .domain([0, d3.max(curr_data, function(d, i) {
              return d.x;
            })])
            .range([0, width]);
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  // add the y Axis
  var y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, 1]);
  svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(y));
  // Textual Content
  svg.append("text")
    .attr("id", "plot1title")
    .attr("class", "title")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .text("Alpha PI for epsilon = " + data[curr_eps].eps);
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("class", "label")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .text("Alpha PI");
  svg.append("text") // text label for the x axis
    .attr("class", "label")
    .attr("x", width / 2 )
    .attr("y", height + margin.bottom )
    .text("X");
  // Plot the area
  var curve = svg
    .append('g')
    .append("path")
      .attr("class", "mypath")
      .datum(curr_data)
      .attr("fill", "none")
      // .attr("opacity", ".8")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x(d['x']); })
          .y(function(d) { return y(d['alphaPI']); })
      );

  // A function that update the chart when slider is moved?
  function updateChart1(curr_eps) {
    // recompute density estimation
    console.log("Graph1 Eps Selected: "+ data[curr_eps].eps);
    var curr_data = returnCurrAlpha(data, curr_eps);
    // console.log(data)
    // console.log(curr_data)
    // console.log(curr_data['x'])
    // console.log(curr_data['alphaPI'])

    // update title
    var xx = document.getElementById("plot1title");
    xx.innerHTML = "Alpha PI for epsilon = " + data[curr_eps].eps;
    // update the chart  
    curve
      .datum(curr_data)
      .transition()
      .duration(1000)
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x(d['x']); })
          .y(function(d) { return y(d['alphaPI']); })
      );
  
  }

  // ------------------------------
/*
  // append the svg object to the body of the page
  var svg2 = d3.select("#Teaser2")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

  // add the x2 Axis
  var x2 = d3.scaleLinear()
            .domain([0, 1000])
            .range([0, width]);
  svg2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x2));

  // add the y2 Axis
  var y2 = d3.scaleLinear()
            .range([height, 0])
            .domain([0, 0.01]);
  svg2.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y2));

  // Compute kernel density estimation
  var kde = kernelDensityEstimator(kernelEpanechnikov(7), x2.ticks(1))
  var density =  kde( data.map(function(d){  return d.price; }) )

  // Plot the area
  var curve2 = svg2
    .append('g')
    .append("path")
      .attr("class", "mypath")
      .datum(density)
      .attr("fill", "#6911a2")
      .attr("opacity", ".8")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x2(d[0]); })
          .y(function(d) { return y2(d[1]); })
      );

  // A function that update the chart when slider is moved?
  function updateChart2(binNumber) {
    // recompute density estimation
    binNumber = parseInt(binNumber * 1000)
    kde = kernelDensityEstimator(kernelEpanechnikov(7), x2.ticks(binNumber))
    density =  kde( data.map(function(d){  return d.price; }) )
    console.log("Graph2: "+binNumber)

    // update the chart
    curve2
      .datum(density)
      .transition()
      .duration(1000)
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x2(d[0]); })
          .y(function(d) { return y2(d[1]); })
      );
  }

  // ----------------------------

*/
  // Listen to the slider?
  d3.select("#slider").on("change", function(d){
    selectedValue = this.value
    updateChart1(selectedValue);
    // updateChart2(selectedValue);
  })
});
