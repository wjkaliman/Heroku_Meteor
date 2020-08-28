console.log("hey you");
var svgWidth = 500;
var svgHeight = 500;
var margin = {
  top: 40,
  right: 40,
  bottom: 60,
  left: 100
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
d3.json("http://localhost:5000/api/landingModified")
    .then(function (data) {
      console.log(data);
      console.log(typeof(data))
      console.log(data.data);

      var data_count = d3.nest()
      .key(function(d) {
        return d.year;
      })
      .rollup(function(leaves) {
        return leaves.length;
      })
      .entries(data.data);
    data_count.forEach(function(element) {
       console.log(element);
    });
    var Year = data_count.map(d => d.key);
    console.log(Year);
    var Count = data_count.map(d => d.value);
    console.log(Count);


  var xBandScale = d3.scaleBand()
    .domain(data_count.map(d => d.key))
    .range([0, width])
    .padding(0.1);
  
    // sorting years in an array 
  data_count.sort(function(a, b) {
    return d3.ascending(a.key, b.key)
  })
  xBandScale.domain(data_count.map(function(d) {
    return d.key;
  }));


  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data_count, d => d.value)])
    .range([height, 0]);
  
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xBandScale);
  var leftAxis = d3.axisLeft(yLinearScale).ticks(10);
  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  chartGroup.append("g")
    .call(leftAxis);
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.selectAll(".bar")
    .data(data_count)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xBandScale(d.key))
    .attr("y", d => yLinearScale(d.value))
    .attr("width", xBandScale.bandwidth())
    .attr("height", d => height - yLinearScale(d.value));

    chartGroup.append("text")
    .attr("x", (width / 2))             
    .attr("y", 0 - (margin.top / 2 - 5))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .text("Number of Meteorite Landed on Earth Surface Each Year");

  // Create axes labels
  chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 13})`)
  .attr("text-anchor", "middle")
  .attr("font-size", "16px")
  .attr("fill", "black")
  .style("font-weight", "bold")
  .text("Years");
  chartGroup.append("text")
  .attr("y", 0 - ((margin.left / 2) + 2))
  .attr("x", 0 - (height / 2))
  .attr("text-anchor", "middle")
  .attr("font-size", "16px")
  .attr("fill", "black")
  .style("font-weight", "bold")
  .attr("transform", "rotate(-90)")
  .text("Number of Meteorite");
  });