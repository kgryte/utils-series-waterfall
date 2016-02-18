'use strict';

// MODULES //

var tape = require( 'tape' );
var noop = require( '@kgryte/noop' );
var factory = require( './../lib/factory.js' );


// TESTS //

tape( 'main export is a function', function test( t ) {
	t.equal( typeof factory, 'function', 'main export is a function' );
	t.end();
});

tape( 'the function throws an error if not provided a function array', function test( t ) {
	var values;
	var i;

	values = [
		'5',
		5,
		NaN,
		null,
		true,
		undefined,
		[],
		{},
		function(){}
	];

	for ( i = 0; i < values.length; i++ ) {
		t.throws( badValue( values[i] ), TypeError, 'throws a type error when provided ' + values[i] );
	}
	t.end();
	function badValue( value ) {
		return function badValue() {
			factory( value, noop );
		};
	}
});

tape( 'the function throws an error if not provided a callback argument which is a function', function test( t ) {
	var values;
	var i;

	values = [
		'5',
		5,
		NaN,
		null,
		true,
		undefined,
		[],
		{}
	];

	for ( i = 0; i < values.length; i++ ) {
		t.throws( badValue( values[i] ), TypeError, 'throws a type error when provided ' + values[i] );
	}
	t.end();
	function badValue( value ) {
		return function badValue() {
			factory( [noop], value );
		};
	}
});

tape( 'the function returns a function', function test( t ) {
	var f = factory( [noop], noop );
	t.equal( typeof f, 'function', 'returns a function' );
	t.end();
});

tape( 'the function returns a function which invokes each function in series, passing the results of one function as arguments to the next function', function test( t ) {
	var fcns;
	var str;
	var f;

	str = 'beep';

	function foo( next ) {
		next( null, str );
	}
	function bar( res, next ) {
		t.equal( res, str, 'invoked with result of previous function' );
		next( null, 'hello', 'world' );
	}
	function fun( str1, str2, next ) {
		t.equal( str1, 'hello', 'invoked with result 1' );
		t.equal( str2, 'world', 'invoked with result 2' );
		next();
	}
	function done( error ) {
		if ( error ) {
			t.ok( false, error.message );
		}
		t.end();
	}

	fcns = [ foo, bar, fun ];
	f = factory( fcns, done );
	f();
});

tape( 'the function returns a function which immediately returns an error to a provided callback', function test( t ) {
	var fcns;
	var f;

	function foo( next ) {
		next( null, 'beep' );
	}
	function bar( res, next ) {
		next( new Error( 'boop' ) );
	}
	function fun( next ) {
		t.ok( false, 'should not be called' );
		next();
	}
	function done( error ) {
		t.ok( error, 'returns an error' );
		t.equal( error.message, 'boop', 'equal message' );
		t.end();
	}

	fcns = [ foo, bar, fun ];
	f = factory( fcns, done );
	f();
});

tape( 'the function returns a function which supports invoking each function in series with a specified `this` context', function test( t ) {
	var locals;
	var fcns;
	var f;

	locals = {};

	function foo( next ) {
		/* jshint validthis:true */
		this._idx = 0;
		next();
	}
	function bar(next ) {
		/* jshint validthis:true */
		t.equal( this._idx, 0, 'correct this context' );
		this._idx += 1;
		next();
	}
	function fun(next ) {
		/* jshint validthis:true */
		t.equal( this._idx, 1, 'correct this context' );
		this._idx += 1;
		next();
	}
	function done( error ) {
		if ( error ) {
			t.ok( false, error.message );
		}
		t.equal( locals._idx, 2, 'correct this context' );
		t.end();
	}

	fcns = [ foo, bar, fun ];
	f = factory( fcns, done, locals );
	f();
});
