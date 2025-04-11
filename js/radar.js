(() => {
    const width = 600, height = 600, margin = 60;
    const radius = Math.min(width, height) / 2 - margin;
    const levels = 5;
  
    const svg = d3.select("#radar-chart")
      .append("svg")
      .attr("width", width + margin * 2)
      .attr("height", height + margin * 2)
      .append("g")
      .attr("transform", `translate(${(width / 2 + margin) - 80},${height / 2 + margin - 40})`);
  
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "d3-tooltip")
      .style("position", "absolute")
      .style("background", "#333")
      .style("color", "#fff")
      .style("padding", "6px 10px")
      .style("border-radius", "4px")
      .style("font-size", "13px")
      .style("pointer-events", "none")
      .style("opacity", 0);
  
    const legendContainer = d3.select("#radar-legend");
  
    d3.csv("data/Merged_AI_data.csv").then(rawData => {
      const axes = rawData.columns.filter(d => d !== "Country");
      const angleSlice = (Math.PI * 2) / axes.length;
  
      const normalizedData = rawData.map(d => {
        const norm = { Country: d.Country };
        axes.forEach(axis => {
          const max = d3.max(rawData, r => +r[axis]);
          norm[axis] = +d[axis] / max;
        });
        return norm;
      });
  
      const countries = normalizedData.map(d => d.Country);
      const select1 = d3.select("#country1-select");
      const select2 = d3.select("#country2-select");
  
      select1.selectAll("option")
        .data(countries)
        .join("option")
        .attr("value", d => d)
        .text(d => d);
  
      select2.selectAll("option")
        .data(countries)
        .join("option")
        .attr("value", d => d)
        .text(d => d);
  
      const axisDescriptions = {
        "Talent": "Availability of skilled practitioners for AI.",
        "Infrastructure": "Scale and reliability of internet/electricity/supercomputing.",
        "Operating Environment": "Regulation and public support for AI.",
        "Research": "Volume and impact of academic research.",
        "Development": "Progress in core platforms and algorithms.",
        "Government Strategy": "National investment and policy plans.",
        "Commercial": "Startup and industry innovation in AI.",
        "Notable Models": "Number of influential AI models created.",
        "Publications": "Volume of AI academic publications.",
        "Investment (USD Billion)": "Capital investment in AI (in billions)."
      };
  
      const line = d3.line().curve(d3.curveLinearClosed);
  
      const drawAxes = () => {
        for (let level = 0; level <= levels; level++) {
          const r = radius * level / levels;
          svg.append("circle")
            .attr("class", "grid-circle")
            .attr("r", r)
            .style("fill", "none")
            .style("stroke", "#ccc")
            .style("stroke-dasharray", "2,2")
            .style("stroke-opacity", 0.5);
  
          svg.append("text")
            .attr("x", 5)
            .attr("y", -r)
            .attr("dy", "-0.3em")
            .attr("font-size", "10px")
            .attr("fill", "#666")
            .text(`${(level / levels) * 100}%`);
        }
  
        axes.forEach((axis, i) => {
          const angle = angleSlice * i - Math.PI / 2;
          svg.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", radius * Math.cos(angle))
            .attr("y2", radius * Math.sin(angle))
            .attr("stroke", "#999");
  
          svg.append("text")
            .attr("class", "axis-label")
            .attr("x", (radius + 10) * Math.cos(angle))
            .attr("y", (radius + 10) * Math.sin(angle))
            .attr("text-anchor", "middle")
            .attr("font-size", "13px")
            .text(axis)
            .on("mouseover", function () {
              tooltip.transition().duration(200).style("opacity", 0.95);
              tooltip.html(`<strong>${axis}</strong><br>${axisDescriptions[axis]}`)
                .style("left", `${d3.event.pageX + 10}px`)
                .style("top", `${d3.event.pageY - 28}px`);
            })
            .on("mouseout", () => tooltip.transition().duration(300).style("opacity", 0));
        });
      };
  
      const updateRadar = (country1, country2) => {
        svg.selectAll(".radar-area, .radar-circle, .axis-label, .grid-circle, .legend, .radar-text").remove();
        drawAxes();
  
        const dataPoints = [
          { country: country1, color: "#ffa600" },
          { country: country2, color: "#003f5c" }
        ];
  
        legendContainer.html("");
        dataPoints.forEach(({ country, color }) => {
          legendContainer.append("div")
            .attr("class", "legend-item")
            .style("margin-right", "15px")
            .style("display", "inline-block")
            .html(`<span style="display:inline-block;width:12px;height:12px;background:${color};margin-right:6px;"></span>${country}`);
        });
  
        dataPoints.forEach(({ country, color }, i) => {
          const countryData = normalizedData.find(d => d.Country === country);
          const rawCountryData = rawData.find(d => d.Country === country);
          if (!countryData || !rawCountryData) return;
  
          const coords = axes.map((axis, i) => [
            radius * countryData[axis] * Math.cos(angleSlice * i - Math.PI / 2),
            radius * countryData[axis] * Math.sin(angleSlice * i - Math.PI / 2)
          ]);
  
          const path = svg.append("path")
            .datum(coords)
            .attr("class", "radar-area")
            .attr("fill", d3.color(color).brighter(1.2))
            .attr("stroke", color)
            .attr("stroke-width", 2)
            .attr("fill-opacity", 0.4)
            .attr("d", line);
  
          path.transition()
            .duration(1000)
            .attrTween("d", function () {
              const previous = d3.select(this).attr("d");
              const current = line(coords);
              return d3.interpolatePath(previous, current);
            });
  
          svg.selectAll(`.radar-circle-${i}`)
            .data(coords)
            .join("circle")
            .attr("class", `radar-circle radar-circle-${i}`)
            .attr("cx", d => d[0])
            .attr("cy", d => d[1])
            .attr("r", 3)
            .attr("fill", color)
            .on("mouseover", function (event, d) {
              const index = coords.indexOf(d);
              const axis = axes[index];
              const value = Math.round(countryData[axis] * 100);
              tooltip.transition().duration(200).style("opacity", 0.95);
              tooltip.html(`<strong>${country}</strong><br><strong>${axis}</strong><br>${axisDescriptions[axis]}<br><strong>${value}%</strong>`)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 28}px`);
            })
            .on("mouseout", () => tooltip.transition().duration(300).style("opacity", 0));
  
          svg.selectAll(`.radar-text-${i}`)
            .data(coords)
            .join("text")
            .attr("class", `radar-text radar-text-${i}`)
            .attr("x", d => d[0])
            .attr("y", d => d[1] - 5)
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .attr("fill", color)
            .text((d, j) => `${Math.round(countryData[axes[j]] * 100)}%`);
        });
      };
  
      select1.on("change", function () {
        updateRadar(this.value, select2.property("value"));
      });
      select2.on("change", function () {
        updateRadar(select1.property("value"), this.value);
      });
  
      select1.property("value", "United States");
      select2.property("value", "China");
      updateRadar("United States", "China");
    });
  })();
  