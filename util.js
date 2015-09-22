module.exports.min = function(data) {
  return data.reduce(function(memo, d) {
    return Math.min(d, memo);
  }, Infinity);
};

module.exports.max = function(data) {
  return data.reduce(function(memo, d) {
    return Math.max(d, memo);
  }, -Infinity);
};
