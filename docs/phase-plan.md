# Homework 6 — Custom Visualization: Phase Plan

**Student / ASURITE:** ibansal3  
**Course:** CSE 478 — Data Visualization  
**Project:** The Anatomy of Art's Value  
**Dataset:** Kaggle Art Price Dataset (`artDataset.csv`)  
**Submission:** `ibansal3.zip` on Canvas, not GitHub

## Objective
Create an informative and visually engaging museum exhibit using **D3.js v7**. The visualization must be a genuinely custom **modded, combinatorial, or novel** design under the framework in Elijah Meeks's *Defining Custom Data Visualization*. It must encode at least **three attributes** and, when showing a subset, at least **30 data points**.

## Phase 1 — Requirements and research
- [x] Record assignment rules and Canvas deliverables.
- [x] Select Art Prices dataset and ASURITE ID.
- [x] Identify visual inspiration: Giorgia Lupi, MoMA, OECD, and Elijah Meeks.
- [ ] Confirm final design is more than a standard D3 block with decorative glyphs.

**Exit criterion:** Written concept and rubric mapped to implementation.

## Phase 2 — Dataset audit
- [x] Prepare a processed `artDataset.csv` for the exhibit.
- [ ] Independently verify record count, selection method, price units, missing values, date parsing, and category coverage.
- [ ] Verify the source-to-processed data transformations are accurately documented.

**Exit criterion:** At least 30 valid, distinct displayed records; selection supports exhibit story.

## Phase 3 — Custom visualization design
- [x] Draft a custom five-petal radial artwork glyph concept.
- [x] Define proposed channels: glyph size = price; color = movement; horizontal position = creation year; period band = art period.
- [ ] Assess whether the final visual grammar is sufficiently original and genuinely combinatorial under the professor's warning.
- [ ] Confirm legend examples accurately reflect the price scale.

**Exit criterion:** Custom graphic is meaningful and legible without interaction.

## Phase 4 — Museum visual design
- [x] Implement editorial typography, exhibit title, introduction, legend, and curatorial note.
- [ ] Correct any crowded labels and ensure responsive layout.
- [ ] Review readability, contrast, and visual hierarchy on desktop and smaller screens.

**Exit criterion:** Visitors can understand the question and basic encodings at a glance.

## Phase 5 — D3.js v7 implementation
- [x] Add D3 v7 CDN reference and original SVG glyph code.
- [x] Implement local CSV loading, period filters, and glyph-detail tooltip code.
- [ ] Verify that glyphs actually render in the browser; screenshots showed an empty plot.
- [ ] Verify keyboard focus, filters, interactions, and failure states.

**Exit criterion:** All intended glyphs render, with working data-driven channels and interactions.

## Phase 6 — Write-up and attribution
- [x] Include visible title, marks, channels, interactions, category, and rationale in `index.html`.
- [ ] Audit write-up against actual behavior and exact dataset selection.
- [ ] Disclose any imported example code and detailed modifications if applicable.

**Exit criterion:** All written claims match the submitted code and data.

## Phase 7 — Testing and screenshot
- [ ] Test from a local web server rather than opening `file://` directly.
- [ ] Check browser console/network for D3 and CSV errors.
- [ ] Verify data count and all four encodings.
- [ ] Capture a genuine screenshot of the rendered exhibit named `ibansal3.png`.

**Exit criterion:** Screenshot visibly shows actual data glyphs and no blocking errors.

## Phase 8 — Canvas packaging
- [ ] Ensure `ibansal3/` contains `index.html`, `script.js`, `style.css`, processed `artDataset.csv`, and final `ibansal3.png`.
- [ ] Test relative paths from inside the submission folder.
- [ ] Create `ibansal3.zip` containing the `ibansal3/` directory.
- [ ] Upload the ZIP to Canvas.

**Exit criterion:** Validated ZIP submitted to Canvas. GitHub README polish comes afterward.

## Reference links
- https://medium.com/@Elijah_Meeks/defining-custom-data-visualization-c20a64746d08
- https://giorgialupi.com/lalettura
- https://giorgialupi.com/visualizing-painters-lives
- https://www.moma.org/magazine/articles/309
- https://www.oecd.org/en/data/tools/well-being-data-monitor.html#/31111111111
