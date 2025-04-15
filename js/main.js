// js/main.js

const renderBarChart = (data, selector, xKey, yKey) => {
  const margin = { top: 30, right: 40, bottom: 70, left: 300 },
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

  const svg = d3.select(selector)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .html("")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Custom tooltip
  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "d3-tooltip")
    .style("position", "absolute")
    .style("padding", "6px 10px")
    .style("background", "rgba(0, 0, 0, 0.8)")
    .style("color", "#fff")
    .style("border-radius", "4px")
    .style("font-size", "13px")
    .style("pointer-events", "none")
    .style("opacity", 0);

  const showTooltip = (event, d) => {
    const total = d3.sum(data, d => d[yKey]);
    const percentage = ((d[yKey] / total) * 100).toFixed(1);
    tooltip.style("opacity", 1)
      .html(`<strong>${d[xKey]}</strong><br/>Models: ${d[yKey]}<br/>(${percentage}%)`)
      .style("left", `${event.pageX + 10}px`)
      .style("top", `${event.pageY - 28}px`);
  };

  const hideTooltip = () => {
    tooltip.style("opacity", 0);
  };

  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d[yKey])])
    .range([0, width]);

  const y = d3.scaleBand()
    .domain(data.map(d => d[xKey]))
    .range([0, height])
    .padding(0.2);

  svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .style("font-size", "12px")
    .style("text-anchor", "end")
    .on("mouseover", function (event, dText) {
      const datum = data.find(d => d[xKey] === dText);
      if (datum) showTooltip(event, datum);
    })
    .on("mouseout", hideTooltip);

  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(5))
    .selectAll("text")
    .attr("transform", "translate(0,5)")
    .style("text-anchor", "middle");

  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", d => y(d[xKey]))
    .attr("width", d => x(d[yKey]))
    .attr("height", y.bandwidth())
    .attr("fill", "#69b3a2")
    .on("mouseover", showTooltip)
    .on("mousemove", showTooltip)
    .on("mouseout", hideTooltip);
};

const loadAndRender = () => {
  d3.csv("data/notable_ai_models_cleaned.csv").then(data => {
    const countBy = (key) => {
      return Array.from(
        d3.rollup(data, v => v.length, d => d[key])
      ).filter(([k, v]) => k && k !== "")
       .sort((a, b) => d3.descending(a[1], b[1]))
       .slice(0, 15)
       .map(([k, v]) => ({ name: k, count: v }));
    };

    const domainData = countBy("Domain");
    const orgData = countBy("Organization");
    const countryData = countBy("Country (not repeating)");

    renderBarChart(domainData, "#chart1-1", "name", "count");
    renderBarChart(orgData, "#chart1-2", "name", "count");
    renderBarChart(countryData, "#chart1-3", "name", "count");
  });
};

loadAndRender();
