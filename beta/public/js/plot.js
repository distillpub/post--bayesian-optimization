// https://www.d3-graph-gallery.com/graph/density_slider.html

// get the data
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/1_OneNum.csv", function(data) {
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
            .domain([0, 1000])
            .range([0, width]);
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y2 Axis
  var y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, 0.01]);
  svg.append("g")
      .call(d3.axisLeft(y));

  // Compute kernel density estimation
  var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(1))
  var density =  kde( data.map(function(d){  return d.price; }) )

  // Plot the area
  var curve = svg
    .append('g')
    .append("path")
      .attr("class", "mypath")
      .datum(density)
      .attr("fill", "#69b3a2")
      .attr("opacity", ".8")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x(d[0]); })
          .y(function(d) { return y(d[1]); })
      );

  // A function that update the chart when slider is moved?
  function updateChart1(binNumber) {
    // recompute density estimation
    binNumber = parseInt(binNumber * 1000)
    kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(binNumber))
    density =  kde( data.map(function(d){  return d.price; }) )
    console.log("Graph1: "+binNumber)

    // update the chart
    curve
      .datum(density)
      .transition()
      .duration(1000)
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x(d[0]); })
          .y(function(d) { return y(d[1]); })
      );
  
  }

  // ------------------------------


  // set the dimensions and margins of the graph
  // var margin = {top: 30, right: 30, bottom: 30, left: 50},
  // width = 460 - margin.left - margin.right,
  // height = 200 - margin.top - margin.bottom;

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
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x2));

  // add the y2 Axis
  var y2 = d3.scaleLinear()
            .range([height, 0])
            .domain([0, 0.01]);
  svg2.append("g")
      .call(d3.axisLeft(y2));

  // Compute kernel density estimation
  var kde = kernelDensityEstimator(kernelEpanechnikov(7), x2.ticks(1))
  var density =  kde( data.map(function(d){  return d.price; }) )

  // Plot the area
  var curve = svg2
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
    curve
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

  // Listen to the slider?
  d3.select("#slider").on("change", function(d){
    selectedValue = this.value
    updateChart1(selectedValue);
    updateChart2(selectedValue);
  })
});

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
