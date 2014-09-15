# HttpTransport

[![Build Status](https://travis-ci.org/bvalosek/http-transport.png?branch=master)](https://travis-ci.org/bvalosek/http-transport)
[![NPM version](https://badge.fury.io/js/http-transport.png)](http://badge.fury.io/js/http-transport)

A basic isomorphic Javascript interface around HTTP requests

## Installation

```
$ npm install http-transport
```

## Rationale

* Directly accessing HTTP data sources in domain code leads to difficulty in
  testing and is a violation of SRP.
* Complicated data abstraction layers are often too heavy-handed or not
  flexible enough.
* Writing isomorphic code that uses HTTP requests can be difficult.

## Overview

This is a very small wrapper around the
[http-invoke](https://github.com/jakutis/httpinvoke) module that compresses the
external API into u four primary HTTP verbs as methods that return a `Promise`.

The `HttpTransport` class is meant to be instantiated once and shared
throughout the application when domain code needs access to the HTTP layer,
e.g. calling REST services.

Using a simple facade to make `GET` request vs e.g `$.get()` or the Node `http`
module allows for clean, testable, isomorphic code.

## Methods

```javascript
var HttpTransport = require('http-transport');

var transport = new HttpTransport();
```

### transport.get(url, params?): Promise

Execute a `GET` request with optional query parameters and return a `Promise` for
the response.

```javascript
// Basic GET
transport.get('/users')
  .then(function(users) {
    ...
  });

// With query params (fetches /users?group=admins)
transport.get('/users', { group: 'admins' })
  .then(function(users) {
    ...
  });
```

### transport.post(url, data?): Promise

Execute a `POST` request with optional object data passed as
`application/x-www-form-urlencoded` and return a `Promise` for the response.

```
transport.post('/blogs', { content: 'Hello, world!' })
  .then(function(blog) {
    ...
  });
```

### transport.put(url, data?): Promise

Execute a `PUT` request with optional object data passed as
`application/x-www-form-urlencoded` and return a `Promise` for the response.

```
transport.put('/users', { id: 123, name: 'Billy' })
  .then(function(user) {
    ...
  });
```

### transport.del(url, params?): Promise

Execute a `DELETE` request with optional query parameters and return a `Promise` for
the response.

```javascript
transport.del('/users', { id: 123 })
  .then(function(resp) {
    ...
  });
```

## Prefixing URLs

You can create a `HttpTransport` instance that is initialized with a URL root
to cause all request to be prefixed:

```
var restService = new HttpTransport('http://awesome-rest-service.com/api/v2');

...

// Will GET http://awesome-rest-service.com/api/v2/users
restService.get('/users').then(...);
```

## Testing

```
$ npm test
```

## License

MIT
