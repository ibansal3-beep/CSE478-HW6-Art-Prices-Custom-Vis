(async function () {
  "use strict";

  // ---------------------------------------------------------
  // 1. INITIALIZE THE VISUALIZATION
  // ---------------------------------------------------------

  const svg = d3.select("#viz");
  const tooltip = d3.select("#tooltip");
  const countElement = d3.select("#count");
  const filterButtons = d3.selectAll("button[data-period]");

  const WIDTH = 1320;
  const HEIGHT = 720;

  const periods = [
    "Modern",
    "Post-War",
    "Contemporary"
  ];

  const bands = {
    Modern: [85, 250],
    "Post-War": [255, 450],
    Contemporary: [455, 655]
  };

  const colors = {
    Realism: "#e8bc78",
    Abstract: "#ed8d77",
    Expressionism: "#a7c4b2",
    "Pop Art": "#ddbbdc",
    Conceptual: "#a5c4dc",
    Surrealism: "#e0d787",
    Impressionism: "#d4a887",
    Other: "#b4c0ad"
  };

  const formatPrice = d3.format(",.0f");

  svg.attr("viewBox", `0 0 ${WIDTH} ${HEIGHT}`);

  countElement.text("Loading artworks…");

  // ---------------------------------------------------------
  // 2. LOAD AND VALIDATE THE CSV
  // ---------------------------------------------------------

  const rows = await d3.csv("artDataset.csv", function (row) {
    return {
      id: String(row.id ?? "").trim(),
      artist: String(row.artist ?? "").trim(),
      title: String(row.title ?? "").trim(),
      year: Number(row.year),
      priceUSD: Number(row.priceUSD),
      period: String(row.period ?? "").trim(),
      movement: String(row.movement ?? "").trim()
    };
  });

  const data = rows.filter(function (d) {
    return (
      d.id !== "" &&
      d.artist !== "" &&
      d.title !== "" &&
      Number.isInteger(d.year) &&
      d.year >= 1000 &&
      d.year <= 2026 &&
      Number.isFinite(d.priceUSD) &&
      d.priceUSD > 0 &&
      periods.includes(d.period)
    );
  });

  if (data.length === 0) {
    throw new Error(
      "No valid artwork records were found in artDataset.csv."
    );
  }

  // Normalize missing movement labels.
  data.forEach(function (d) {
    const movement = d.movement.toLowerCase();

    if (
      movement === "" ||
      movement === "[nan]" ||
      movement === "nan" ||
      movement === "null" ||
      movement === "none"
    ) {
      d.movement = "Other";
    }
  });

  // ---------------------------------------------------------
  // 3. CREATE DATA SCALES
  // ---------------------------------------------------------

  const x = d3.scaleLinear()
    .domain([1860, 2025])
    .range([120, 1260]);

  const maxPrice = d3.max(data, d => d.priceUSD);

  const radius = d3.scaleSqrt()
    .domain([0, maxPrice])
    .range([4, 19]);

  function movementColor(d) {
    return colors[d.movement] || colors.Other;
  }

  // ---------------------------------------------------------
  // 4. DETERMINISTIC POSITIONING
  // ---------------------------------------------------------

  /*
   * Hashing keeps artwork positions stable when filters
   * change. This avoids random repositioning between views.
   */

  function hashString(value) {
    let hash = 2166136261;

    for (let i = 0; i < value.length; i++) {
      hash = Math.imul(
        hash ^ value.charCodeAt(i),
        16777619
      );
    }

    return hash >>> 0;
  }

  function artworkPosition(d) {
    const [top, bottom] = bands[d.period];

    const seed = hashString(d.id + "-" + d.title);

    const horizontalJitter = ((seed % 13) - 6) * 1.3;

    const verticalFraction = (seed % 1000) / 1000;

    const verticalPosition =
      top + 40 +
      verticalFraction * (bottom - top - 75);

    return {
      x: x(d.year) + horizontalJitter,
      y: verticalPosition
    };
  }

  // ---------------------------------------------------------
  // 5. CUSTOM FIVE-PETAL FLOWER GLYPH
  // ---------------------------------------------------------

  /*
   * Each flower consists of five individually constructed
   * curved SVG paths and one central circle.
   *
   * These are custom data glyphs rather than a standard
   * D3 chart type.
   */

  function drawFlower(group, r, fill) {
    for (let k = 0; k < 5; k++) {
      const angle = (360 / 5) * k;

      const leftControlX = (-r * 0.46).toFixed(2);
      const rightControlX = (r * 0.46).toFixed(2);

      const controlY = (-r * 0.58).toFixed(2);
      const tipY = (-r * 1.7).toFixed(2);

      const petalPath = [
        "M 0,0",
        `Q ${leftControlX},${controlY} 0,${tipY}`,
        `Q ${rightControlX},${controlY} 0,0`,
        "Z"
      ].join(" ");

      group.append("path")
        .attr("d", petalPath)
        .attr("transform", `rotate(${angle})`)
        .attr("fill", fill)
        .attr("fill-opacity", 0.85)
        .attr("stroke", "#203a33")
        .attr("stroke-width", 0.55);
    }

    group.append("circle")
      .attr("r", Math.max(1.6, r * 0.24))
      .attr("fill", "#f5e8d0");
  }

  // ---------------------------------------------------------
  // 6. TOOLTIP UTILITIES
  // ---------------------------------------------------------

  function escapeHTML(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[character]
    );
  }

  function hideTooltip() {
    tooltip.attr("hidden", true);
  }

  function positionTooltip(event) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const target = event.currentTarget;

    const rect =
      target &&
      typeof target.getBoundingClientRect === "function"
        ? target.getBoundingClientRect()
        : null;

    let pointerX;
    let pointerY;

    if (event.type === "focus" && rect) {
      pointerX = rect.left + rect.width / 2;
      pointerY = rect.top + rect.height / 2;
    } else {
      pointerX = event.clientX ?? viewportWidth / 2;
      pointerY = event.clientY ?? viewportHeight / 2;
    }

    const tooltipNode = tooltip.node();

    const tooltipWidth =
      tooltipNode?.offsetWidth || 300;

    const tooltipHeight =
      tooltipNode?.offsetHeight || 150;

    const left = Math.max(
      8,
      Math.min(
        pointerX + 18,
        viewportWidth - tooltipWidth - 8
      )
    );

    const top = Math.max(
      8,
      Math.min(
        pointerY + 18,
        viewportHeight - tooltipHeight - 8
      )
    );

    tooltip
      .style("left", `${left}px`)
      .style("top", `${top}px`);
  }

  function showTooltip(event, d) {
    tooltip
      .html(
        `
        <strong>${escapeHTML(d.title)}</strong>
        ${escapeHTML(d.artist)}
        <br>
        ${d.year} · ${escapeHTML(d.period)}
        <br>
        ${escapeHTML(d.movement)}
        <br>
        <b>$${formatPrice(d.priceUSD)} USD</b>
        `
      )
      .attr("hidden", null);

    positionTooltip(event);
  }

  // ---------------------------------------------------------
  // 7. DRAW BACKGROUND PERIOD BANDS
  // ---------------------------------------------------------

  function drawPeriodBands() {
    periods.forEach(function (period) {
      const [top, bottom] = bands[period];

      svg.append("rect")
        .attr("x", 14)
        .attr("y", top)
        .attr("width", 1292)
        .attr("height", bottom - top - 5)
        .attr("rx", 4)
        .attr("fill", "#2b423a");

      svg.append("text")
        .attr("x", 30)
        .attr("y", top + 24)
        .attr("font-size", 20)
        .attr("font-family", "Georgia")
        .attr("fill", "#e1e8dc")
        .text(period);
    });
  }

  // ---------------------------------------------------------
  // 8. DRAW YEAR AXIS AND GRID
  // ---------------------------------------------------------

  function drawYearAxis() {
    const ticks = [
      1900,
      1925,
      1950,
      1975,
      2000,
      2025
    ];

    ticks.forEach(function (year) {
      svg.append("line")
        .attr("x1", x(year))
        .attr("x2", x(year))
        .attr("y1", 85)
        .attr("y2", 650)
        .attr("stroke", "#a3b7a8")
        .attr("stroke-opacity", 0.16);

      svg.append("text")
        .attr("x", x(year))
        .attr("y", 692)
        .attr("text-anchor", "middle")
        .attr("fill", "#c1d0c5")
        .attr("font-size", 13)
        .text(year);
    });
  }

  // ---------------------------------------------------------
  // 9. DRAW ARTWORK GLYPHS
  // ---------------------------------------------------------

  function drawArtworks(filteredData) {
    const marks = svg.selectAll(".artwork-glyph")
      .data(filteredData, d => d.id)
      .enter()
      .append("g")
      .attr("class", "artwork-glyph")
      .attr("tabindex", 0)
      .attr("role", "button")
      .attr("aria-label", function (d) {
        return (
          `${d.title} by ${d.artist}, ` +
          `${d.year}, ${d.period}, ` +
          `${d.movement}, ` +
          `$${formatPrice(d.priceUSD)}`
        );
      })
      .attr("transform", function (d) {
        const position = artworkPosition(d);

        return (
          `translate(${position.x},${position.y})`
        );
      });

    marks.each(function (d) {
      drawFlower(
        d3.select(this),
        radius(d.priceUSD),
        movementColor(d)
      );
    });

    marks
      .on("mouseenter", showTooltip)
      .on("mousemove", function (event) {
        positionTooltip(event);
      })
      .on("mouseleave", hideTooltip)
      .on("focus", showTooltip)
      .on("blur", hideTooltip)
      .on("click", showTooltip)
      .on("keydown", function (event, d) {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          showTooltip(event, d);
        }

        if (event.key === "Escape") {
          event.preventDefault();
          hideTooltip();
        }
      });
  }

  // ---------------------------------------------------------
  // 10. RENDER THE COMPLETE VISUALIZATION
  // ---------------------------------------------------------

  function render(selectedPeriod = "All") {
    hideTooltip();

    svg.selectAll("*").remove();

    drawPeriodBands();
    drawYearAxis();

    const filteredData = data.filter(function (d) {
      return (
        selectedPeriod === "All" ||
        d.period === selectedPeriod
      );
    });

    drawArtworks(filteredData);

    countElement.text(
      `${filteredData.length} artworks on view`
    );

    filterButtons
      .classed("active", function () {
        return this.dataset.period === selectedPeriod;
      })
      .attr("aria-pressed", function () {
        return String(
          this.dataset.period === selectedPeriod
        );
      });
  }

  // ---------------------------------------------------------
  // 11. ENABLE PERIOD FILTER INTERACTIONS
  // ---------------------------------------------------------

  filterButtons.on("click", function () {
    const selectedPeriod = this.dataset.period;

    if (
      selectedPeriod === "All" ||
      periods.includes(selectedPeriod)
    ) {
      render(selectedPeriod);
    }
  });

  // ---------------------------------------------------------
  // 12. DRAW LEGEND FLOWER EXAMPLES
  // ---------------------------------------------------------

  const legendSamples = [
    ["#sample-small", 2000],
    ["#sample-mid", 20000],
    ["#sample-big", 100000]
  ];

  legendSamples.forEach(function ([selector, price]) {
    const group = d3.select(selector);

    if (!group.empty()) {
      group.selectAll("*").remove();

      drawFlower(
        group,
        radius(price),
        colors.Abstract
      );
    }
  });

  // ---------------------------------------------------------
  // 13. INITIAL DISPLAY
  // ---------------------------------------------------------

  render("All");

  console.info(
    `The Anatomy of Art's Value: ` +
    `${data.length} artworks successfully loaded.`
  );

})().catch(function (error) {
  console.error("Visualization error:", error);

  d3.select("#count")
    .text("Unable to load artworks");

  const svg = d3.select("#viz");

  svg.selectAll("*").remove();

  svg
    .attr("viewBox", "0 0 1320 720")
    .append("text")
    .attr("x", 660)
    .attr("y", 360)
    .attr("text-anchor", "middle")
    .attr("fill", "#ffffff")
    .attr("font-size", 20)
    .text(
      "Unable to display the collection. Check the browser console."
    );
});
