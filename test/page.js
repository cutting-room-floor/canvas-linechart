window.configs.forEach(function(config) {

  var canvasLineChart = require('../');
  var canvas = document.body.appendChild(
    document.createElement('canvas'));
  canvasLineChart.apply(undefined, [canvas].concat(config.config));
  console.log(canvas.toDataURL('png'));

});

window.close();
