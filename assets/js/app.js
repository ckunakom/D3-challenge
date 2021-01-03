// Create initial header
var title1 = d3.select("#header1")
.append("text")
.text("Poverty");

var title2 = d3.select("#header2")
.append("text")
.text("healthcare");

// Create intial writeup
var trendDefault = d3.select("#trend")
.append("text")
.text("Lack of Healthcare & Poverty");

var writeDefault = d3.select("#write")
.append("text")
.text("States with higher percentage of poverty seem to have higher percentage of population with lack of healthcare.");

// Create a function to resize the chart
function makeResponsive() {

   // if the SVG area isn't empty when the browser loads, remove it and replace it with a resized version of the chart
   var svgArea = d3.select("body").select("svg");

   if (!svgArea.empty()) {
     svgArea.remove();
   }

  // Svg parameters - using the window to make it responsive 
  var svgHeight = window.innerHeight;
  var svgWidth = window.innerWidth;

  // Can't make up my mind on the layout - leaving this for now
  // var svgWidth = 0;
  
  // if (window.innerWidth > 1000) {
  //   svgWidth = 1000  
  // }

  // else {
  //   svgWidth = window.innerWidth;
  // }

  var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 120
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

  // Initial paramaters
  var selectXAxis = "poverty";
  var selectYAxis = "healthcareLow";

  // ---------------- FUNCTION BARRAGE ---------------- //
  // Function for updating x-scale upon click on axis label
  function xScale(healthData, selectXAxis) {
    
    // Create scales
    // If chose axis is 'income', magnify the size by 'unit'
    if (selectXAxis === "income") {
      var unit = 1000;
    }
    else {
      var unit = 1;
    }
    
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d[selectXAxis]) - unit,
        d3.max(healthData, d => d[selectXAxis]) + unit
      ])
      .range([0, width]);

    return xLinearScale;
  }

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

  // Function for updating x-axis data upon click on axis label
  function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
    return xAxis;
  }

  // Function for updating y-axis data upon click on axis label
  function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
    return yAxis;
}

  // Function for updating circles group with a transition to new circles
  function renderCircles(circlesGroup, newXScale, newYScale, selectXAxis, selectYAxis) {
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[selectXAxis]))
      .attr("cy", d => newYScale(d[selectYAxis]));
    return circlesGroup;
  }

  // Function to update position of text in the circle - Tutor's code
  function plotCircleText(circleText, newXScale, newYScale, selectXAxis, selectYAxis) {
    circleText.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[selectXAxis]))
      .attr("y", d => newYScale(d[selectYAxis] - 0.2));
    return circleText;
  }

  // Function for updating circles group with new tooltip
  function updateToolTip(selectXAxis, selectYAxis, circlesGroup) {

    var xLabel = selectXAxis;

    var yLabel = "";
    if (selectYAxis === "healthcareLow") {
      yLabel = "Healthcare";
    }
    else {
      yLabel = selectYAxis;
    }

    // Show tooltip info box  
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .html(function(d) {
        // console.log(d.state);
        return (`<strong>${d.state}</strong><br>${xLabel}: ${d[selectXAxis]}<br>${yLabel}: ${d[selectYAxis]}`);
      });

    circlesGroup.call(toolTip);

    // Add event listener
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

  }

    // Function for updating Chart title
    function chartTitle(selectXAxis, selectYAxis) {
      
      title1.html("");
      var xTitle = selectXAxis[0].toUpperCase() + selectXAxis.substr(1);

      title2.html("");
      var yTtile = "";

      if (selectYAxis === "healthcareLow") {
        yTtile = "healthcare"[0].toUpperCase() + "healthcare".substr(1);
        ;
      }
      else {
        yTtile = selectYAxis[0].toUpperCase() + selectYAxis.substr(1);
      }

      title1.append("text")
      .text(xTitle);
    
      title2.append("text")
      .text(yTtile);


      return(title1, title2)
    }

  // =================================================================================== //
  // Import data from data.csv
  d3.csv("assets/data/data.csv").then(function(healthData) {

      // console.log(healthData);

      // Parse string data into integer
      healthData.forEach(function(d) {        
        // X-Axis
        d.poverty = +d.poverty;
        d.income = +d.income;
        d.age = +d.age;

        // Y-Axis
        d.healthcareLow = +d.healthcareLow;
        d.obesity = +d.obesity;
        d.smokes = +d.smokes;
      });
 
      // xLinearScale function
      var xLinearScale = xScale(healthData, selectXAxis);

      // Use yLinearScale function
      var yLinearScale = yScale(healthData, selectYAxis);

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
        .attr("r", 12)
        .classed("stateCircle", true);
    
      // Add text into the circle data points
      var circleText = chartGroup.selectAll(null)
        .data(healthData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[selectXAxis]))
        .attr("y", d => yLinearScale(d[selectYAxis] - 0.2))
        .text(d => d.abbr)
        .classed("stateText", true);

      // Show the toolTip for the updated data points
      updateToolTip(selectXAxis, selectYAxis, circlesGroup);

      // Update Chart title
      chartTitle(selectXAxis, selectYAxis);

      // Create group for the three x-axis labels
      var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

      // Poverty
      var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .attr("class", "active")
        .text("Poverty (%)");

      // Age
      var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .attr("class", "inactive")
        .text("Age (Median)");

      // Household Income
      var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .attr("class", "inactive")
        .text("Household Income (Median)");
      
      // Create group for the three y-axis labels
      var yLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`)
        .attr("transform", "rotate(-90)")
        .attr("dy", "1em");

      // Lack of Healthcare 
      var lackHealthLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left + 80)
        .attr("x", 0 - (height / 2))
        .attr("value", "healthcareLow")
        .attr("class", "active")
        
        .text("Lack of Healthcare (%)");

      // Obseity
      var obseseLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left + 60)
        .attr("x", 0 - (height / 2))
        .attr("value", "obesity")
        .attr("class", "inactive")
        .text("Obese (%)");

      // Smoke
      var smokeLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("value", "smokes")
        .attr("class", "inactive")
        .text("Smokes (%)");
      
      // Create x-axis labels event listener
      xLabelsGroup.selectAll("text")
        .on("click", function() {

          // Get selected x-axis label
          var xValue = d3.select(this).attr("value");
          
          if (xValue !== selectXAxis) {

            // replaces selectXAxis with value
            selectXAxis = xValue;

            // Update x scale for new data 
            xLinearScale = xScale(healthData, selectXAxis);

            // Update x axis with transition
            xAxis = renderXAxes(xLinearScale, xAxis);

            // Update circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, selectXAxis, selectYAxis);
            
            // Update data points with new text
            circleText = plotCircleText(circleText, xLinearScale, yLinearScale, selectXAxis, selectYAxis);

            // Update tooltips with new info
            updateToolTip(selectXAxis, selectYAxis, circlesGroup);

            // Update Chart title
            chartTitle(selectXAxis, selectYAxis);

            // Changes classes to change bold text
            switch(selectXAxis) {
                case "age":
                  ageLabel
                    .classed("active", true)
                    .classed("inactive", false);
                  povertyLabel
                    .classed("inactive", true);
                  incomeLabel
                    .classed("inactive", true);
                  break;
      
                case "income":
                  incomeLabel
                    .classed("active", true)
                    .classed("inactive", false);
                  ageLabel
                    .classed("inactive", true);
                  povertyLabel
                    .classed("inactive", true);
                  break;
      
                default:
                  incomeLabel
                    .classed("inactive", true);
                  ageLabel
                    .classed("inactive", true);
                  povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
                  break;
            }
          }
      });

      // Create y-axis labels event listener
      yLabelsGroup.selectAll("text")
        .on("click", function() {

          // Get value of selection
          var yValue = d3.select(this).attr("value");
          
          if (yValue !== selectYAxis) {

            // Replaces selectYAxis with value
            selectYAxis = yValue;

            // Update x scale for new data
            yLinearScale = yScale(healthData, selectYAxis);

            // Update x axis with transition
            yAxis = renderYAxes(yLinearScale, yAxis);

            // Update circles with new y values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, selectXAxis, selectYAxis);

            // Update text within the circles
            circleText = plotCircleText(circleText, xLinearScale, yLinearScale, selectXAxis, selectYAxis)

            // Update tooltips with new info
            updateToolTip(selectXAxis, selectYAxis, circlesGroup);

            // Update Chart title
            chartTitle(selectXAxis, selectYAxis);

            // Change classes to change bold text
            switch(selectYAxis) {
              case "obesity":
                obseseLabel
                  .classed("active", true)
                  .classed("inactive", false);
                smokeLabel
                  .classed("inactive", true);
                lackHealthLabel
                  .classed("inactive", true);
                break;

              case "smokes":
                smokeLabel
                  .classed("active", true)
                  .classed("inactive", false);
                obseseLabel
                  .classed("inactive", true);
                lackHealthLabel
                  .classed("inactive", true);
              break;

              default:
                smokeLabel
                  .classed("inactive", true);
                obseseLabel
                  .classed("inactive", true);
                lackHealthLabel
                  .classed("active", true)
                  .classed("inactive", false);
                break;
            }
          }
    });

  }).catch(function(error) {
    console.log(error);
  });

}
  
// Call the function to allow responsive to resizing the window
makeResponsive();

// Event listener for window resize and call makeResponsive
d3.select(window).on("resize", makeResponsive);
window.addEventListener('resize', makeResponsive);