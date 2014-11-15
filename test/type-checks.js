var test = require('tape');

var HttpTransport = require('../index.js');

test('constructor checks', function(t) {
  t.plan(4);
  t.throws(function() { new HttpTransport(123); }, TypeError);
  t.throws(function() { new HttpTransport(null); }, TypeError);
  t.throws(function() { new HttpTransport([]); }, TypeError);
  t.throws(function() { new HttpTransport({}); }, TypeError);

  // no throw
  new HttpTransport();
});

test('method checks', function(t) {
  t.plan(8);

  t.throws(function() { new HttpTransport().get(123); }, TypeError);
  t.throws(function() { new HttpTransport().post(123); }, TypeError);
  t.throws(function() { new HttpTransport().put(123); }, TypeError);
  t.throws(function() { new HttpTransport().delete(123); }, TypeError);

  t.throws(function() { new HttpTransport().get(); }, TypeError);
  t.throws(function() { new HttpTransport().post(); }, TypeError);
  t.throws(function() { new HttpTransport().put(); }, TypeError);
  t.throws(function() { new HttpTransport().delete(); }, TypeError);
});
