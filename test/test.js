var test = require('tap').test,
  path = require('path'),
  fs = require('fs'),
  Canvas = require('canvas'),
  imageEqual = require('image-equal'),
  canvasLineChart = require('../');

test('canvasLineChart - basic', function(t) {
  var c = new Canvas(500, 100);
  canvasLineChart(c, 100, 500, [[0, 0], [20, 1]], 1);
  if (process.env.UPDATE) {
    fs.writeFileSync(path.join(__dirname, '/fixture/1.png'), c.toBuffer());
  }
  t.ifError(imageEqual(c.toBuffer(), fs.readFileSync(path.join(__dirname, '/fixture/1.png'))));
  t.end();
});

test('canvasLineChart - base=0', function(t) {
  var c = new Canvas(500, 100);
  canvasLineChart(c, 100, 500, [[0, 0], [20, 1]], 0);
  if (process.env.UPDATE) {
    fs.writeFileSync(path.join(__dirname, '/fixture/2.png'), c.toBuffer());
  }
  t.ifError(imageEqual(c.toBuffer(), fs.readFileSync(path.join(__dirname, '/fixture/2.png'))));
  t.end();
});

test('canvasLineChart - midpoint', function(t) {
  var c = new Canvas(500, 100);
  canvasLineChart(c, 100, 500, [[0, 0], [10, 5], [20, 0]], 0);
  if (process.env.UPDATE) {
    fs.writeFileSync(path.join(__dirname, '/fixture/3.png'), c.toBuffer());
  }
  t.ifError(imageEqual(c.toBuffer(), fs.readFileSync(path.join(__dirname, '/fixture/3.png'))));
  t.end();
});
