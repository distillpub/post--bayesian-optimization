// https://www.d3-graph-gallery.com/graph/density_slider.html
const duration = 100;

function returnCurrAlpha(data, curr_eps) {
  var curr_data = new Array();
  var ll = data[curr_eps].store['x'].length;
  var i;
  for (i=0; i<ll; i++) {
    curr_data.push({
      x: data[curr_eps].store['x'][i],
      alphaPI: data[curr_eps].store['alphaPI'][i],
      gt: data[curr_eps].store['gt'][i],
      mu: data[curr_eps].store['mu'][i],
      sig: data[curr_eps].store['sig'][i],
      mu_plus: data[curr_eps].store['mu_plus']
    });
  }
  return curr_data;
}

function returnPoints(data, curr_eps) {
  var pts = data[curr_eps].store.points;
  var mu_plus = data[curr_eps].store['mu_plus'];
  var num_pts = pts.length;
  var combination = new Array();
  for (var i = 0; i < num_pts; i++) {
    var ll = pts[i]['x_linspace'].length;
    var gaus_plots = new Array;
    for (var j = 0; j < ll; j++) {
      gaus_plots.push({
        x_linspace: pts[i]['x_linspace'][j],
        y_linspace: pts[i]['y_linspace'][j],
      });
    }
    var end = pts[i]['x_linspace'].length;
    var start = pts[i]['mu_plus_ix'];
    var pi_areas = new Array;
    for (var j = start; j < end; j++) {
      pi_areas.push({
        x_linspace: pts[i]['x_linspace'][j],
        y_linspace: pts[i]['y_linspace'][j],
        mu_line_part: mu_plus,
      });
    }
    combination.push( {
      gaus_plots: gaus_plots,
      pi_areas: pi_areas,
    });
  }
  return combination;
}


// get the data
d3.json("data/pi_cdf.json", function(data) {
  console.log('Json read!')
  console.log(data);

  var curr_eps = "0";
  var curr_data = returnCurrAlpha(data, curr_eps);

  // ---------------------------

  // set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 80, left: 50},
  width = 800 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;
  // append the svg object to the body of the page
var svg = d3.select("#Teaser1")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var ordinal = d3.scaleOrdinal()
  .domain(["⠀   Optimal"])
  .range([ "purple"]);
var marginl = {top: 0, right: 0, bottom: 0, left: 40},
  widthl = 300 - marginl.left - marginl.right,
  heightl = 200 - marginl.top - marginl.bottom;
var svg1l = d3.select("#TeaserL1")
  .append("svg")
  .attr("width", widthl + marginl.left + marginl.right)
  .attr("height", heightl + marginl.top + marginl.bottom)
  .append("g")
  .attr("transform",
        "translate(" + marginl.left + "," + marginl.top + ")");
  svg1l.append("g")
  .attr("class", "legendOrdinal")
  .attr("transform", "translate(20, 80)");
  var legendOrdinal = d3.legendColor()
  .labelWrap(30)
  .shape("path", d3.symbol().type(d3.symbolCircle).size(50)())
  .shapePadding(10)
  .cellFilter(function(d){ return d.label !== "e" })
  .scale(ordinal);
  svg1l.select(".legendOrdinal")
  .call(legendOrdinal);

// add the x Axis
var x = d3.scaleLinear()
  .domain([0, d3.max(curr_data, function(d, i) {
    return d.x;
  })])
  .range([0, width]);
svg.append("g")
  .attr("class", "xaxis")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x)
    .tickValues([]));
// add the y Axis
var y = d3.scaleLinear()
          .domain([0, d3.max(curr_data, function(d, i) {
            return d.alphaPI;
          })])
          .range([height, 0]);
var yaxis = svg.append("g")
  .attr("class", "yaxis")
  .call(d3.axisRight(y)
    .tickFormat(d3.format(".1e")));
// Textual Content
svg.append("text")
  .attr("id", "plot1title")
  .attr("class", "title")
  .attr("x", (width / 2))
  .attr("y", 0 - (margin.top / 2))
  .text("ϵ = " + data[curr_eps].eps.toFixed(2));
svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("class", "label")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .text("α(pi)");
// Plot the line
var valueline = d3.line()
      .curve(d3.curveBasis)
        .x(function(d) { return x(d['x']); })
        .y(function(d) { return y(d['alphaPI']); });
var curve = svg
  .append('g')
  .append("path")
    .attr("class", "pi")
    .datum(curr_data)
    .attr("d", valueline(curr_data));
var curve_1 = svg
  .append('g')
  .append("path")
    .attr("class", "pi_fill")
    .datum(curr_data)
    .attr("d",  d3.area()
      .x(function(d) { return x(d['x']); })
      .y1(function(d) { return y(d['alphaPI']); })
      .y0(function(d) { return y(0.0); })
    );
const max_alpha = d3.max(curr_data, function(d, i) {
  return d.alphaPI;
});
const alph_arr = curr_data.map(a => a.alphaPI);
const max_alpha_ix = alph_arr.indexOf(max_alpha);
var max_pt = svg
  .append("circle")
  .datum({
    val: max_alpha,
    loc: curr_data[max_alpha_ix].x
  })
    .attr("class", "maxPt")
    .attr("cx", function(d) { return x(d.loc); })
    .attr("cy", function(d) { return y(d.val); });

  // A function that update the chart when slider is moved?
  function updateChart1(curr_eps) {
    // recompute density estimation
    console.log("Eps Selected: "+ data[curr_eps].eps.toFixed(2));
    var curr_data = returnCurrAlpha(data, curr_eps);
    // update title
    var xx = document.getElementById("plot1title");
    xx.innerHTML = "ϵ = " + data[curr_eps].eps.toFixed(2);
    y.domain([0, d3.max(curr_data, function(d, i) {
            return d.alphaPI;
          })]);
    yaxis
      .transition()
      .duration(duration)
      .call(d3.axisRight(y)
        .tickFormat(d3.format(".1e")));

    curve
      .datum(curr_data)
      .transition()
      .duration(duration)
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x(d['x']); })
          .y(function(d) { return y(d['alphaPI']); })
      );

    curve_1
      .datum(curr_data)
      .transition()
      .duration(duration)
      .attr("d",  d3.area()
        .x(function(d) { return x(d['x']); })
        .y1(function(d) { return y(d['alphaPI']); })
        .y0(function(d) { return y(0.0); })
      );

      const max_alpha = d3.max(curr_data, function(d, i) {
                  return d.alphaPI;
                });
      const alph_arr = curr_data.map(a => a.alphaPI);
      const max_alpha_ix = alph_arr.indexOf(max_alpha);
      max_pt
      .datum({
      val: max_alpha,
      loc: curr_data[max_alpha_ix].x
      })
      .transition()
      .duration(duration)
      .attr("cx", function(d) { return x(d.loc); })
      .attr("cy", function(d) { return y(d.val); });
  }

  // ------------------------------


  // Same margins
  // set the dimensions and margins of the graph
  var margin = {top: 30, right: 30, bottom: 30, left: 50},
  width = 800 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;
  // append the svg object to the body of the page
  var svg2 = d3.select("#Teaser2")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom + 15)
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
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x2));
  // add the y Axis
  var y2 = d3.scaleLinear()
            .domain([0, d3.max(curr_data, function(d, i) {
              return d.gt;
            })])
            .range([height, 0]);
  svg2.append("g")
    .attr("class", "yaxis")
    .call(d3.axisLeft(y2));
  // Textual Content
  svg2.append("text")
    .attr("id", "plot2title")
    .attr("class", "title")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .text("CDF (Shaded regions) for candidate points");
  svg2.append("text")
    .attr("transform", "rotate(-90)")
    .attr("class", "label")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .text("Gold Content f(x)");
  svg2.append("text") // text label for the x axis
    .attr("class", "label")
    .attr("x", width / 2 )
    .attr("y", height + margin.bottom + 13)
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
  // Plotting the mu_plus or f(x^+) line
  var curve5 = svg2
    .append('g')
    .append("path")
      .attr("id", "mu_plus")
      .datum(curr_data)
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x2(d['x']); })
          .y(function(d) { return y2(d['mu_plus']); })
      );

var anno1 = svg2
  .append("text")
  .attr("class", "annotationz")
  .attr("y", 30)
  .attr("x", 160);
anno1
  .append("tspan")
  .attr("id", "asasd")
  .text("The Probability that a new point x");
anno1
  .append("tspan")
  .attr("dy", "1.5em")
  .attr("x", 160)
  .text("leads to a better objective is given by");
anno1
  .append("tspan")
  .attr("dy", "1.5em")  
  .attr("x", 160)
  .attr("font-weight", "bold")
  .text("Probability of Improvement⠀");
anno1
  .append("tspan")
  .text("Acquisition function.");

var anno1 = svg2
  .append("text")
  .attr("class", "annotationz")
  .attr("y", 250)
  .attr("x", 275);
anno1
  .append("tspan")
  .attr("id", "asasd")
  .text("Move the mouse over the⠀");
anno1
  .append("tspan")
  .attr("id", "asasd")
  .attr("fill", "purple")
  .text("purple line (f(x+) + ϵ)");
  
anno1
  .append("tspan")
  .attr("dy", "1.5em")
  .attr("x", 275)
  .text("to adjust the amount of⠀");
anno1
  .append("tspan")
  .attr("font-weight", "bold")
  .text("exploration (ϵ)⠀");
anno1
  .append("tspan")
  .text("perfomed.");
  // plotting the points
  var combination = returnPoints(data, curr_eps);
  var len = combination.length;
  // setting color
  var color = d3.scaleOrdinal()
    .domain([...Array(len).keys()])
    .range(d3.schemeDark2);
  // actually ploytting
  var arrp = new Array;
  var arrg = new Array;
  for (var i = 0; i < len; i++) {
    var pi_areas = combination[i].pi_areas;
    var gaus_plots = combination[i].gaus_plots;
    // plotting the areas
    arrp.push (
      svg2
        .append('g')
        .append("path")
          .attr("class", "pi_areas")
          .attr("stroke", color(i))
          .attr("fill", color(i))
          .datum(pi_areas)
          .attr("d",  d3.area()
            .x(function(d) { return x2(d.x_linspace); })
            .y1(function(d) { return y2(d.y_linspace); })
            .y0(function(d) { return y2(d.mu_line_part); })
          )
    );
    // plotting the gaussi
    arrg.push (
      svg2
        .append('g')
        .append("path")
          .attr("class", "gaus_plots")
          .attr("stroke", color(i))
          .datum(gaus_plots)
          .attr("d",  d3.line()
            .x(function(d) { return x2(d.x_linspace); })
            .y(function(d) { return y2(d.y_linspace); })
          )
    );
  }
  var temp = [...Array(len).keys()];
  for(var i=0;i<temp.length;i++){
    temp[i]="⠀  Candidate Point" + temp[i];
  }
  var selector = 3;
  temp.push("GT");
  temp.push("GP  Prediction");
  temp.push("ϵ + f(x+)");
  temp.push("⠀ Sampled Points");
  var len2 = temp.length;
  var colors = d3.schemeDark2.slice(0, len);
  colors.push("steelblue");
  colors.push("black");
  colors.push("purple");
  colors.push("red");
  var ordinal = d3.scaleOrdinal()
    .domain(temp.slice(0, selector))
    .range(colors.slice(0, selector));

  var marginl = {top: -40, right: 30, bottom: 30, left: -30},
  widthl = 300 - marginl.left - marginl.right,
  heightl = 400 - marginl.top - marginl.bottom;

  var svg2l = d3.select("#TeaserL2")
    .append("svg")
    .attr("width", widthl + marginl.left + marginl.right)
    .attr("height", heightl + marginl.top + marginl.bottom)
    .append("g")
    .attr("transform",
          "translate(" + marginl.left + "," + marginl.top + ")");
  svg2l.append("g")
    .attr("class", "legendOrdinal")
    .attr("transform", "translate(100,190)");
  var legendOrdinal = d3.legendColor()
    .labelWrap(30)
    //d3 symbol creates a path-string, for example
    //"M0,-8.059274488676564L9.306048591020996,
    //8.059274488676564 -9.306048591020996,8.059274488676564Z"
    .shape("path", d3.symbol().type(d3.symbolCircle).size(50)())
    .shapePadding(10)
    //use cellFilter to hide the "e" cell
    .cellFilter(function(d){ return d.label !== "e" })
    .scale(ordinal);
  svg2l.select(".legendOrdinal")
    .call(legendOrdinal);
    var ordinal = d3.scaleOrdinal()
    .domain(temp.slice(selector, len2))
    .range(colors.slice(selector, len2));
  svg2l.append("g")
    .attr("class", "legendOrdinal2")
    .attr("transform", "translate(180,190)");
  var legendOrdinal2 = d3.legendColor()
    .labelWrap(30)
    .shape("path", d3.symbol().type(d3.symbolCircle).size(50)())
    .shapePadding(10)
    //use cellFilter to hide the "e" cell
    .cellFilter(function(d){ return d.label !== "e" })
    .scale(ordinal);
  svg2l.select(".legendOrdinal2")
    .call(legendOrdinal2);

// highlighting selected points
const train_x = data[curr_eps].store.train_X;
const train_y = data[curr_eps].store.train_y;
for (var i = train_x.length - 1; i >= 0; i--) {
  var sel_pt = svg2
  .append("circle")
  .datum({
        loc: train_x[i],
        val: train_y[i]
      })
    .attr("class", "selectedPts")
    .attr("cx", function(d) { return x2(d.loc); })
    .attr("cy", function(d) { return y2(d.val); });
}

  // A function that update the chart when slider is moved?
  function updateChart2(curr_eps) {
    // recompute density estimation
    var curr_data = returnCurrAlpha(data, curr_eps);
    curve5
      .datum(curr_data)
      .transition()
      .duration(duration)
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x2(d['x']); })
          .y(function(d) { return y2(d['mu_plus']); })
      );

      // plotting the points
      var combination = returnPoints(data, curr_eps);
      var len = combination.length;
      // setting color
      var color = d3.scaleOrdinal()
        .domain([...Array(len).keys()])
        .range(d3.schemeDark2);
      // actually ploytting
      var arr = new Array;
      for (var i = 0; i < len; i++) {
        var pi_areas = combination[i].pi_areas;
        // plotting the areas
        arrp[i]
          .datum(pi_areas)
          .transition()
          .duration(duration)
              .attr("d",  d3.area()
                .x(function(d) { return x2(d.x_linspace); })
                .y1(function(d) { return y2(d.y_linspace); })
                .y0(function(d) { return y2(d.mu_line_part); })
          );
      }
  }
  const counts = data.map(a => a.store.mu_plus);
  const gEnter = svg2
    .append('g')
      .attr('class', 'container');
  gEnter
    .append('rect')
      .attr('class', 'mouse-interceptor')
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
    // .merge(g.select('.mouse-interceptor'))
      .attr('width', width)
      .attr('height', height)
      .on('mousemove', function() {
        const pos = d3.mouse(this)[1];
        const goal = y2.invert(pos)
        var closest = counts.reduce(function(prev, curr) {
          return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
        });
        const selectedValue = counts.indexOf(closest)
        updateChart1(selectedValue);
        updateChart2(selectedValue);
      });
});
    