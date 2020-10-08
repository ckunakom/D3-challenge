// Set up the chart 
var svgWidth = 960;
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

// Append SVG group
  var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// ADD BONUS CODE HERE //
// Initial paramater
var selectXAxis = "poverty";

// Function for updating data points (x-scale) upon click on axis label
function xScale(healthData, selectXAxis) {
  // Create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(hairData, d => d[selectXAxis]) * 0.8,
      d3.max(healthData, d => d[selectXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

// Function for updating x-scale upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, selectXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[selectXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  var label;

  if (chosenXAxis === "hair_length") {
    label = "Hair Length:";
  }
  else {
    label = "# of Albums:";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.rockband}<br>${label} ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// ADD BONUS CODE ENDED HERE //

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
      .classed("stateText stateCircle", true);
  
// TEXT ADDED CODE STARTED //
    // Add SVG text element attributes
    chartGroup.selectAll("text")
      .append("text")
      .attr("x", d => d.poverty)
      .attr("y", d => d.healthcare)
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