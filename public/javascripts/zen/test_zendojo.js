dojo.provide("zen.test_zendojo");

dojo.require("zen.dojo");
dojo.require("zen.cssParser");

parser = new zen.CSSParser(); //FIXME: Tests of local component creation should not require the CSS parser.

tests.register(
    "zen.test_zendojo",
    [
	{
	    name: "1. zen.renderTree(['DIV', {}, []], ...) renders and places a Zen tree",
	    runTest: function() {
		var bodyCompon = zen.createNew(zen.DomNodeCompon, null, dojo.body());
		dojo.withDoc(
		    dojo.byId('testBody').contentDocument,
		    function() {
			zen.renderTree(["DIV", {}, []], bodyCompon);
		    }
		);
	    }
	},
	{
	    name: "2. zen.renderTree() renders a Zen tree",
	    runTest: function() {
		var bodyCompon = zen.createNew(zen.DomNodeCompon, null, dojo.body());
		dojo.withDoc(
		    dojo.byId('testBody').contentDocument,
		    function() {
			zen.renderTree(
			    ["dijit.layout.AccordionContainer",
			     {style:{width:"100%",height:"160px",backgroundColor:"yellow"}},
			     []],
			    bodyCompon);
		    }
		);
	    }
	},
	{
	    name: "3. zen.renderTree() renders a Zen tree",
	    runTest: function() {
		var bodyCompon = zen.createNew(zen.DomNodeCompon, null, dojo.body());
		dojo.withDoc(
		    dojo.byId('testBody').contentDocument,
		    function() {
			zen.renderTree(
			    ["DIV", {id:"workingNode"},
			     [["dijit.layout.AccordionContainer",
			       {style:{width:"100%",height:"160px",backgroundColor:"yellow"}},
			       []]]],
			    bodyCompon);
		    }
		);
	    }
	},
	{
	    name: "4. zen.renderTree() renders a Zen tree",
	    runTest: function() {
		dojo.require("zen.cssParser");
		var bodyCompon = zen.createNew(zen.DomNodeCompon, null, dojo.body());
		host = "google.com"; //FIXME: This shouldn't be necessary.
		dojo.withDoc(
		    dojo.byId('testBody').contentDocument,
		    function() {
			zen.renderTree(
			    ["DIV", {id:"workingNode"},
			     [["dijit.layout.AccordionContainer",
			       {style:{width:"100%",height:"160px",backgroundColor:"yellow"}},
			       [["dijit.layout.AccordionPane",
				 {title:"pane 1"},
				 [["DIV", {style:{width:"100%",height:"140px",
						  backgroundColor:"orange"}}, []]]],
				["dijit.layout.AccordionPane",
				 {title:"pane 2"},
				 [["DIV", {style:{width:"100%",height:"140px",backgroundColor:"red"}},
				   []]]]]]]],
			    bodyCompon);
		    }
		);
	    }
	}
    ]);