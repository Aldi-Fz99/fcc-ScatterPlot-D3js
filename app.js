const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const req = new XMLHttpRequest();

let values = [];

let xScale;
let yScale;

const width = 800;
const height = 600;
const padding = 40;

const tooltip = d3.select("#tooltip");

const svg = d3.select("svg")

const drawCanvas = () => {
  svg.attr("width", width)
  svg.attr("height", height)
}

const generateScale = () => {
  xScale = d3.scaleLinear()
             .domain([d3.min(values, (item) => item["Year"]) -1, d3.max(values, (item)=> item["Year"]) +1])
             .range([padding, width - padding])
  
   yScale = d3.scaleTime()
             .domain([d3.min(values, (item)=> new Date(item["Seconds"] * 1000)), d3.max(values, (item) => new Date(item["Seconds"] * 1000))])
             .range([padding, height - padding])
  
}


const drawPoints = () => {
  svg.selectAll("circle")
     .data(values)
     .enter()
     .append("circle")
     .attr("class" , "dot")
     .attr("r" , "5")
     .attr("data-xvalue", (item) => item["Year"])
     .attr("data-yvalue", (item) => new Date(item["Seconds"] * 1000))
     .attr("cx", (item) => xScale(item["Year"]))
     .attr("cy", (item) => yScale(new Date(item["Seconds"] * 1000)))
     .attr("fill",(item) => (item["Doping"] !== "") ? "lightgreen" : "orange")
       .on("mouseover", (event, item) => {
          tooltip.transition()
            .style("visibility", "visible");

          tooltip.html(`Doping: ${item["Doping"]}<br>Year: ${item["Year"]}<br>Time: ${d3.timeFormat("%M:%S")(new Date(item["Seconds"] * 1000))}`)
// Mengatur teks di dalam tooltip
            .style("left", (event.pageX + 5) + "px")  // Posisi horizontal
            .style("top", (event.pageY - 28) + "px");  // Posisi vertikal
        tooltip.attr("data-year", item["Year"]);
        })
        .on("mouseout", () => {
          tooltip.transition()
            .style("visibility", "hidden");
        });
}

const generateAxis = () => {
  let xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.format("d"))
  let yAxis = d3.axisLeft(yScale)
                .tickFormat(d3.timeFormat("%M:%S"))
  
  svg.append('g')
     .call(xAxis)
     .attr("id", "x-axis")
     .attr("transform", "translate(0, " + (height - padding) + ")" )
  
  svg.append("g")
     .call(yAxis)
     .attr("id", "y-axis")
     .attr("transform", "translate(" + padding + ", 0)")
}

req.open("GET", url, true)
req.onload = () => {
   values = JSON.parse(req.responseText)
   console.log(values)
    drawCanvas()
    generateScale()
    drawPoints()
    generateAxis()
}
req.send()
