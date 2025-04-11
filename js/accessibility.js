// accessibility.js

const margin1 = { top: 40, right: 220, bottom: 60, left: 220 },
      width1 = 900 - margin1.left - margin1.right,
      height1 = 500 - margin1.top - margin1.bottom;

const svg1 = d3.select("#chart2-1")
  .attr("width", width1 + margin1.left + margin1.right)
  .attr("height", height1 + margin1.top + margin1.bottom)
  .append("g")
  .attr("transform", `translate(${margin1.left},${margin1.top})`);

const svg2 = d3.select("#chart2-2")
  .attr("width", width1 + margin1.left + margin1.right)
  .attr("height", height1 + margin1.top + margin1.bottom)
  .append("g")
  .attr("transform", `translate(${margin1.left},${margin1.top})`);

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

function renderStackedBarChart(svg, dataPath, categoryKey, width, height) {
  d3.csv(dataPath).then(data => {
    const keys = data.columns.slice(1);
    data.forEach(d => keys.forEach(k => d[k] = +d[k]));

    const color = d3.scaleOrdinal()
      .domain(keys)
      .range(["#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f", "#edc949"]);

    const y = d3.scaleBand()
      .domain(data.map(d => d[categoryKey]))
      .range([0, height])
      .padding(0.3);

    let visibleKeys = new Set(keys);

    const x = d3.scaleLinear()
      .range([0, width]);

    const xAxis = svg.append("g")
      .attr("transform", `translate(0,${height})`);

    const yAxis = svg.append("g");

    const title = svg.append("text")
      .attr("x", 0)
      .attr("y", -20)
      .text(`Model Accessibility by ${categoryKey}`);

    const legend = svg.append("g")
      .attr("transform", `translate(${width + 10}, 0)`);

    svg.append("text")
      .attr("x", width + 10)
      .attr("y", -10)
      .attr("font-size", "12px")
      .style("fill", "#444")
      .text("(Click to toggle visibility)");

    function update() {
      const stackedData = d3.stack()
        .keys([...visibleKeys])
        (data);

      x.domain([0, d3.max(data, d => d3.sum([...visibleKeys], k => d[k]))]);

      svg.selectAll(".bar-group").remove();

      const group = svg.append("g")
        .attr("class", "bar-group")
        .selectAll("g")
        .data(stackedData)
        .join("g")
        .attr("fill", d => color(d.key))
        .attr("data-key", d => d.key);

      group.selectAll("rect")
        .data(d => d.map(p => ({ ...p, key: d.key })))
        .join("rect")
        .attr("y", d => y(d.data[categoryKey]))
        .attr("x", d => x(d[0]))
        .attr("width", d => x(d[1]) - x(d[0]))
        .attr("height", y.bandwidth())
        .on("mouseover", (event, d) => {
          tooltip.transition().duration(200).style("opacity", 0.95);
          tooltip.html(`<strong>${d.data[categoryKey]}</strong><br><em>${d.key}</em><br>Models: ${d[1] - d[0]}`)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", () => {
          tooltip.transition().duration(300).style("opacity", 0);
        });

      xAxis.call(d3.axisBottom(x));
      yAxis.call(d3.axisLeft(y));

      legend.selectAll("g.legend-item").remove();

      keys.forEach((key, i) => {
        const legendItem = legend.append("g")
          .attr("class", "legend-item")
          .attr("transform", `translate(0, ${i * 20 + 10})`)
          .style("cursor", "pointer")
          .on("click", () => {
            if (visibleKeys.has(key)) visibleKeys.delete(key);
            else visibleKeys.add(key);
            update();
          });

        legendItem.append("rect")
          .attr("width", 12)
          .attr("height", 12)
          .attr("fill", visibleKeys.has(key) ? color(key) : "#ccc")
          .attr("stroke", "#666")
          .attr("stroke-width", visibleKeys.has(key) ? 0 : 1)
          .append("title").text(key);

        legendItem.append("text")
          .attr("x", 18)
          .attr("y", 10)
          .text(key.length > 20 ? key.slice(0, 20) + "..." : key)
          .attr("font-size", "12px")
          .attr("fill", visibleKeys.has(key) ? "#000" : "#999")
          .attr("alignment-baseline", "middle")
          .append("title").text(key);
      });
    }

    update();
  });
}

renderStackedBarChart(svg1, "data/model_accessibility_by_top10_countries.csv", "Country (not repeating)", width1, height1);
renderStackedBarChart(svg2, "data/model_accessibility_by_top10_orgs.csv", "Organization", width1, height1);

