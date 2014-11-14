module.exports = AbstractTransport;

/**
 * @class
 * Abstract interface for HTTP-like request objects.
 *
 * This interface should be implemented to provide HTTP functionality via a
 * simple API.
 *
 * Implemented by: {@link HttpTransport} and {@link JsonpTransport}
 */
function AbstractTransport()
{

}

/**
 * Execute a `GET` request
 * @param {string} url URL to request
 * @param {object.<string,any>=} params Hash of any parameters to pass
 * @return {Promise}
 */
AbstractTransport.prototype.get = function()
{

};

/**
 * Execute a `PUT` request
 * @param {string} url URL to request
 * @param {object.<string,any>=} data Hash of any data to pass
 * @return {Promise}
 */
AbstractTransport.prototype.put = function()
{

};

/**
 * Execute a `POST` request
 * @param {string} url URL to request
 * @param {object.<string,any>=} data Hash of any data to pass
 * @return {Promise}
 */
AbstractTransport.prototype.post = function()
{

};

/**
 * Execute a `DELETE` request
 * @param {string} url URL to request
 * @param {object.<string,any>=} params Hash of any parameters to pass
 * @return {Promise}
 */
AbstractTransport.prototype.delete = function()
{

};
