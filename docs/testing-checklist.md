# Homework 6 — Testing and Submission Checklist

**ASURITE:** ibansal3  
**Important:** A file's presence in GitHub does not prove that the visualization works.

## A. Project structure
- [ ] Repository contains `ibansal3/index.html`.
- [ ] `ibansal3/script.js` and `ibansal3/style.css` exist and are referenced with correct relative paths.
- [ ] `ibansal3/artDataset.csv` exists and is the exact file loaded by D3.
- [ ] `ibansal3/ibansal3.png` is a genuine screenshot of the working exhibit.
- [ ] Documentation lives in `docs/`, outside the Canvas submission folder.

## B. Run the exhibit
From the repository root, start a local server:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/ibansal3/` (not the root directory listing). Do not test CSV loading through `file://`.

- [ ] `index.html` opens with no JavaScript errors.
- [ ] D3.js loads successfully and is version 7 (`d3.version` in console).
- [ ] `artDataset.csv` returns HTTP 200 in the Network panel.
- [ ] No errors appear in the browser console.
- [ ] The main SVG contains visible flower glyphs; the three period bands are **not empty**.
- [ ] The price legend displays sample flowers at all three labeled values.

## C. Data correctness
- [ ] At least 30 distinct artwork records are displayed.
- [ ] The stated count of 213 artworks matches the actual data displayed in the All view.
- [ ] Every glyph represents exactly one record.
- [ ] Price values are numeric, positive, and interpreted in the correct units.
- [ ] Creation years are valid and positioned on the correct scale.
- [ ] Movement colors match the legend, including the Other category.
- [ ] Period band assignment matches each record's period.
- [ ] Filtering changes the count and displayed glyphs consistently.
- [ ] Any data sampling/transformation claims in the write-up are verified.

## D. Interaction and accessibility
- [ ] All periods, Modern, Post-War, and Contemporary filters work.
- [ ] Hovering over a glyph displays its title, artist, year, movement, and price.
- [ ] Keyboard focus can reach and inspect glyphs.
- [ ] Tooltip does not obscure the entire plot or overflow the viewport.
- [ ] Labels and legend remain readable at normal browser zoom.
- [ ] Layout works on a typical laptop screen and a narrower viewport.

## E. Professor's rubric
- [ ] D3 v7 is used.
- [ ] At least three distinct attributes are visually encoded (current plan: four).
- [ ] At least 30 points are represented if using a subset.
- [ ] Custom glyph geometry and composition are substantively different from standard D3 blocks.
- [ ] Exhibit is clearly suitable for museum visitors.
- [ ] Title and concise design description are visible on the page.
- [ ] Marks, channels, and interactions are explained.
- [ ] Custom classification (modded/combinatorial/novel) is explicitly stated and justified.
- [ ] If any existing example code was adapted, its link and detailed modifications are included.

## F. Screenshot and Canvas ZIP
- [ ] Take a screenshot only after the full visualization has rendered.
- [ ] Save the screenshot as `ibansal3.png` in `ibansal3/`.
- [ ] Package the `ibansal3/` folder into `ibansal3.zip`.
- [ ] Extract the ZIP into a new location and verify all paths and files.
- [ ] Submit `ibansal3.zip` to **Canvas**, not GitHub.

## Known release blocker
Screenshots previously showed the exhibit frame, labels, and period bands but **no artwork flowers**. Do not mark browser rendering, screenshot, or submission complete until this is resolved.
