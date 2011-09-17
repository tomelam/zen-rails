dojo.provide("zen.new");

/* Simplification and consolidation of a simulated "new" operator as
   given in Chapter 5 of _JavaScript: The Good Parts_, by Douglas
   Crockford. Courtesy of Eric Bréchemier (on stackoverflow.com; see
   http:  bit.ly/9PiU5W). I have made significant corrections and
   added arguments to the constructor.
  
   This function is not just for educational purposes: it allows any
   kind of object to be created in a more functional way than the
   'new' operator allows, because it allows the object's constructor
   to be passed to a function and then called there to create the new
   object.
  
   FIXME: Look around to see if Prototype or any other JavaScript
   library provides similar functionality.
  
   FIXME: Someone criticized Crockford's function for creating an
   object because it creates a function every time called, even though
   only the prototype of that object mattered and is changed every
   time the object creator is called. It looks like this could easily
   be fixed by defining hiddenLink outside of createNew.
*/

zen.hiddenLink = function() {}
zen.createNew = function() {
    // A function to explain (and replace) the "new" operator.
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
    zen.debug("ENTER createNew: constructorArgs => " + constructorArgs);
    zen.debug("  ... constructor => " + constructor);
    
    // Step 1: Create a new empty object instance linked to the
    //         prototype of provided constructor.
    zen.hiddenLink.prototype = constructor.prototype;
    // CORRECTED: 'object' was 'instance'.
    var object = new zen.hiddenLink(); // cheat: use new to implement new
    
    // Step 2: Apply the constructor to the new instance and get
    //         the result.
    // CORRECTED: 'instance' was 'result'.
    // ADDED: arguments.slice(1))
    //var instance = constructor.apply(object, args);
    var instance = constructor.apply(object, constructorArgs);
    
    // Step 3: Check the result, and choose whether to return it
    //         or the created instance.
    return typeof instance === "object" ? instance : object;
    /*
    if (typeof instance === 'object') {
	// CORRECTED: 'instance' was 'object'.
	zen.debug("EXIT createNew: returning instance => %s", instance);
	return instance;
    } else {
	zen.debug("EXIT createNew: returning object => %s", object);
	// CORRECTED: 'object' was 'instance'.
	return object;
    };
    */
};
