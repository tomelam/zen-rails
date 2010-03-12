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

    var testArray = [["div", []]];
    var testArray2 =
    [["div", [["table", [["tr", [["td", []], ["td", []]]],
			 ["tr", [["td", []], ["td", []]]],
			 ["tr", [["td", []], ["td", []]]]]],
	      ["p", [["span", [["div", []], ["div", []]]],
		     ["div", []]]]]],
     ["table", [["tr", [["td", []], ["td", []]]],
		["tr", [["td", []], ["td", []]]],
		["tr", [["td", []], ["td", []]]]]]];
    var testSubtree = ["div", []];
    var testSubtree2 = ["div", testArray];
    var testSubtree3 = ["div", testArray2];
    var testSubtree4 = ["div", [["p", []], ["dijit.layout.ContentPane", []]]];
    var testSubtree5 =
    ["div", [["p", []],
	     ["dijit.layout.ContentPane",
	      [["dijit.layout.ContentPane", [["div", []]]]]]]];
    var testSubtree6 =
    ["div", [["dijit.layout.AccordionContainer", [["dijit.layout.AccordionPane",
						   ["div", []]],
						  ["dijit.layout.AccordionPane", []]]]]];
		
    var newComponent;
    test = function() {
	newComponent = zen.createSubtree(testSubtree6);
	newComponent.appendMyselfToParent(document.body);
    };

    var b, cp, tp;
    testDijits = function() {
	b = new dijit.form.Button({ "class": "large" }, dojo.byId("id0"));
	cp = new dijit.layout.ContentPane({ "class": "box" },
					  dojo.byId("id1"));
	tp = new dijit.TitlePane( {title:"Inner Pane"}, dojo.byId("id2"));
    }

    testMyDijit = function() {
	return zen.dojo.createDijit(dijit.layout.ContentPane);
    }
