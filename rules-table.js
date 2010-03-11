    dojo.require("dijit.layout.ContentPane");

    zen = {
	createDijit : function(parm1, parm2) {
	    console.debug('zen.dojo.createDijit, parm1 => ' + parm1);
	    dojo.require(parm1);
	    console.debug('createNew ...');
	    widget = createNew(zen.s2f[parm1], {'class':'box'},
			       dojo.byId('id2'));
	    console.debug('widget => ' + widget);
	    widget.addToComponent = function() {
		console.debug('addToComponent: this => ' + this);
	    };
	    widget.appendMyselfToParent = function() {
		console.debug('appendMyselfToParent: this => ' + this);
	    };
	    return widget;
	},
	// Extend all HTML elements with these methods.
	DOMMethods : {
	    appendMyselfToParent : function (element, parent) {
		console.debug('appendMyselfToParent: element => ' +
			      element + ', parent => ' + parent);
		parent.appendChild(element);
	    }
	},
	createSubtree : function(treeSpec) {
	    var i, r, topComponent, component;
	    console.debug('rule = > ' + r + ', treeSpec[0] => ' + treeSpec[0]);
	    r = zen.invertedRulesTable[treeSpec[0]];
	    console.debug('rule = > ' + r + ', treeSpec[0] => ' + treeSpec[0]);
	    console.dir(zen.rulesTable);
	    console.debug('s2f[r] => ' + zen.s2f[r]);
	    topComponent = zen.s2f[r].call(document, treeSpec[0]);
	    console.debug('topComponent => ' + topComponent);
	    for (i=0; i<treeSpec[1].length; i++) {
		console.debug('component => ' + treeSpec[1][i][0]);
		console.debug('treeSpec[1][i][0] => ' + treeSpec[1][i][0]);
		//component = s2f[r].call(document, treeSpec[1][i][0]);
		component = zen.createSubtree(treeSpec[1][i]);
		console.dir('component => ' + component);
		component.appendMyselfToParent(topComponent);
	    };
	    return topComponent;
	},
	// Naming the components that follow a certain rule in an array
	// saves typing. 
	rulesTable : {
	    createElement : [ "div", "table", "tr", "td", "p", "span" ],
	    createDijit   : [ "dijit.layout.ContentPane",
			      "dijit.layout.BorderContainer" ]
	    // FIXME: add this property and value: createTextNode : [ "*" ]
	},
	// This is a table for looking up a rule given a component name as
	// a key. We fill it up by immediately calling the following
	// anonymous function.
	invertedRulesTable : {},
	initIRT : function() {
	    var components, c, r;
	    for (r in zen.rulesTable) {
		components = zen.rulesTable[r];
		for (c=0; c<components.length; c++) {
		    zen.invertedRulesTable[components[c]] = r;
		};
	    };
	}
    }
    // We need references (symbols) to functions for the creation of
    // components. Unfortunately, 'for (r in rulesTable)', used to
    // access rulesTable, loops over strings, not symbols. However,
    // with the following translation table, we can get the symbols we
    // need. Note that dotted referencs (like document.createElement)
    // don't get automatically converted to strings, so we have to use
    // a key that is either a non-dotted reference or a string.
    //
    // We add Dojo widgets to this table because they cannot be
    // specified directly via strings as are arguments to
    // document.createElement(...), and the array keyed by createDijit
    // in rulesTable must not include symbols. The translation from
    // string to symbol must be used when a Dojo widget is made.
    zen.s2f = {
	'document.createElement' : document.createElement,
	createElement : document.createElement,
	'document.createTextNode' : document.createTextNode,
	createTextNode : document.createTextNode,
	'zen.dojo.createDijit' : zen.createDijit,
	createDijit : zen.createDijit,
	'dijit.layout.ContentPane' : dijit.layout.ContentPane
    }

    Element.addMethods(zen.DOMMethods);
    zen.initIRT();

    init = function() {};
