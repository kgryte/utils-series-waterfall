'use strict';

// MODULES //

var tape = require( 'tape' );
var noop = require( '@kgryte/noop' );
var waterfall = require( './../lib/waterfall.js' );


// TESTS //

tape( 'main export is a function', function test( t ) {
	t.equal( typeof waterfall, 'function', 'main export is a function' );
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
			waterfall( value, noop );
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
			waterfall( [noop], value );
		};
	}
});

tape( 'the function invokes each function in series, passing the results of one function as arguments to the next function', function test( t ) {
	var fcns;
	var str;

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
	waterfall( fcns, done );
});

tape( 'the function immediately returns an error to a provided callback', function test( t ) {
	var fcns;

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
	waterfall( fcns, done );
});
