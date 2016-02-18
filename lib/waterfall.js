'use strict';

// MODULES //

var factory = require( './factory.js' );


// WATERFALL //

/**
* FUNCTION: waterfall( fcns, clbk[, thisArg] )
*	Invokes functions in series, passing the results of one function as arguments to the next function. 
*
* @param {Function[]} fcns - array of functions
* @param {Function} clbk - callback to invoke upon completing all functions
* @param {*} [thisArg] - function context 
* @returns {Void}
*/
function waterfall( fcns, clbk, thisArg ) {
	factory( fcns, clbk, thisArg )();
} // end FUNCTION waterfall()


// EXPORTS //

module.exports = waterfall;
