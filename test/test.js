var test = require('tape'),
  path = require('path'),
  fs = require('fs'),
  concat = require('concat-stream'),
  imageEqual = require('image-equal'),
  browserify = require('browserify'),
  smokestack = require('smokestack');

test('fixtures', function(t) {
  fs.writeFileSync(path.join(__dirname, 'files.json'),
    JSON.stringify(configs.map(function(c) {
      return c.name;
    })));

  browserify([{
    file: path.join(__dirname, 'configs.js'),
    source: 'window.configs = ' + JSON.stringify(configs),
    deps: {}
  }, path.join(__dirname, './page.js')])
    .bundle()
    .pipe(smokestack({ browser: process.env.TEST_BROWSER || 'chrome' }))
    .pipe(concat(function(res) {
      res.toString('utf8').split('\n').filter(String).forEach(function(d, i) {
        if (d.indexOf('data:image/png;base64,') < 0) {
          return t.fail(d.toString());
        }
        var fixturePath = path.join(__dirname, '/fixture/' + configs[i].name + '.png');
        var outputPath = path.join(__dirname, '/output/' + configs[i].name + '.png');
        var data = d.replace('data:image/png;base64,', '');
        var c = new Buffer(data, 'base64');
        if (process.env.UPDATE) {
          fs.writeFileSync(fixturePath, c, 'binary');
        }
        fs.writeFileSync(outputPath, c, 'binary');
        t.ifError(imageEqual(c, fs.readFileSync(fixturePath)), 'images are equal');
      });
      t.end();
    }));
});

var configs = [
  {
    config: [500, 100, [[0, 0], [20, 1]], 1], name: 'simple'
  }, {
    config: [500, 100, [[0, 0], [10, 4], [20, 0]], 1], name: 'hump'
  }, {
    config: [500, 100, [[0, 0], [10, 4], [20, 0]], 0], name: 'base0'
  }, {
    config: [500, 100, [[0, 0], [10, 10], [20, 0]], 1, {
      marker: [5, 5]
    }], name: 'marker5'
  }, {
    config: [500, 100, [[0, 0], [10, 10], [20, 0]], 1, {
      max: 30
    }], name: 'max30'
  }, {
    config: [500, 100, [[0, 0], [10, 10], [20, 0]], 1, {
      min: 10
    }], name: 'min10'
  }
];
