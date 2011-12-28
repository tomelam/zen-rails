dojo.provide("zen.debug");

// Some crude debug printing facilities.  These facilities
// work much better in Firefox than in Webkit-based browsers
// (Chrome and Safari).
//
// Example usage: zen.debug("The result is an %s", "object");
//
// Note 1: The arguments are evaluated whether or not the
// debug call is turned off or on.  Therefore, if an argument
// is an object with a toString method, that method will be
// called.  To avoid this superfluous evaluation, use the
// interpolating operator (%s) within the format string (the
// first argument to zen.debug, zen.log, etc.) and avoid
// expressions using the string concatenation operator (+),
// such as zen.debug("The result is an " + x) .  The
// interpolation operator won't work in Webkit-based browsers,
// but the output will be legible, if not highly readable.
//
// Note 2: In Firefox, the arguments pseudo-array can be
// converted to a real array by calling
// Array.prototype.slice.call(arguments) and applying the
// resulting array to Firebug's console functions, like so:
// console.debug.apply(null,
// Array.prototype.slice.call(arguments)) .  But
// console.debug.apply, console.log.apply, etc. do not work in
// Webkit-based browsers like Chrome and Safari.
zen.debugLevel = 3; // No tracing except errors.
zen.debugDir = false; // No calls to console.dir.
// Thanks to bart
// (http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format).
