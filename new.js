    // Simplification and consolidation of a simulated 'new' operator
    // as given in Chapter 5 of _JavaScript: The Good Parts_, by
    // Douglas Crockford. Courtesy of Eric Bréchemier (on
    // stackoverflow.com; see http://bit.ly/9PiU5W). I have made
    // significant corrections and added arguments to the constructor.
    //
    // This function is not just for educational purposes: it allows
    // any kind of object to be created in a more functional way than
    // the 'new' operator allows, because it allows the object's
    // constructor to be passed to a function and then called there to
    // create the new object.
    //
    // FIXME: Look around to see if Prototype or any other JavaScript
    // library provides similar functionality.
    function createNew() {
	// A function to explain the new operator.
	//   var object = createNew(...);
	//     is equivalent to
	//   var object = new constructor(...);
	//
	// arguments: constructor function, followed by its arguments
	// return: a new instance of the "constructor" kind of objects

	// Preliminaries: convert arguments to a real array, get the
	//                constructor, and get the arguments to the
	//                constructor.
	var args = Array.prototype.slice.call(arguments);
	var constructor = args[0];
	var constructorArgs = args.slice(1);
	
	// Step 1: Create a new empty object instance linked to the
	//         prototype of provided constructor.
	var hiddenLink = function(){};
	hiddenLink.prototype = constructor.prototype;
	// CORRECTED: 'object' was 'instance'.
	var object = new hiddenLink(); // cheat: use new to implement new
	
	// Step 2: Apply the constructor to the new instance and get
	//         the result.
	// CORRECTED: 'instance' was 'result'.
	// ADDED: arguments.slice(1))
	//var instance = constructor.apply(object, args);
	var instance = constructor.apply(object, constructorArgs);
	
	// Step 3: Check the result, and choose whether to return it
	//         or the created instance.
	if (typeof instance === 'object') {
	    // CORRECTED: 'instance' was 'object'.
	    return instance;
	} else {
	    // CORRECTED: 'object' was 'instance'.
	    return object;
	};
    };
    
    // Test createNew.
    Foo = function() {
	var a = 1;
	return {
	    // This is a closure. It acts like an
	    // accessor to a private variable.
	    getA : function() {
		return a;
	    }
	};
	
    };
    console.debug('.');
    f = createNew(Foo);
    console.debug('f.a => ' + f.a); // => undefined
    console.debug('f.getA() => ' + f.getA()); // => 1
    Bar = function() {
	this.a = 1;
	return 1;
    }
    console.debug('.');
    b = createNew(Bar);
    console.debug('b.a => ' + b.a); // => 1
    Baz = function(z) {
	this.a = z;
    }
    console.debug('.');
    c = createNew(Baz, 3, 4);
    console.debug('c.a => ' + c.a);