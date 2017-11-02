//drawer = function(data, indata){
  var margin = {top: 10, right: 40, bottom: 10, left: 40},
      width = 800 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom,
      svg = d3.select(".plot")
                 .append("svg")
                 .attr("preserveAspectRatio", "xMinYMin meet")
                 .attr("viewBox","0 5 " + (width + 50)  + " " + (height+50))
                   //class to make it responsive
                 .classed("svg-content-responsive", true);

    tool_tip = d3.tip()
      .attr("class", "d3-tip")
      .html(function(d) { return d.Date + ": " + d.event; })
      .direction("s")
      .offset([8, 0]);
    svg.call(tool_tip);

  // skapa
   var defs = svg.append("defs");

   defs.append('pattern')
     .attr("id", "ernstberger")
     .attr("width", 1)
     .attr("height", 1)
     .append("svg:image")
     .attr("xlink:href", "images/ernstberger.PNG")
     .attr("width", 40)
     .attr("height", 40)
     .attr("y", -0)
     .attr("x", -0);

   defs.append('pattern')
     .attr("id", "helikopter")
     .attr("width", 1)
     .attr("height", 1)
     .append("svg:image")
     .attr("xlink:href", "images/helikopter.PNG")
     .attr("width", 40)
     .attr("height", 40)
     .attr("x", -0)
     .attr("y", -0);

  var formatValue = d3.format(",d");

  var x = d3.scaleLinear()
      .rangeRound([0, width-50]);

  //Setup time scale
  var parseTime = d3.timeParse("%Y-%m-%d");
  var x_time = d3.scaleTime()
      .rangeRound([0, width-50]);

  var y_index = d3.scaleLinear()
      .rangeRound([height, 0]);

  var line = d3.line()
      .x(function(d) { return x_time(d.date); })
      .y(function(d) { return y_index(d.index); });

  // convert to date
  indexdata.forEach(function(d){ d.Date = parseTime(d.Date)})
  eventdata.forEach(function(d){
    d.Date = d.date;
    d.date = parseTime(d.date);
  })

  var indexes = ["Allra_Strategi_Lagom", "Allra_Strategi_Modig", "Handelsbanken_Global"].map(function(id) {
    return {
      id: id,
      values: indexdata.map(function(d) {
        if( typeof d[id] == "undefined"){
          return undefined
        }else{
        return {date: d.Date, index: d[id]};
      }
    })
  }})

indexes.forEach(function(d){
d.values = d.values.filter(function(d){return typeof d != "undefined"})
})


  //scale for points w/o time
  x_time.domain(d3.extent(indexdata, function(d) { return d.Date; }));

  y_index.domain([
    d3.min(indexes, function(c) { return d3.min(c.values, function(d) { return d.index; }); }),
    d3.max(indexes, function(c) { return d3.max(c.values, function(d) { return d.index; }); })
  ]);

  //scale for boardmember lines
  var y = d3.scaleLinear()
      .rangeRound([height, 0]);

  var g = svg.append("g")
      .attr("class", "container")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(d3.extent(data, function(d) { return d.value; }));
  y.domain(d3.extent(linedata, function(d) { return d.offset; }));

  var simulation = d3.forceSimulation(eventdata)
      .force("x", d3.forceX(function(d) { return x_time(d.date); }).strength(1))
      .force("y", d3.forceY(height / 2))
      .force("collide", d3.forceCollide(21))
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
      .polygons(eventdata).map(function(d){
        return d.data;
      }
    )

  // gridlines in y axis function
  function make_x_gridlines() {
      return d3.axisTop(x_time)
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

  var index = g.selectAll(".index")
  .data(indexes)
  .enter().append("g")
    .attr("class", "index");

  index.append("path")
      .attr("class", "indexline")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) {
        if(d.id == "Handelsbanken_Global"){
        return "3498db";
       } else {
          return "#e74c3c";
        }
      });

    g.selectAll(".lines")
        .data(linedata)
        .enter()
        .append("line")
        .style("stroke", function(d){ return d.color;})
        .style("opacity", 1)
        .style("stroke-width", 9)
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
          .style("stroke-width", "1")

        var cell = g.append("g")
            .attr("class", "cells")
          .selectAll("g")
          .data(pointdata)
          .enter().append("g");

      //cell.append("path")
      //    .attr("d", function(d) { return "M" + d.join("L") + "Z"; });
      cell.append("circle")
          .attr("r", 20)
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
      .on('mouseout', tool_tip.hide)
      .on("click", function(d){window.open(d.sourcelink) });

      //cell.append("title")
      //    .text(function(d) { return d.id + "\n" + formatValue(d.value); });



//}
