dojo.provide("zen.test_zen");

dojo.require("zen");


tests.register(
    "zen.test_zen",
[
{
    name: "1. createNew(zen.Compon) returns an empty Zen component",
    setUp: function() {
    },
    runTest: function() {
	compon = zen.createNew(zen.Compon);
	doh.assertTrue(typeof compon === "object");
	doh.assertEqual(compon.constructor.prototype.constructor, compon.constructor);
	doh.assertTrue(compon.constructor === zen.Compon);
	doh.assertTrue(compon.constructor.prototype === zen.Compon.prototype);
	doh.assertEqual("null", compon.toString());
    }
},
{
    name: "2. createNew(...) passes an argument to the constructor",
    setUp: function() {
	Person = function(name) {
	    this.name = name;
	};
    },
    runTest: function() {
	person = zen.createNew(Person, "Paul");
	doh.assertEqual("Paul", person.name);
    }
}
]);