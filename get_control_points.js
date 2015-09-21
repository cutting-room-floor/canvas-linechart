/**
 * thanks to http://scaledinnovation.com/analytics/splines/aboutSplines.html
 */
function getControlPoints(a, b, base) {
  var c = curveMidpoint(a, b, base);
  var x0 = a[0], y0 = a[1], x1 = c[0], y1 = c[1], x2 = b[0], y2 = b[1], t=0.5;
  var d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
  var d12 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  var fa = t * d01 / (d01 + d12);
  var fb = t * d12 / (d01 + d12);
  var p1x = x1 - fa * (x2 - x0);
  var p1y = y1 - fa * (y2 - y0);
  var p2x = x1 + fb * (x2 - x0);
  var p2y = y1 + fb * (y2 - y0);
  return [[p1x, p1y], [p2x, p2y]];
}

function curveMidpoint(a, b, base) {
  var mx = a[0] + (b[0] - a[0]) / 2;
  var t = base === 1 ?
    (mx - a[0]) / (b[0] - a[0]) :
    (Math.pow(base, mx - a[0]) - 1) / (Math.pow(base, b[0] - a[0]) - 1);
  var my = (a[1] * (1 - t)) + (b[1] * t);
  return [mx, my];
}

module.exports = getControlPoints;
