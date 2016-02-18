Waterfall
===
[![NPM version][npm-image]][npm-url] [![Build Status][build-image]][build-url] [![Coverage Status][coverage-image]][coverage-url] [![Dependencies][dependencies-image]][dependencies-url]

> Invoke functions in series, passing the results of one function as arguments to the next function.


## Installation

``` bash
$ npm install utils-series-waterfall
```


## Usage

``` javascript
var waterfall = require( 'utils-series-waterfall' );
```

#### waterfall( fcns, clbk[, thisArg] )

Invokes `functions` in series, passing the results of one `function` as arguments to the next `function`.

``` javascript
function foo( next ) {
	next( null, 'beep' );
}

function bar( str, next ) {
	console.log( str );
	next();
}

function done( error ) {
	if ( error ) {
		throw error;
	}
}

var fcns = [ foo, bar ];

waterfall( fcns, done );
```

To set the `this` context for __all__ `functions`, provide a `thisArg`.

``` javascript
function foo( next ) {
	this._idx = 0;
	next( null, 'beep' );
}

function bar( str, next ) {
	this._idx += 1;
	console.log( str );
	next();
}

function done( error ) {
	if ( error ) {
		throw error;
	}
	console.log( ctx._idx );
}

var ctx = {};
var fcns = [ foo, bar ];

waterfall( fcns, done, ctx );
```


#### waterfall.factory( fcns, done[, thisArg] )

Returns a reusable waterfall `function`.

``` javascript
var run = waterfall.factory( fcns, done );
// returns <function>

run();
run();
run();
// ...
```


## Notes

*	The last `argument` applied to each waterfall `function` is a callback. This `function` should be invoked upon a series `function` completion. The first argument is reserved as an `error` argument (which can be `null`). Any results which should be passed to the next `function` in the series should be provided beginning with the second argument.
*	If any `function` calls the provided callback with a truthy `error` argument, the waterfall suspends execution and immediately calls the `done` callback for subsequent `error` handling.
*	This implementation does __not__ guarantee that execution is asynchronous. To do so, wrap the `done` callback in a `function` which either executes at the end of the current stack (e.g., `nextTick`) or during a subsequent turn of the event loop (e.g., `setIntermediate`, `setTimeout`).


## Examples

``` javascript
var waterfall = require( 'utils-series-waterfall' );

function foo( next ) {
	next( null, 'beep' );
}

function bar( str, next ) {
	console.log( str );
	next( null, str.replace( /e/g, 'o' ) );
}

function fun( str, next ) {
	console.log( str );
	next();
}

function done( error ) {
	if ( error ) {
		throw error;
	}
	console.log( 'done' );
}

var fcns = [ foo, bar, fun ];

waterfall( fcns, done );
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


---
## Tests

### Unit

This repository uses [tape][tape] for unit tests. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul][istanbul] as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


### Browser Support

This repository uses [Testling][testling] for browser testing. To run the tests in a (headless) local web browser, execute the following command in the top-level application directory:

``` bash
$ make test-browsers
```

To view the tests in a local web browser,

``` bash
$ make view-browser-tests
```

<!-- [![browser support][browsers-image]][browsers-url] -->


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2016. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/utils-series-waterfall.svg
[npm-url]: https://npmjs.org/package/utils-series-waterfall

[build-image]: http://img.shields.io/travis/kgryte/utils-series-waterfall/master.svg
[build-url]: https://travis-ci.org/kgryte/utils-series-waterfall

[coverage-image]: https://img.shields.io/codecov/c/github/kgryte/utils-series-waterfall/master.svg
[coverage-url]: https://codecov.io/github/kgryte/utils-series-waterfall?branch=master

[dependencies-image]: http://img.shields.io/david/kgryte/utils-series-waterfall.svg
[dependencies-url]: https://david-dm.org/kgryte/utils-series-waterfall

[dev-dependencies-image]: http://img.shields.io/david/dev/kgryte/utils-series-waterfall.svg
[dev-dependencies-url]: https://david-dm.org/dev/kgryte/utils-series-waterfall

[github-issues-image]: http://img.shields.io/github/issues/kgryte/utils-series-waterfall.svg
[github-issues-url]: https://github.com/kgryte/utils-series-waterfall/issues

[tape]: https://github.com/substack/tape
[istanbul]: https://github.com/gotwarlost/istanbul
[testling]: https://ci.testling.com
