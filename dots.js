//drawer = function(data, indata){
  var margin = {top: 10, right: 40, bottom: 10, left: 40},
      margin2 = {top: 10, right: 40, bottom: 0, left: 40},
      width = 800 - margin.left - margin.right,
      height = 350 - margin.top - margin.bottom,
      height2 = 70 -margin2.top -margin2.bottom,
      svg = d3.select(".plot")
                 .append("svg")
                 .attr("preserveAspectRatio", "xMinYMin meet")
                 .attr("viewBox","0 5 " + (width + 50)  + " " + (height + 50))
                   //class to make it responsive
                 .classed("svg-content-responsive", true);

     svg2 = d3.select(".plot")
                .append("svg")
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox","0 5 " + (width + 50)  + " " + (height2 + 50))
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

   defs.append('pattern')
     .attr("id", "bodstrom")
     .attr("width", 1)
     .attr("height", 1)
     .append("svg:image")
     .attr("xlink:href", "images/bodstrom.PNG")
     .attr("width", 40)
     .attr("height", 40)
     .attr("x", -0)
     .attr("y", -0);

   defs.append('pattern')
     .attr("id", "kammarratten")
     .attr("width", 1)
     .attr("height", 1)
     .append("svg:image")
     .attr("xlink:href", "images/kammarratten.PNG")
     .attr("width", 40)
     .attr("height", 40)
     .attr("x", -0)
     .attr("y", -0);

   defs.append('pattern')
     .attr("id", "lindso")
     .attr("width", 1)
     .attr("height", 1)
     .append("svg:image")
     .attr("xlink:href", "images/lindso.jpeg")
     .attr("width", 40)
     .attr("height", 40)
     .attr("x", -0)
     .attr("y", -0);


   defs.append('pattern')
     .attr("id", "pensionsmyndigheten")
     .attr("width", 1)
     .attr("height", 1)
     .append("svg:image")
     .attr("xlink:href", "images/pensionsmyndigheten.PNG")
     .attr("width", 40)
     .attr("height", 40)
     .attr("x", -0)
     .attr("y", -0);

   defs.append('pattern')
     .attr("id", "kronofogden")
     .attr("width", 1)
     .attr("height", 1)
     .append("svg:image")
     .attr("xlink:href", "images/kronofogden.PNG")
     .attr("width", 40)
     .attr("height", 40)
     .attr("x", -0)
     .attr("y", -0);

   defs.append('pattern')
     .attr("id", "axen")
     .attr("width", 1)
     .attr("height", 1)
     .append("svg:image")
     .attr("xlink:href", "images/axen.jpg")
     .attr("width", 40)
     .attr("height", 40)
     .attr("x", -0)
     .attr("y", -0);

   defs.append('pattern')
     .attr("id", "alandsbanken")
     .attr("width", 1)
     .attr("height", 1)
     .append("svg:image")
     .attr("xlink:href", "images/alandsbanken.jpg")
     .attr("width", 40)
     .attr("height", 40)
     .attr("x", -0)
     .attr("y", -0);

   defs.append('pattern')
     .attr("id", "allra")
     .attr("width", 1)
     .attr("height", 1)
     .append("svg:image")
     .attr("xlink:href", "images/allra.png")
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
  var x_time2 = d3.scaleTime()
      .rangeRound([0, width-50]);

  var y_index = d3.scaleLinear()
      .rangeRound([height, 0]);
  var y_index2 = d3.scaleLinear()
      .rangeRound([height2, 0]);

  var line = d3.line()
      .x(function(d) { return x_time(d.date); })
      .y(function(d) { return y_index(d.index); });

  var line2 = d3.line()
      .x(function(d) { return x_time2(d.date); })
      .y(function(d) { return y_index2(d.index); });

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
  x_time2.domain(d3.extent(indexdata, function(d) { return d.Date; }));

  y_index.domain([
    d3.min(indexes, function(c) { return d3.min(c.values, function(d) { return d.index; }); }),
    d3.max(indexes, function(c) { return d3.max(c.values, function(d) { return d.index; }); })
  ]);
  y_index2.domain([
    d3.min(indexes, function(c) { return d3.min(c.values, function(d) { return d.index; }); }),
    d3.max(indexes, function(c) { return d3.max(c.values, function(d) { return d.index; }); })
  ]);

  //scale for boardmember lines
  var y = d3.scaleLinear()
      .rangeRound([height, 0]);

  var g = svg.append("g")
      .attr("class", "container")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var context = svg2.append("g")
      .attr("class", "container")
      .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


  x.domain(d3.extent(data, function(d) { return d.value; }));
  y.domain(d3.extent(linedata, function(d) { return d.offset; }));

  var simulation = d3.forceSimulation(eventdata)
      .force("x", d3.forceX(function(d) { return x_time(d.date); }).strength(1))
      .force("y", d3.forceY(height / 2))
      .force("collide", d3.forceCollide(21))
      .stop();

  for (var i = 0; i < 300; ++i) simulation.tick();

// skapa brush och zoom
  var brush = d3.brushX()
      .extent([[0, 0], [width, height2]])
      .on("brush end", brushed);

  var zoom = d3.zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[0, 0], [width, height]])
      .extent([[0, 0], [width, height]])
      .on("zoom", zoomed);


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

  function make_x_gridlines2() {
      return d3.axisTop(x_time2)
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

  context.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0," + height2 + ")")
      .call(make_x_gridlines2()
          .tickSize(height2- margin2.top)
          //.tickFormat(".3")
      )

  context.append("g")
    .attr("class", "brush")
    .call(brush)
    .call(brush.move, x_time.range());


  var index = g.selectAll(".index")
  .data(indexes)
  .enter().append("g")
    .attr("class", "index");

  var index2 = context.selectAll(".index2")
  .data(indexes)
  .enter().append("g")
    .attr("class", "index2");

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

  index2.append("path")
      .attr("class", "indexline")
      .attr("d", function(d) { return line2(d.values); })
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
    d3.selectAll(".domain").remove()
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
        .attr("fill", function(d){
          return d.url;
        })
        .on('mouseover', tool_tip.show)
        .on('mouseout', tool_tip.hide)
        .on("click", function(d){window.open(d.sourcelink)});

      //cell.append("title")
      //    .text(function(d) { return d.id + "\n" + formatValue(d.value); });

      function brushed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
        var s = d3.event.selection || x_time2.range();
        x.domain(s.map(x_time2.invert, x_time2));
        //g.select(".area").attr("d", area);
        //g.select(".axis--x").call(xAxis);

        g.select(".grid").call(make_x_gridlines()
            .tickSize(height- margin.top)
            //.tickFormat(".3")
        )
        d3.selectAll(".domain").remove();
        d3.selectAll(".tick").selectAll("line")
          .style("stroke-dasharray", "1,1")
          .style("stroke-width", "1");
        svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
            .scale(width / (s[1] - s[0]))
            .translate(-s[0], 0));
      }

      function zoomed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
        var t = d3.event.transform;
        x_time.domain(t.rescaleX(x_time2).domain());
        //g.select(".area").attr("d", area);
        //g.select(".axis--x").call(xAxis);

        g.select(".grid").call(make_x_gridlines()
            .tickSize(height- margin.top)
            //.tickFormat(".3")
        );
        d3.selectAll(".domain").remove();
        d3.selectAll(".tick").selectAll("line")
          .style("stroke-dasharray", "1,1")
          .style("stroke-width", "1");
        context.select(".brush").call(brush.move, x_time.range().map(t.invertX, t));
      }

      svg.append("rect")
          .attr("class", "zoom")
          .attr("width", width)
          .attr("height", height)
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .call(zoom);



//}
