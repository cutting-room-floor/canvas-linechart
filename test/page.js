window.configs.forEach(function(config) {

  var canvasLineChart = require('../');
  var canvas = document.body.appendChild(
    document.createElement('canvas'));
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = '#404040';
  ctx.fillRect(0, 0, config.config[1], config.config[0]);
  canvasLineChart.apply(undefined, [canvas].concat(config.config));
  console.log(canvas.toDataURL('png'));

});

window.close();
