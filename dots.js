//drawer = function(data, indata){
  var margin = {top: 10, right: 10, bottom: 10, left: 10},
      width = 600 - margin.left - margin.right,
      height = 150 - margin.top - margin.bottom,
      svg = d3.select(".plot")
                 .append("svg")
                 .attr("preserveAspectRatio", "xMinYMin meet")
                 .attr("viewBox","0 5 " + (width + 50)  + " " + (height+50))
                   //class to make it responsive
                 .classed("svg-content-responsive", true);

   var defs = svg.append("defs");

   defs.append('pattern')
     .attr("id", "dog")
     .attr("width", 1)
     .attr("height", 1)
     .append("svg:image")
     .attr("xlink:href", "http://cdn2-www.dogtime.com/assets/uploads/2010/12/senior-dog-2.jpg")
     .attr("width", 50)
     .attr("height", 50)
     .attr("y", -20)
     .attr("x", -20);

   defs.append('pattern')
     .attr("id", "cat")
     .attr("width", 1)
     .attr("height", 1)
     .append("svg:image")
     .attr("xlink:href", "https://s-media-cache-ak0.pinimg.com/736x/92/9d/3d/929d3d9f76f406b5ac6020323d2d32dc.jpg")
     .attr("width", 120)
     .attr("height", 120)
     .attr("x", -30)
     .attr("y", -10);

  var formatValue = d3.format(",d");

  var x = d3.scaleLinear()
      .rangeRound([0, width]);

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
      return d3.axisBottom(x)
          .ticks(5)
  }

  // add the X gridlines
  g.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + height + ")")
    .call(make_x_gridlines()
        .tickSize(-height)
        //.tickFormat(".3")
    )

    g.selectAll(".lines")
        .data(linedata)
        .enter()
        .append("line")
        .style("stroke", "orange")
        .style("opacity", 1)
        .style("stroke-width", 7)
        .style("stroke-linecap", "round")
        .attr("x1", function(d) {return x(d.start);})
        .attr("y1", function(d) {return y((d.offset-2)/5 + 2);})
        .attr("x2", function(d) {return x(d.stop);})
        .attr("y2", function(d) {return y((d.offset-2)/5 + 2);});

        //remove horixontal line
        d3.select(".domain").remove()
        d3.selectAll(".tick").selectAll("line").style("stroke-dasharray", "1,1")

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
     return i%2 === 0 ? "url(#dog)" : "url(#cat)"
     });

      cell.append("title")
          .text(function(d) { return d.id + "\n" + formatValue(d.value); });



//}
