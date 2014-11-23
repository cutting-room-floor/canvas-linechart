module.exports = canvasLineChart;

function canvasLineChart(c, data, marker) {
    var width = 170 * 2;
    var height = 40 * 2;
    var chartHeight = 30 * 2;
    c.width = width;
    c.height = height;
    c.style.width = width/2 + 'px';
    c.style.height = height/2 + 'px';

    var ctx = c.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);

    // draw 20 x axis ticks
    ctx.fillStyle = '#eee';
    for (var i = 0; i < 20; i++) {
      ctx.fillRect(i * 20, 0, 2, chartHeight);
    }

    ctx.fillRect(0, chartHeight, width, 2);

    var yScale = (function() {
      var yMax = data.reduce(function(memo, d) {
        return Math.max(d[1], memo);
      }, 0);
      return function(_) {
        return chartHeight - ((_ / yMax) * chartHeight);
      };
    })();

    function xScale(_) {
      return (_ / 20) * width;
    }

    // draw the data line
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 4;

    data.forEach(function(data, i) {
      ctx[i === 0 ? 'moveTo' : 'lineTo'](xScale(data[0]), yScale(data[1]));
    });
    ctx.stroke();

    if (marker) {
        ctx.fillStyle = '#3bb2d0';
        ctx.fillRect(xScale(marker[0]), 0, 3, height);
    }

    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    data.forEach(function(data, i) {
      ctx.beginPath();
      ctx.arc(xScale(data[0]), yScale(data[1]), 5, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.stroke();
    });

    if (marker) {
        var xAnchor = xScale(marker[0]);
        if (xAnchor < 20) xAnchor = 20;
        if (xAnchor > (width - 20)) xAnchor = width - 20;
        ctx.fillStyle = '#3bb2d0';
        ctx.fillRect(xAnchor - 20, chartHeight, 40, 20);
        ctx.fillStyle = '#fff';
        ctx.font = '18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('' + marker[1], xAnchor, chartHeight + 17);
    }
}
