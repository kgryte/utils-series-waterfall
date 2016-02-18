'use strict';

// MODULES //

var tape = require( 'tape' );
var waterfall = require( './../lib' );


// TESTS //

tape( 'main export is a function', function test( t ) {
	t.equal( typeof waterfall, 'function', 'main export is a function' );
	t.end();
});
