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

// ---------------- X-AXIS ---------------- //
// Initial paramater
var selectXAxis = "poverty";

// Function for updating data points (x-scale) upon click on axis label
function xScale(healthData, selectXAxis) {
  // Create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[selectXAxis]) * 0.8,
      d3.max(healthData, d => d[selectXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
  }

// Function for updating x-scale upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// ---------------- Y-AXIS ---------------- //
// Initial paramater
var selectYAxis = "healthcareLow";

// Function for updating y-scale upon click on axis label
function yScale(healthData, selectYAxis) {
  // Create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[selectYAxis]) * 0.8,
      d3.max(healthData, d => d[selectYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;
  }

// Function for updating y-scale upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// ---------------- Need both X/Y axes ---------------- //
// // Function for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, newYScale, selectXAxis, selectYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[selectXAxis])) //;

  // circlesGroup.transition()
  //   .duration(1000)
    .attr("cy", d => newYScale(d[selectYAxis]));

  return circlesGroup;
}

// MAY NEED THIS BACK AND MAY NEED TO SPLIT X/Y
// Function for updating circles group with a transition to new circles
// function renderXCircles(circlesGroup, newXScale, selectXAxis) {

//   circlesGroup.transition()
//     .duration(1000)
//     .attr("cx", d => newXScale(d[selectXAxis]));

//   return circlesGroup;
// }

// Function for updating circles group with new tooltip
// function updateToolTip(selectXAxis, circlesGroup) {

//   var label = "";
  
//   switch(selectXAxis) {
//     case "poverty":
//       label = "Poverty: ";
//       break;

//     case "age":
//       label = "Age: ";
//       break;

//     default:
//       label = "Household Income: ";
//       break;
//   }

//   var toolTip = d3.tip()
//     .attr("class", "d3-tip")
//     .offset([80, -60])
//     .html(function(d) {
//       return (`${d.state}<br>${label} ${d[selectXAxis]}`);
//     });

//   circlesGroup.call(toolTip);

function updateToolTip(selectXAxis, selectYAxis, circlesGroup) {

  // var xlabel = "";
  
  // switch(selectXAxis) {
  //   case "poverty":
  //     xlabel = "Poverty: ";
  //     break;

  //   case "age":
  //     xlabel = "Age: ";
  //     break;

  //   default:
  //     xlabel = "Household Income: ";
  //     break;
  // }

  // var ylabel = "";

  // switch(selectYAxis) {
  //   case "obesity":
  //     ylabel = "Obese: ";
  //     break;

  //   case "smokes":
  //     ylabel = "Smoke: ";
  //     break;

  //   default:
  //     ylabel = "Lack of Healthcare: ";
  //     break;
  // }

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${xlabel}${d[selectXAxis]}<br>${ylabel}${d[selectYAxis]}%`);
    });
  
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
      d.poverty = +d.poverty;
      d.income = +d.income;
      d.age = +d.age;
      // Y-Axis
      d.healthcare = +d.healthcare;
      d.obesity = +d.obesity;
      d.smokes = +d.smokes;
    });

    
    // Use xLinearScale function --- BONUS CODE ADDED
    var xLinearScale = xScale(healthData, selectXAxis);
    // Create scale functions
    // var xPovertyScale = d3.scaleLinear()
    //   .domain(d3.extent(healthData, d => d.poverty))
    //   .range([0, width]);

    // Use yLinearScale function
    var yLinearScale = yScale(healthData, selectYAxis);
    // var yLackHealthScale = d3.scaleLinear()
    //   .domain(d3.extent(healthData, d => d.healthcareLow))
    //   .range([height, 0]);

    // Create inital axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append axes to the chart
    var xAxis = chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    var yAxis = chartGroup.append("g")
      .call(leftAxis);

    // Create initial circles data point
    var circlesGroup = chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[selectXAxis]))
      .attr("cy", d => yLinearScale(d[selectYAxis]))
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

  // MORE BONUS CODE //
    // Create group for the three x-axis labels
    var xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`)
      .attr("class", "aText");

    // Poverty
    var povertyLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty")
      .attr("class", "aText active")
      .text("In Poverty (%)");

    // Age
    var ageLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age")
      .attr("class", "aText inactive")
      .text("Age (Median)");

    // Household Income
    var incomeLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income")
      .attr("class", "aText inactive")
      .text("Household Income (Median)");

    // Create group for the three y-axis labels
    var ylabelsGroup = chartGroup.append("g")
      .attr("transform", "rotate(-90)")
      .attr("dy", "1em")
      .attr("class", "aText");

    // Lack of Healthcare 
    var lackHealthLabel = ylabelsGroup.append("text")
      .attr("y", 0 - margin.left + 60)
      .attr("x", 0 - (height / 2))
      .attr("value", "healthcareLow")
      .attr("class", "aText active")
      .text("Lack of Healthcare (%)");

    // Obseity
    var obseseLabel = ylabelsGroup.append("text")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("value", "obesity")
      .attr("class", "aText inactive")
      .text("Obese (%)");

    // Smoke
    var smokeLabel = ylabelsGroup.append("text")
      .attr("y", 0 - margin.left + 20)
      .attr("x", 0 - (height / 2))
      .attr("value", "smokes")
      .attr("class", "aText inactive")
      .text("Smokes (%)");
  

    // chartGroup.append("text")
    //   .attr("transform", "rotate(-90)")
    //   .attr("y", 0 - margin.left + 40)
    //   .attr("x", 0 - (height / 2))
    //   .attr("dy", "1em")
    //   .attr("class", "aText")
    //   .text("Lack of Healthcare (%)");

    // chartGroup.append("text")
    //   .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    //   .attr("class", "aText")
    //   .text("In Poverty (%)");

    // Call updateToolTip function earlier
    var circlesGroup = updateToolTip(selectXAxis, circlesGroup);
    // var circlesGroup = updateToolTip(selectXAxis, selectYAxis, circlesGroup);
    
    // Create x-axis labels event listener
    xlabelsGroup.selectAll("text")
      .on("click", function() {

        // Get value of selection
        var value = d3.select(this).attr("value");
        
        if (value !== selectXAxis) {

        // replaces selectXAxis with value
        selectXAxis = value;

        // Update x scale for new data using previously defined function
        xLinearScale = xScale(healthData, selectXAxis);

        // Update x axis with transition using previously defined function
        xAxis = renderXAxes(xLinearScale, xAxis);

        // Update circles with new x values using previously defined function
        circlesGroup = renderCircles(circlesGroup, xLinearScale, selectXAxis);

        // Update tooltips with new info
        circlesGroup = updateToolTip(selectXAxis, circlesGroup);

        // Change classes to change bold text
        switch(selectXAxis) {
          case "age":
            ageLabel
              .classed("active", true)
              .classed("inactive inactive:hover", false);
            povertyLabel
              .classed("active", false)
              .classed("inactive inactive:hover", true);
            incomeLabel
              .classed("active", false)
              .classed("inactive inactive:hover", true);
            break;

          case "income":
            incomeLabel
              .classed("active", true)
              .classed("inactive inactive:hover", false);
            ageLabel
              .classed("active", false)
              .classed("inactive inactive:hover", true);
            povertyLabel
              .classed("active", false)
              .classed("inactive inactive:hover", true);
          break;

          default:
            incomeLabel
              .classed("active", false)
              .classed("inactive inactive:hover", true);
            ageLabel
              .classed("active", false)
              .classed("inactive inactive:hover", true);
            povertyLabel
              .classed("active", true)
              .classed("inactive  inactive:hover", false);
            break;
        }
      }
    
    // Create y-axis labels event listener
    ylabelsGroup.selectAll("text")
      .on("click", function() {

        // Get value of selection
        var value = d3.select(this).attr("value");
        
        if (value !== selectYAxis) {

        // Replaces selectYAxis with value
        selectYAxis = value;

        // Update x scale for new data using previously defined function
        yLinearScale = yScale(healthData, selectYAxis);

        // Update x axis with transition using previously defined function
        yAxis = renderYAxes(yLinearScale, yAxis);

        // Update circles with new x values using previously defined function
        circlesGroup = renderYCircles(circlesGroup, yLinearScale, selectYAxis);

        // Update tooltips with new info
        circlesGroup = updateToolTip(selectYAxis, circlesGroup);

        // Change classes to change bold text
        switch(selectYAxis) {
          case "obesity":
            obseseLabel
              .classed("active", true)
              .classed("inactive inactive:hover", false);
            smokeLabel
              .classed("active", false)
              .classed("inactive inactive:hover", true);
            break;

          case "smokes":
            smokeLabel
              .classed("active", true)
              .classed("inactive inactive:hover", false);
            obseseLabel
              .classed("active", false)
              .classed("inactive inactive:hover", true);
            lackHealthLabel
              .classed("active", false)
              .classed("inactive inactive:hover", true);
          break;

          default:
            smokeLabel
              .classed("active", false)
              .classed("inactive inactive:hover", true);
            obseseLabel
              .classed("active", false)
              .classed("inactive inactive:hover", true);
            lackHealthLabel
              .classed("active", true)
              .classed("inactive  inactive:hover", false);
            break;
        }
      }
    });

    
    });




}).catch(function(error) {
console.log(error);
});