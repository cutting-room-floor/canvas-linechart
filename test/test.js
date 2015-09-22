var test = require('tape'),
  path = require('path'),
  fs = require('fs'),
  concat = require('concat-stream'),
  imageEqual = require('image-equal'),
  browserify = require('browserify'),
  smokestack = require('smokestack');

test('fixtures', function(t) {
  browserify([{
    file: path.join(__dirname, 'configs.js'),
    source: 'window.configs = ' + JSON.stringify(configs),
    deps: {}
  }, path.join(__dirname, './page.js')])
    .bundle()
    .pipe(smokestack({ timeout: 15000 }))
    .pipe(concat(function(res) {
      res.toString('utf8').split('\n').filter(String).forEach(function(d, i) {
        var fixturePath = path.join(__dirname, '/fixture/' + configs[i].name + '.png');
        var data = d.replace('data:image/png;base64,', '');
        var c = new Buffer(data, 'base64');
        if (process.env.UPDATE) {
          fs.writeFileSync(fixturePath, c, 'binary');
        }
        t.ifError(imageEqual(c, fs.readFileSync(fixturePath)), 'images are equal');
      });
      t.end();
    }));
});

var configs = [
  {
    config: [100, 500, [[0, 0], [20, 1]], 1], name: 'simple'
  }, {
    config: [100, 500, [[0, 0], [10, 4], [20, 0]], 1], name: 'hump'
  }
];
