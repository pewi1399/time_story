//drawer = function(data, indata){
  var margin = {top: 10, right: 40, bottom: 10, left: 40},
      width = 800 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom,
      svg = d3.select(".plot")
                 .append("svg")
                 .attr("preserveAspectRatio", "xMinYMin meet")
                 .attr("viewBox","0 5 " + (width + 50)  + " " + (height+50))
                   //class to make it responsive
                 .classed("svg-content-responsive", true);
    


    // Setup the tool tip.  Note that this is just one example, and that many styling options are available.
    // See original documentation for more details on styling: http://labratrevenge.com/d3-tip/
    /*var tool_tip = d3.tip()
      .attr("class", "d3-tip")
      .direction("s")
      .offset([-8, 0])
      .html(function(d) { return "Radius: "; });
*/
    tool_tip = d3.tip()
      .attr("class", "d3-tip")
      .html(function(d) { return d.x; })
      .direction("s")
      .offset([4, 0]); 
    svg.call(tool_tip);

  // skapa
   var defs = svg.append("defs");

   defs.append('pattern')
     .attr("id", "ernstberger")
     .attr("width", 1)
     .attr("height", 1)
     .append("svg:image")
     .attr("xlink:href", "images/ernstberger.PNG")
     .attr("width", 20)
     .attr("height", 20)
     .attr("y", -0)
     .attr("x", -0);

   defs.append('pattern')
     .attr("id", "helikopter")
     .attr("width", 1)
     .attr("height", 1)
     .append("svg:image")
     .attr("xlink:href", "images/helikopter.PNG")
     .attr("width", 20)
     .attr("height", 20)
     .attr("x", -0)
     .attr("y", -0);

  var formatValue = d3.format(",d");

  var x = d3.scaleLinear()
      .rangeRound([0, width-50]);

  var y = d3.scaleLinear()
      .rangeRound([height, 0]);

  var g = svg.append("g")
      .attr("class", "container")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(d3.extent(data, function(d) { return d.value; }));
  y.domain(d3.extent(linedata, function(d) { return d.offset; }));

  var simulation = d3.forceSimulation(data)
      .force("x", d3.forceX(function(d) { return x(d.value); }).strength(1))
      .force("y", d3.forceY(height / 2))
      .force("collide", d3.forceCollide(11))
      .stop();

  for (var i = 0; i < 300; ++i) simulation.tick();

  //g.append("g")
  //    .attr("class", "axis axis--x")
  //    .attr("transform", "translate(0," + height + ")")
  //    .call(d3.axisBottom(x))//.ticks(20, ".0s"));

//  var cell = g.append("g")
//      .attr("class", "cells")
//    .selectAll("g").data(d3.voronoi()
//        .extent([[-margin.left, -margin.top], [width + margin.right, height + margin.top]])
//        .x(function(d) { return d.x; })
//        .y(function(d) { return d.y; })
//      .polygons(data)
//    ).enter().append("g");

    var pointdata = d3.voronoi()
        .extent([[-margin.left, -margin.top], [width + margin.right, height + margin.top]])
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
      .polygons(data).map(function(d){
        return d.data;
      }
    )



//  var cities = data.columns.slice(1).map(function(id) {
//    return {
//      id: id,
//      values: data.map(function(d) {
//        return {date: d.date, temperature: d[id]};
//      })
//    };
//  });

  // gridlines in y axis function
  function make_x_gridlines() {
      return d3.axisTop(x)
          .ticks(5)
  }

  // add the X gridlines
  g.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + height + ")")
    .call(make_x_gridlines()
        .tickSize(height- margin.top)
        //.tickFormat(".3")
    )

    g.selectAll(".lines")
        .data(linedata)
        .enter()
        .append("line")
        .style("stroke", function(d){ return d.color;})
        .style("opacity", 1)
        .style("stroke-width", 7)
        .style("stroke-linecap", "round")
        .style("shape-rendering", "geometricPrecision")
        .attr("x1", function(d) {return x(d.start);})
        .attr("y1", function(d) {return y((d.offset-2)/5 + 2);})
        .attr("x2", function(d) {return x(d.stop);})
        .attr("y2", function(d) {return y((d.offset-2)/5 + 2);});

        //remove horixontal line
        d3.select(".domain").remove()
        d3.selectAll(".tick").selectAll("line")
          .style("stroke-dasharray", "1,1")
          .style("stroke-width", "0.5")

        var cell = g.append("g")
            .attr("class", "cells")
          .selectAll("g")
          .data(pointdata)
          .enter().append("g");

      //cell.append("path")
      //    .attr("d", function(d) { return "M" + d.join("L") + "Z"; });
      cell.append("circle")
          .attr("r", 10)
          //.attr("cy", 1000)
          //.transition()
          //.delay(1000)
          //.duration(1500)
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .attr("fill", function(d,i){
     return i%2 === 0 ? "url(#ernstberger)" : "url(#helikopter)"
     })
      .on('mouseover', tool_tip.show)
      .on('mouseout', tool_tip.hide);

      cell.append("title")
          .text(function(d) { return d.id + "\n" + formatValue(d.value); });



//}
