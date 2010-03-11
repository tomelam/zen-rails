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
		
    // Function to create a Dojo dijit. Modelled after
    // document.createElement and document.createTextNode.
    // FIXME.
    // The appendMyselfToParent method should do a different
    // thing for each different object constructor. The DOM
    // node of a Dojo widget should be extended with this
    // method; likewise raw HTML elements should be
    // extended. But *how* can widgets be extended? Hmm... How
    // about via zen.dojo.createDijit?

    // The addToComponent method is invoked on a component object,
    // e.g. an HTML element node or a Dojo dijit.
    
    var DOMMethods = {
	addToComponent : function (element, array) {
	    console.debug('addToComponent');
	    var i, r, newNode;
	    console.debug('array => ', array);
	    for (i=0; i<array.length; i++) {
		console.debug('component => ' + array[i][0]);
		r = rulesTable[array[i][0]];
		console.debug('rule => ' + r);
		newNode = s2f[r].call(document, array[i][0]);
		console.debug('newNode => ' + newNode);
		element.appendChild(newNode);
		$(newNode).addToComponent(array[i][1]);
	    }
	    console.debug('addToComponent');
	},
	appendMyselfToParent : function (element, parent) {
	    console.debug('appendMyselfToParent: element => ' + element +
			  ', parent => ' + parent);
	    parent.appendChild(element);
	}
    };
    
    createSubtree = function(treeSpec) {
	var i, r, topComponent, component;
	r = rulesTable[treeSpec[0]];
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
	//newComponent.appendMyselfToParent(document.body);
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
