dojo.provide("zen.test_zen");

dojo.require("zen");

tests.register(
    "zen.test_zen",
    [
	{
	    name: "1. zen.createNew(..., ...) passes an argument to the constructor",
	    runTest: function() {
		var Person = function(name) {
		    this.name = name;
		};
		var person = zen.createNew(Person, "Paul");
		doh.assertEqual("Paul", person.name);
	    }
	},
	{
	    name: "2. zen.createNew(zen.DomNodeCompon) returns an empty Dom node component",
	    runTest: function() {
		var domNodeCompon = zen.createNew(zen.DomNodeCompon);
		doh.assertTrue(domNodeCompon instanceof zen.DomNodeCompon);
		doh.assertEqual("null", domNodeCompon.toString());
	    }
	},
	{
	    name: "3. zen.createNew(zen.DomNodeCompon, null, dojo.body()) returns a unique DOM node component for the BODY element",
	    runTest: function() {
		dojo.withDoc(
		    dojo.byId('testBody').contentDocument,
		    function() {
			//var domNodeCompon = zen.createNew(zen.DomNodeCompon, null, dojo.query("body")[0]);
			var domNodeCompon = zen.createNew(zen.DomNodeCompon, null, dojo.body());
			doh.assertTrue(domNodeCompon instanceof zen.DomNodeCompon);
			doh.assertEqual("[HTML Compon HTMLBodyElement]", domNodeCompon.toString());
			doh.assertEqual("[object HTMLBodyElement]", domNodeCompon.getDomNode());
			doh.assertEqual(0, domNodeCompon.getId().indexOf("zen_DomNodeCompon_"));
		    });
	    }
	},
	{
	    name: "4. zen.createNew(zen.DomNodeCompon, 'body1', dojo.query('body'))[0] returns a DOM node component for the BODY element and sets its id",
	    runTest: function() {
		dojo.withDoc(
		    dojo.byId('testBody').contentDocument,
		    function() {
			var domNodeCompon = zen.createNew(zen.DomNodeCompon, "body1", dojo.query("body")[0]);
			console.log("domNodeCompon.getDomNode() => " + domNodeCompon.getDomNode());
			console.log("dojo.body() => " + dojo.body());
			doh.assertTrue(domNodeCompon instanceof zen.DomNodeCompon);
			doh.assertEqual("[HTML Compon HTMLBodyElement]", domNodeCompon.toString());
			doh.assertEqual("[object HTMLBodyElement]", domNodeCompon.getDomNode());
			doh.assertEqual("body1", domNodeCompon.getId());
		    });
	    }
	},
	{
	    name: "5. zen.createElement('DIV', {width:'100px',height:'50px',backgroundColor:'red'}) creates a 100-by-50-pixel red DIV",
	    runTest: function() {
		dojo.withDoc(
		    dojo.byId('testBody').contentDocument,
		    function() {
			var domNodeCompon = zen.createElement(
			    "DIV", {width:"100px",height:"50px",backgroundColor:"red"});
			console.log("dojo.body() => " + dojo.body());
			console.log("doh => " + doh);
			dojo.body().appendChild(domNodeCompon.getDomNode());
			doh.assertEqual(1, dojo.query("div").length);
		    });
	    }
	},
	{
	    name: "6. DOH does not remove elements from its test page at test tear-down time",
	    runTest: function() {
		dojo.withDoc(
		    dojo.byId('testBody').contentDocument,
		    function() {
			doh.assertEqual(1, dojo.query("div").length); // Test whether test 4's DIV got torn down.	
		    });
	    }
	}
    ]);