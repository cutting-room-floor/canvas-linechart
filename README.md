# canvas-linechart

[![build status](https://secure.travis-ci.org/mapbox/canvas-linechart.svg)](http://travis-ci.org/mapbox/canvas-linechart)

## api

    lineChart(elem, width, [[x, value, options?], ... ], baseCurve, [x, label], step);

Options are `end` for omitting the dot and `focus` for highlighting the dot. If `step` is true, stops will not be interpolated.

## install

    npm install --save canvas-linechart
