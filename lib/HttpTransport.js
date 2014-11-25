module.exports = HttpTransport;

var Promise    = require('bluebird');
var debug      = require('debug')('HttpTransport');
var httpInvoke = require('httpinvoke');
var urlUtil    = require('url');

/**
 * @class
 * A concrete implementation of {@link AbstractTransport} that works on both
 * the client and server.
 */
function HttpTransport()
{

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
 * @example
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

  var fullUrl = url + urlUtil.format({ query: params });

  debug('GET %s', fullUrl);
  var abort = httpInvoke(fullUrl, 'GET')
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

  debug('DELETE %s', url + urlUtil.format({ query: params }));
  var abort = httpInvoke(url, 'DELETE', { input: serialize(params) });

  return wrapResponse(abort);
};

/**
 * Alias for {@link HttpTransport#delete}
 * @param {string} url URL to request
 * @param {object.<string,any>=} params Hash of any parameters to pass
 * @return {Promise}
 * @deprecated
 */
HttpTransport.prototype.del = function(url, params)
{
  return this.delete(url, params);
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

