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
		
    // Extend all HTML elements with the following methods.
    var DOMMethods = {
	appendMyselfToParent : function (element, parent) {
	    console.debug('appendMyselfToParent: element => ' + element +
			  ', parent => ' + parent);
	    parent.appendChild(element);
	}
    };
    
    createSubtree = function(treeSpec) {
	var i, r, topComponent, component;
	console.debug('rule = > ' + r + ', treeSpec[0] => ' + treeSpec[0]);
	r = invertedRulesTable[treeSpec[0]];
	console.debug('rule = > ' + r + ', treeSpec[0] => ' + treeSpec[0]);
	console.dir(rulesTable);
	console.debug('s2f[r] => ' + s2f[r]);
	topComponent = s2f[r].call(document, treeSpec[0]);
	console.debug('topComponent => ' + topComponent);
	for (i=0; i<treeSpec[1].length; i++) {
	    console.debug('component => ' + treeSpec[1][i][0]);
	    console.debug('treeSpec[1][i][0] => ' + treeSpec[1][i][0]);
	    //component = s2f[r].call(document, treeSpec[1][i][0]);
	    component = createSubtree(treeSpec[1][i]);
	    console.dir('component => ' + component);
	    component.appendMyselfToParent(topComponent); // roughly, element.appendChild(node);
	};
	return topComponent;
    };

    init = function() {
	dojo.require("dijit.layout.ContentPane");
	Element.addMethods(DOMMethods);
    }

    var newComponent;
    test = function() {
	//var testSubtree4 = ["div", [[dijit.layout.ContentPane, []]]];
	var testSubtree4 = ["div", [["p", []], ["dijit.layout.ContentPane", []]]];
	newComponent = createSubtree(testSubtree4);
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
