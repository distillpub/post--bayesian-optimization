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
      alphaPI: data[curr_eps].store['alphaPI'][i],
      gt: data[curr_eps].store['gt'][i],
      mu: data[curr_eps].store['mu'][i],
      sig: data[curr_eps].store['sig'][i]
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
    .text("$\\alpha_{PI} for \\epsilon = " + data[curr_eps].eps + "$");
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
      .attr("class", "path")
      .datum(curr_data)
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
    xx.innerHTML = "$\\alpha_{PI} for \\epsilon = " + data[curr_eps].eps + "$";
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


  // Same margins
  // append the svg object to the body of the page
  var svg2 = d3.select("#Teaser2")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
  // add the x Axis
  var x2 = d3.scaleLinear()
            .range([0, width])
            .domain([0, d3.max(curr_data, function(d, i) {
              return d.x;
            })]);
  svg2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x2));
  // add the y Axis
  var y2 = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(curr_data, function(d, i) {
              return d.gt;
            })]);
  svg2.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(y));
  // Textual Content
  svg2.append("text")
    .attr("id", "plot2title")
    .attr("class", "title")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .text("Compare");
  svg2.append("text")
    .attr("transform", "rotate(-90)")
    .attr("class", "label")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .text("$f(x) // 2 axis$");
  svg2.append("text") // text label for the x axis
    .attr("class", "label")
    .attr("x", width / 2 )
    .attr("y", height + margin.bottom )
    .text("X");
  // Plot the gt/////
  var curve2 = svg2
    .append('g')
    .append("path")
      .attr("class", "unfilled")
      .datum(curr_data)
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x2(d['x']); })
          .y(function(d) { return y2(d['gt']); })
      );

  // Plot the gp
  var curve3 = svg2
    .append('g')
    .append("path")
      .attr("class", "unfilledgt")
      .datum(curr_data)
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x2(d['x']); })
          .y(function(d) { return y2(d['mu']); })
      );
  var curve4 = svg2
    .append('g')
    .append("path")
      .attr("class", "filledgt")
      .datum(curr_data)
      .attr("d",  d3.area()
          .x(function(d) { return x2(d['x']); })
          .y1(function(d) { return y2(d['mu'] + d['sig']); })
          .y0(function(d) { return y2(d['mu'] - d['sig']); })
      );


  // A function that update the chart when slider is moved?
  function updateChart2(curr_eps) {
    // recompute density estimation
    console.log("Graph2 Eps Selected: "+ data[curr_eps].eps);
    var curr_data = returnCurrAlpha(data, curr_eps);
    // console.log(data)
    // console.log(curr_data)
    // console.log(curr_data['x'])
    // console.log(curr_data['alphaPI'])

    // update title
    // var xx2 = document.getElementById("plot2title");
    // xx2.innerHTML = "$f(x) // 2 axis$";
    // update the chart  
    // curve3
    //   .datum(curr_data)
    //   .transition()
    //   .duration(1000)
    //   .attr("d",  d3.line()
    //     .curve(d3.curveBasis)
    //       .x(function(d) { return x2(d['x']); })
    //       .y(function(d) { return y2(d['mu']); })
    //   );
  }
  

  // ----------------------------

  // Listen to the slider?
  // setTimeout(() => {
    
  //   MathJax.Hub.Config({
  //     tex2jax: {
  //       inlineMath: [ ['$','$'], ["\\(","\\)"] ],
  //       processEscapes: true
  //     }
  //   });
    
  //   MathJax.Hub.Register.StartupHook("End", function() {
  //     setTimeout(() => {
  //           svg.selectAll('.tick').each(function(){
  //           var self = d3.select(this),
  //               g = self.select('text>span>svg');
  //           g.remove();
  //           self.append(function(){
  //             return g.node();
  //           });
  //         });
  //       }, 1);
  //     });
    
  //   MathJax.Hub.Queue(["Typeset", MathJax.Hub, svg.node()]);
    
  // }, 1);

  d3.select("#slider").on("change", function(d){
    selectedValue = this.value
    updateChart1(selectedValue);
    updateChart2(selectedValue);
  })
});
    