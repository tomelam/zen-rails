dojo.provide("zen.test_zen");

dojo.require("zen");

//FIXME: Use locals, not globals.
tests.register(
    "zen.test_zen",
    [
	{
	    name: "1. zen.createNew(zen.Compon) returns a Zen component represented as '[zen.Compon zen_Compon_0]'",
	    runTest: function() {
		var compon = zen.createNew(zen.Compon);
		doh.assertTrue(compon instanceof zen.Compon);
		doh.assertEqual("[zen.Compon zen_Compon_0]", compon.toString());
	    }
	},
	{
	    name: "2. zen.createNew(zen.Compon) returns a unique, new registered Zen component when called a second time",
	    runTest: function() {
		compon2 = zen.createNew(zen.Compon);
		doh.assertEqual(compon2, zen.registry.Compon["zen_Compon_1"]);
	    }
	},
	{
	    name: "3. zen.createNew(zen.Compon, 'Jack') returns a registered Zen component represented as '[zen.Compon Jack]'",
	    runTest: function() {
		var compon3 = zen.createNew(zen.Compon, "Jack");
		doh.assertEqual("[zen.Compon Jack]", zen.registry.Compon["Jack"]);
		doh.assertEqual(compon3, zen.registry.Compon["Jack"]);
	    }
	},
	{
	    name: "4. zen.createNew(zen.Compon, 'Jack') throws an error when called a second time",
	    runTest: function() {
		var error = null;
		try {
		    var compon4 = zen.createNew(zen.Compon, "Jack");
		} catch(err) {
		    error = err;
		}
		doh.assertEqual("Error: trying to create a zen.Compon with an already-used ID", error);
	    }
	},
	{
	    name: "5. zen.createNew(..., ...) passes an argument to the constructor",
	    runTest: function() {
		var Person = function(name) {
		    this.name = name;
		};
		var person = zen.createNew(Person, "Paul");
		doh.assertEqual("Paul", person.name);
	    }
	},
	{
	    name: "6. zen.createNew(zen.DomNodeCompon) returns an empty Dom node component",
	    runTest: function() {
		var domNodeCompon = zen.createNew(zen.DomNodeCompon);
		doh.assertTrue(domNodeCompon instanceof zen.DomNodeCompon);
		doh.assertEqual("null", domNodeCompon.toString());
	    }
	}
    ]);