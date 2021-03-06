module.exports = JsonpTransport;

var Promise          = require('bluebird');
var debug            = require('debug')('JsonpTransport');
var jsonpClientAsync = Promise.promisify(require('jsonp-client'));
var urlUtil          = require('url');

/**
 * @class
 * An alternative to {@link HttpTransport} when JSONp is needed.
 *
 * Usage is the same except all methods besides `get` will throw an error.
 */
function JsonpTransport()
{

}

/**
 * Execute a `GET` request
 * @param {string} url URL to request
 * @param {object.<string,any>=} params Hash of any parameters to pass
 * @return {Promise}
 */
JsonpTransport.prototype.get = function(url, params)
{
  params = params || {};

  debug('GET %s', url + urlUtil.format({ query: params }));

  params.callback = 'JsonpTransport' + Date.now();

  var query = urlUtil.format({ query: params });

  url = url + query;

  return jsonpClientAsync(url)
    .then(function(resp) {
      return { body: resp, statusCode: 200 };
    });
};

/**
 * Not implemented.
 * @return {Promise}
 */
JsonpTransport.prototype.put = function()
{
  throw new Error('not implemented');
};

/**
 * Not implemented.
 * @return {Promise}
 */
JsonpTransport.prototype.post = function()
{
  throw new Error('not implemented');
};

/**
 * Not implemented.
 * @return {Promise}
 */
JsonpTransport.prototype.delete = function()
{
  throw new Error('not implemented');
};

