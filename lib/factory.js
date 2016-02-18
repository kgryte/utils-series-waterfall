'use strict';

// MODULES //

var isFunctionArray = require( 'validate.io-function-array' );
var isFunction = require( 'validate.io-function' );


// FACTORY //

/**
* FUNCTION: factory( fcns, clbk[, thisArg] )
*	Returns a reusable waterfall function. 
*
* @param {Function[]} fcns - array of functions
* @param {Function} clbk - callback to invoke upon completing all functions
* @param {*} [thisArg] - function context 
* @returns {Function} waterfall function
*/
function factory( fcns, clbk, thisArg ) {
	if ( !isFunctionArray( fcns ) ) {
		throw new TypeError( 'invalid input argument. First argument must be a function array. Value: `' + fcns + '`.' );
	}
	if ( !isFunction( clbk ) ) {
		throw new TypeError( 'invalid input argument. Second argument must be a function. Value: `' + clbk + '`.' );
	}
	/**
	* FUNCTION: waterfall()
	*	Invokes functions in series, passing the results of one function as arguments to the next function. 
	*
	* @returns {Void}
	*/
	return function waterfall() {
		var idx = -1;
		next();
		/**
		* FUNCTION: next( error, ...args )
		*	Invokes the next function in the series.
		*
		* @private
		* @param {Error|Null} error - error object
		* @param {...*} args - results to pass to next callback
		* @returns {Void}
		*/
		function next() {
			var args;
			var len;
			var i;

			// Check for an error...
			if ( arguments[ 0 ] ) {
				return clbk( arguments[ 0 ] );
			}
			// Update the counter and check if we have run all functions...
			idx += 1;
			if ( idx >= fcns.length ) {
				return clbk();
			}
			// Copy the remaining arguments...
			len = arguments.length;
			args = new Array( len );
			for ( i = 0; i < len-1; i++ ) {
				args[ i ] = arguments[ i+1 ];
			}
			// Add the callback:
			args[ i ] = next;

			// Apply the arguments to the next function in the waterfall:
			fcns[ idx ].apply( thisArg, args );
		} // end FUNCTION next()
	}; // end FUNCTION waterfall()
} // end FUNCTION factory()


// EXPORTS //

module.exports = factory;