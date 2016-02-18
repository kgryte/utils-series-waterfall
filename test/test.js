'use strict';

// MODULES //

var tape = require( 'tape' );
var waterfall = require( './../lib' );


// TESTS //

tape( 'main export is a function', function test( t ) {
	t.equal( typeof waterfall, 'function', 'main export is a function' );
	t.end();
});

tape( 'module exports a factory function', function test( t ) {
	t.equal( typeof waterfall.factory, 'function', 'export is a function' );
	t.end();
});
