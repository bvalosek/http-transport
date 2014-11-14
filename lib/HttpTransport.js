module.exports = HttpTransport;

var Promise    = require('bluebird');
var httpInvoke = require('httpinvoke');
var debug      = require('debug')('HttpTransport');

/**
 * @param {string=} urlRoot Prefix all URL requests with this
 * @class
 * This is a very small wrapper around the
 * [http-invoke](https://github.com/jakutis/httpinvoke) module that allows for
 * isomorphic HTTP requests.
 */
function HttpTransport(urlRoot)
{
  if (urlRoot !== undefined && typeof urlRoot !== 'string')
    throw new TypeError('urlRoot');

  this._urlRoot = urlRoot || '';
}

/**
 * Execute a `GET` request.
 *
 * Will parse JSON data if the `content-type: application/json` response header
 * is set
 * @param {string} url URL to request
 * @param {object.<string,any>=} params Hash of any parameters to pass
 * @return {Promise}
 * @example
 * // Basic GET
 * transport.get('/users')
 *   .then(function(users) {
 *     ...
 *   });
 *
 * // With query params (fetches /users?group=admins)
 * transport.get('/users', { group: 'admins' })
 *   .then(function(users) {
 *     ...
 *   });
 */
HttpTransport.prototype.get = function(url, params)
{
  if (typeof url !== 'string')
    throw new TypeError('url');

  params = params || {};
  debug('GET %s', url);
  var abort = httpInvoke(url, 'GET', { input: serialize(params) })
    .then(deserialize);

  return wrapResponse(abort);
};

/**
 * Execute a `POST` request
 *
 * Sends data as `content-type: application/x-www-form-urlencoded`.
 * @param {string} url URL to request
 * @param {object.<string,any>=} data Hash of any data to pass
 * @return {Promise}
 * @example
 * transport.post('/blogs', { content: 'Hello, world!' })
 *   .then(function(blog) {
 *     ...
 *   });
 */
HttpTransport.prototype.post = function(url, data)
{
  if (typeof url !== 'string')
    throw new TypeError('url');

  debug('POST %s', url);
  var abort = httpInvoke(url, 'POST', {
    input: serialize(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache'
    }
  });

  return wrapResponse(abort);
};

/**
 * Execute a `PUT` request
 *
 * Sends data as `content-type: application/x-www-form-urlencoded`.
 * @param {string} url URL to request
 * @param {object.<string,any>=} data Hash of any data to pass
 * @return {Promise}
 * @example
 * transport.put('/users', { id: 123, name: 'Billy' })
 *   .then(function(user) {
 *     ...
 *   });
 */
HttpTransport.prototype.put = function(url, data)
{
  if (typeof url !== 'string')
    throw new TypeError('url');

  debug('PUT %s', url);
  var abort = httpInvoke(url, 'PUT', {
    input: serialize(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache'
    }
  });

  return wrapResponse(abort);
};

/**
 * Execute a `DELETE` request
 * @param {string} url URL to request
 * @param {object.<string,any>=} params Hash of any parameters to pass
 * @return {Promise}
 * @example
 * transport.del('/users', { id: 123 })
 *   .then(function(resp) {
 *     ...
 *   });
 */
HttpTransport.prototype.delete = function(url, params)
{
  if (typeof url !== 'string')
    throw new TypeError('url');

  params = params || {};

  debug('DELETE %s', url);
  var abort = httpInvoke(url, 'DELETE', { input: serialize(params) });

  return wrapResponse(abort);
};

/**
 * Alias for {@link HttpTransport#delete}
 * @deprecated
 */
HttpTransport.prototype.del = HttpTransport.prototype.delete;

/**
 * @private
 * @return {string}
 * @param {string} url
 */
HttpTransport.prototype._makeUrl = function(url)
{
  return this._urlRoot + url;
};

/**
 * @private
 */
function wrapResponse(thenable)
{
  return Promise.resolve(thenable);
}

/**
 * @private
 */
function deserialize(resp)
{
  if (!resp || !resp.headers) return resp;
  var type = resp.headers['content-type'];

  // Some environments will not return headers, just bail out with no deserials
  if (!type) return resp;

  if (~type.indexOf('application/json'))
    resp.body = JSON.parse(resp.body);
  return resp;
}

/**
 * @private
 */
function serialize(data)
{
  return Object.keys(data).map(function(k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
  }).join('&');
}

