// Set up the chart 
// var svgWidth = 960;
var svgWidth = 800;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100 // 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group and translate by left and top margin
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from data.csv
d3.csv("assets/data/data.csv").then(function(healthData) {

    console.log(healthData);

    // Format the data
    healthData.forEach(function(d) {
      d.healthcare = +d.healthcare;
      d.poverty = +d.poverty;
    });
    
    // Create scale functions
    var xPovertyScale = d3.scaleLinear()
      .domain(d3.extent(healthData, d => d.poverty))
      .range([0, width]);

    var yLackHealthScale = d3.scaleLinear()
      .domain(d3.extent(healthData, d => d.healthcare))
      .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xPovertyScale);
    var leftAxis = d3.axisLeft(yLackHealthScale);

    // Append axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create circles data point
    var circlesGroup = chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", d => xPovertyScale(d.poverty))
      .attr("cy", d => yLackHealthScale(d.healthcare))
      .attr("r", "10")
      .classed("stateText stateCircle", true)
      .attr("opacity", "0.5");
  
// TEXT ADDED CODE STARTED //
    // Add SVG text element
    var circleText = svg.selectAll("text")
      .data(healthData)
      .enter()
      .append("text");

    // Add SVG text element attributes
    var textLabels = circleText
      .attr("x", function(d) { return d.cx; })
      .attr("y", function(d) { return d.cy; })
      .text(d => d.abbr)
      .classed("stateText", true);

// TEXT ADDED CODE ENDED //

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "aText")
      .text("Lack of Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "aText")
      .text("In Poverty (%)");

    // Initialize tool tip -- umm no clue how to even use this so i will just...
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}%<br>Lacks Healthcare: ${d.healthcare}%`);
      });

  // Create tooltip in the chart
  chartGroup.call(toolTip);

  // Create event listeners to display and hide the tooltip
  circlesGroup.on("mouseover", function(d) {
    toolTip.show(d, this);
  })
    // onmouseout event
    .on("mouseout", function(d, index) {
      toolTip.hide(d);
    });


}).catch(function(error) {
console.log(error);
});