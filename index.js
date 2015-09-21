var defined = require('defined'),
  clamp = require('clamp'),
  getControlPoints = require('./get_control_points');

module.exports = canvasLineChart;

function canvasLineChart(c, height, width, data, base, marker, step, stepSize, min, max, scaleFactor) {

  stepSize = defined(stepSize, 1);
  min = defined(min, 0);
  max = defined(max, 20);

  scaleFactor = defined(scaleFactor, 1);
  width *= scaleFactor;
  height *= scaleFactor;

  var margin = 12 * scaleFactor;
  var chartHeight = height - (margin * scaleFactor);
  c.width = width;
  c.height = height;
  // node-canvas doesn't expose a style object
  if (c.style) {
    c.style.width = width / scaleFactor + 'px';
    c.style.height = height / scaleFactor + 'px';
  }
  var textOffset = margin;
  var markerOffset = 10 * scaleFactor;
  var fontSize = 10 * scaleFactor;

  var ctx = c.getContext('2d');
  ctx.fillStyle = 'transparent';
  ctx.fillRect(0, 0, width, height);

  // draw [steps] axis ticks
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  for (var i = min; i <= max; i += stepSize) {
    ctx.fillRect(xScale(i), 0, 2 * scaleFactor, chartHeight + margin);
  }

  var yScale = (function() {
    var yMax = data.reduce(function(memo, d) {
      return Math.max(d[1], memo);
    }, -Infinity);
    var yMin = data.reduce(function(memo, d) {
      return Math.min(d[1], memo);
    }, Infinity);
    return function(_) {
      var scaled = (_ - yMin) / ((yMax - yMin) || 1);
      return (chartHeight - (scaled * (chartHeight - margin)));
    };
  })();

  function xScale(_) {
    return ~~(((_ / max) * (width - margin)) + margin / 2);
  }

  // draw the data line
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 2 * scaleFactor;

  data.forEach(function(d, i) {
    if (i === 0) ctx.lineTo(xScale(d[0]), yScale(d[1]));
    else if (step) {
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

  if (marker) {
    ctx.fillStyle = '#ddd';
    ctx.fillRect(xScale(marker[0]), 0, 1.5 * scaleFactor, chartHeight + margin);
  }

  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#222';

  data.forEach(function(data) {
    // Draw circle
    ctx.beginPath();
    ctx.lineWidth = 2 * scaleFactor;
    var r = 3 * scaleFactor;
    if (data[2] && data[2].focus) {
      ctx.lineWidth = 3 * scaleFactor;
      r = 5 * scaleFactor;
    }
    if (!data[2] || !data[2].end) {
      ctx.arc(xScale(data[0]), yScale(data[1]), r, 0, (2 * Math.PI) * scaleFactor, false);
    }
    ctx.fill();
    ctx.stroke();

    // Draw text
    ctx.fillStyle = '#ddd';
    ctx.font = fontSize + 'px Menlo, monospace';
    ctx.textAlign = 'center';
    if (!data[2] || !data[2].end) {
      ctx.fillText(data[0], xScale(data[0]), chartHeight + textOffset);
    }
  });

  if (marker) {
    var xAnchor = clamp(xScale(marker[0]), max, width - max);
    ctx.fillStyle = '#ddd';
    ctx.font = 'bold' + fontSize + 'px Menlo, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('' + marker[1], xAnchor, chartHeight + markerOffset);
  }
}
