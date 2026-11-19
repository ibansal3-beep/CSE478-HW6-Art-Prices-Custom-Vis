# Homework 6 — Design Decisions

**Project:** The Anatomy of Art's Value  
**Status:** Working design; rendering and classification still require final verification.

## Museum audience and story
The exhibit is designed for general museum visitors, not technical analysts. Its question is: **How do recorded artwork prices vary across creation years, artistic movements, and periods?** The design intentionally avoids claiming that these attributes *cause* prices.

## Dataset
Source: https://www.kaggle.com/datasets/flkuhm/art-price-dataset

The current processed CSV has the fields `id`, `artist`, `title`, `year`, `priceUSD`, `period`, and `movement`. The page describes a selected subset of **213 artworks**; this count and the described sampling methodology should be checked against the processed file and source before submission.

## Visual grammar
| Data attribute | Current graphical encoding | Design reason |
| --- | --- | --- |
| Price (`priceUSD`) | Five-petal glyph radius on a square-root scale | Makes differences visible without a purely linear size mapping |
| Movement (`movement`) | Petal color, with some categories combined as Other | Supports comparisons between artistic styles |
| Creation year (`year`) | Horizontal position on a year scale | Shows temporal distribution |
| Art period (`period`) | Modern, Post-War, and Contemporary horizontal bands | Groups records within the exhibit |

Each record uses a custom radial flower-like SVG glyph with a central disc. Within period bands, vertical position is spread to reduce overlap; it does **not** encode another variable. The arrangement is not geographic.

## Custom visualization classification
**Proposed: Combinatorial.** The concept integrates a time-positioned and period-banded visual field with bespoke data-driven radial glyphs. D3 v7 creates the SVG paths, scales, and interactions. The professor warns that two ordinary linked charts or a tooltip do not constitute a custom visualization. Before submission, evaluate whether this particular integration is sufficiently substantial; the flower glyph must do more than cosmetically replace scatterplot points.

## Interactions
- Period buttons filter displayed records.
- Hover, keyboard focus, or selection exposes artwork metadata.
- Legend explains size and movement colors.

These interactions aid exploration but do not alone establish custom status.

## Visual direction
Museum editorial design with cream background, dark green visualization field, warm accents, serif headings, and restrained motion. Prioritize readable legend, explanatory annotations, accessible contrast, and an exhibit that communicates even without hovering.

## Originality and attribution
The existing `script.js` describes original SVG flower geometry and does not cite a borrowed D3 example. The D3.js v7 library itself is an external dependency. If any external example code is subsequently incorporated, add its exact URL and a detailed description of modifications to the visible exhibit write-up. Visual inspiration is not source-code reuse.

## Known issues / unresolved decisions
1. Browser screenshots show an empty visualization field and missing sample flowers; this is a release-blocking problem.
2. The screenshot must be replaced with a real, verified browser capture after glyphs render.
3. The source data transformations, number of displayed records, and accuracy of the write-up need a final audit.
4. The combinatorial classification needs a rigorous final review against the professor's custom-visualization requirement.

## Inspiration and conceptual references
- Elijah Meeks: https://medium.com/@Elijah_Meeks/defining-custom-data-visualization-c20a64746d08
- Giorgia Lupi, La Lettura: https://giorgialupi.com/lalettura
- Giorgia Lupi, Visualizing Painters' Lives: https://giorgialupi.com/visualizing-painters-lives
- MoMA, Life Data Visualizations: https://www.moma.org/magazine/articles/309
- OECD Well-being Data Monitor: https://www.oecd.org/en/data/tools/well-being-data-monitor.html#/31111111111
