var xtend = require('xtend'),
  linearScale = require('simple-linear-scale'),
  clamp = require('clamp'),
  util = require('./util'),
  getControlPoints = require('./get_control_points');

module.exports = canvasLineChart;

/**
 * @param {Canvas} c canvas element
 * @param {number} height
 * @param {number} width
 * @param {Array<Array<number>>} data, as [zoom, val] doubles
 * @param {number} base mathematical base, a number between 0 and 1
 * @param {Object} options
 * @param {number} [options.options.scaleFactor=1] dpi ratio
 * @param {number} [options.min=0] minimum x value
 * @param {number} [options.max=22] maximum y value
 * @param {number} [options.tickSize=1] space between each tick mark
 * @param {Array<number>} options.marker a marker as a [zoom, val] pair
 * @param {boolean} options.step whether to represent the chart as stair-steps
 * rather than an interpolated line.
 */
function canvasLineChart(c, width, height, data, base, options) {

  options = xtend({
    scaleFactor: 1,
    tickSize: 1,
    min: 0,
    max: 22
  }, options);

  width *= options.scaleFactor;
  height *= options.scaleFactor;

  var margin = 12 * options.scaleFactor;
  var values = data.map(function(d) { return d[1]; });

  var xScaleRaw = linearScale(
    [options.min, options.max],
    [margin, width - margin]);

  var xScale = function(v) {
    return ~~xScaleRaw(v);
  };

  var chartHeight = height - (margin * options.scaleFactor);

  var yScale = linearScale([util.min(values), util.max(values)],
    [chartHeight, margin]);

  c.width = width;
  c.height = height;
  c.style.width = width / options.scaleFactor + 'px';
  c.style.height = height / options.scaleFactor + 'px';
  var markerOffset = 10 * options.scaleFactor;
  var fontSize = 10 * options.scaleFactor;

  var ctx = c.getContext('2d');
  ctx.fillStyle = 'transparent';
  ctx.fillRect(0, 0, width, height);

  // draw [steps] axis ticks
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  for (var i = options.min; i <= options.max; i += options.tickSize) {
    ctx.fillRect(xScale(i), 0, 2 * options.scaleFactor, chartHeight + margin);
  }

  // draw the data line
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 2 * options.scaleFactor;

  data.forEach(function(d, i) {
    if (i === 0) ctx.lineTo(xScale(d[0]), yScale(d[1]));
    else if (options.step) {
      ctx.lineTo(xScale(d[0]), yScale(data[i - 1][1]));
      ctx.lineTo(xScale(d[0]), yScale(d[1]));
    } else {
      var cp = getControlPoints(data[i - 1], d, base);
      ctx.bezierCurveTo(xScale(cp[0][0]), yScale(cp[0][1]),
        xScale(cp[1][0]), yScale(cp[1][1]),
        xScale(d[0]), yScale(d[1]));
    }
  });
  ctx.stroke();

  if (options.marker) {
    ctx.fillStyle = '#ddd';
    ctx.fillRect(xScale(options.marker[0]), 0, 1.5 * options.scaleFactor, chartHeight + margin);
  }

  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#222';

  data.forEach(function(data) {
    // Draw circle
    ctx.beginPath();
    ctx.lineWidth = 2 * options.scaleFactor;
    var r = 3 * options.scaleFactor;
    if (data[2] && data[2].focus) {
      ctx.lineWidth = 3 * options.scaleFactor;
      r = 5 * options.scaleFactor;
    }
    if (!data[2] || !data[2].end) {
      ctx.arc(xScale(data[0]), yScale(data[1]), r, 0, (2 * Math.PI) * options.scaleFactor, false);
    }
    ctx.fill();
    ctx.stroke();

    // Draw text
    ctx.fillStyle = '#ddd';
    ctx.font = fontSize + 'px Menlo, monospace';
    ctx.textAlign = 'center';
    if (!data[2] || !data[2].end) {
      ctx.fillText(data[0], xScale(data[0]), chartHeight + margin);
    }
  });

  if (options.marker) {
    var xAnchor = clamp(xScale(options.marker[0]), options.max, width - options.max);
    ctx.fillStyle = '#ddd';
    ctx.font = 'bold' + fontSize + 'px Menlo, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('' + options.marker[1], xAnchor, chartHeight + markerOffset);
  }
}
