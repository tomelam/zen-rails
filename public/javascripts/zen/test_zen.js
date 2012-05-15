dojo.provide("zen.test_zen");

dojo.require("zen");

var domNodeCompon3, test4objects = {}, test3objects = {};

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
	    name: "1.5. Initially, zen.DomNodeCompon.domNodeCompons.length == 0",
	    runTest: function() {
		doh.assertEqual(0, zen.DomNodeCompon.domNodeCompons.length);
		doh.assertEqual(0, zen.DomNodeCompon.getCount());
	    }
	},
	{
	    name: "2. zen.createNew(zen.DomNodeCompon) returns a new Dom node component containing no DOM node",
	    runTest: function() {
		var domNodeCompon = zen.createNew(zen.DomNodeCompon);
		doh.assertTrue(domNodeCompon instanceof zen.DomNodeCompon, "zen.createNew should have returned a zen.DomNodeCompon");
		doh.assertEqual("[empty DomNodeCompon]",
				domNodeCompon.toString(), "The new DomNodeCompon should be represented as '[empty DomNodeCompon]'");
		doh.assertEqual(1, zen.DomNodeCompon.getCount(), "There should be exactly one DomNodeCompon as of now");
	    }
	},
	{
	    name: "4. zen.createNew(zen.DomNodeCompon, 'body1', win.body() returns a DOM node component for the BODY element and sets its id",
	    runTest: function() {
		require(["dojo/dom", "dojo/_base/window", "dojo/query"], function(dom, win, query){
		//require(["dojo/dom", "dojo/_base/window"], function(dom, win) {
		    var iframeDoc = dom.byId("testBody").contentWindow.document;
		    test4objects.dom = dom;
		    test4objects.win = win;
		    test4objects.query = query;
		    test4objects.iframeDoc = iframeDoc2;
		    console.debug("iframeDoc => " + iframeDoc + ", win => " + win);
		    console.group("Test 4: iframeDoc");
		    console.dir(iframeDoc);
		    console.groupEnd();
		    console.group("Test 4: win");
		    console.dir(win);
		    console.groupEnd();
		    win.withDoc(iframeDoc, function() {
			console.group("Test 4: dojo.doc");
			console.dir(dojo.doc);
			console.groupEnd();
			console.group("Test 4: win.doc");
			console.dir(win.doc);
			console.groupEnd();
			//zen.dir_domNodeCompons();
			domNodeCompon = zen.createNew(zen.DomNodeCompon, "body1", win.body());
			doh.assertTrue(domNodeCompon instanceof zen.DomNodeCompon, "zen.createNew should have returned a zen.DomNodeCompon");
			doh.assertEqual("[HTML Compon HTMLBodyElement]",
					domNodeCompon.toString(), "The new DomNodeCompon should be represented as '[HTML Compon HTMLBodyElement]'");

			doh.assertEqual("[HTML Compon HTMLBodyElement]", domNodeCompon.toString());
			doh.assertEqual("[object HTMLBodyElement]", domNodeCompon.getDomNode());
			doh.assertEqual("body1", domNodeCompon.getId());
			//zen.dir_domNodeCompons();
			domNodeCompon.destroyCompon();
			//zen.dir_domNodeCompons();
		    });
		});
	    }
	},
	{
	    name: "3. domNodeCompon3 = zen.createNew(zen.DomNodeCompon, null, win.body()) is a unique DOM node component for the BODY element",
	    runTest: function() {
		require(["dojo/dom", "dojo/_base/window", "dojo/query"], function(dom, win, query){
		//require(["dojo/dom", "dojo/_base/window"], function(dom, win) {
		    var iframeDoc2 = dom.byId("testBody").contentWindow.document;
		    test3objects.dom = dom;
		    test3objects.win = win;
		    test3objects.query = query;
		    test3objects.iframeDoc = iframeDoc2;
		    console.debug("iframeDoc2 => " + iframeDoc2 + ", win => " + win);
		    console.group("Test 3: iframeDoc2");
		    console.dir(iframeDoc2);
		    console.groupEnd();
		    console.group("Test 3: win");
		    console.dir(win);
		    console.groupEnd();
		    win.withDoc(iframeDoc2, function() {
			console.group("Test 3: dojo.doc");
			console.dir(dojo.doc);
			console.groupEnd();
			console.group("Test 3: win.doc");
			console.dir(win.doc);
			console.groupEnd();
			domNodeCompon3 = zen.createNew(zen.DomNodeCompon, "foo", win.body());
			doh.assertTrue(domNodeCompon3 instanceof zen.DomNodeCompon, "zen.createNew should have returned a zen.DomNodeCompon");
			doh.assertEqual("[HTML Compon HTMLBodyElement]",
					domNodeCompon3.toString(), "The new DomNodeCompon should be represented as '[HTML Compon DomNodeCompon]'");
			doh.assertEqual(2, zen.DomNodeCompon.getCount(), "There should be exactly two DomNodeCompons as of now");

			doh.assertEqual("[object HTMLBodyElement]", domNodeCompon3.getDomNode());
			doh.assertEqual(0, domNodeCompon3.getId().indexOf("zen_DomNodeCompon_"));
		    }, this);
		});
	    }
	},
	{
	    name: "3.5. domNodeCompon3.destroyCompon() reduces the count of DomNodeCompons by 1",
	    runTest: function() {
		domNodeCompon3.destroyCompon();
		doh.assertEqual(1, zen.DomNodeCompon.getCount(), "There should be exactly one DomNodeCompon as of now");
	    }
	},
	{
	    name: "5. DOH does not remove elements from its test page at test tear-down time",
	    runTest: function() {
		require(["dojo/dom", "dojo/_base/window"], function(dom, win) {
		    ifr = dom.byId('testBody');
		    testGlobal = ifr.contentWindow; // Get the global scope object from the frame.
		    dojo.withGlobal(
			testGlobal,
			function() {
			    doh.assertEqual(1, dojo.query("div").length); // Test whether test 4's DIV got torn down.	
			});
		});
		domNodeCompon.destroyCompon();
	    }
	},
	{
	    name: "6. zen.createElement('DIV', {width:'100px',height:'50px',backgroundColor:'red'}) creates a 100-by-50-pixel red DIV",
	    runTest: function() {
		require(["dojo/dom", "dojo/_base/window"], function(dom, win) {
		    ifr = dom.byId('testBody');
		    testGlobal = ifr.contentWindow; // Get the global scope object from the frame.
		    dojo.withGlobal(
			testGlobal,
			function() {
			    var divCountBefore = dojo.query("div").length;
			    domNodeCompon = zen.createElement(
				"DIV", {width:"100px",height:"50px",backgroundColor:"red"});
			    dojo.body().appendChild(domNodeCompon.getDomNode());
			    doh.assertEqual(divCountBefore+1, dojo.query("div").length);
			});
		});
	    }
	}
    ]);