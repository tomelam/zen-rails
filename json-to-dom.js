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
		
    var newComponent;
    test = function() {
	//var testSubtree4 = ["div", [[dijit.layout.ContentPane, []]]];
	var testSubtree4 = ["div", [["p", []], ["dijit.layout.ContentPane", []]]];
	newComponent = zen.createSubtree(testSubtree4);
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
