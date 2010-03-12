    zen = {
	createSubtree : function(treeSpec) {
	    var i, rule, parentCompon, compon, len, constructor,
		componType = treeSpec[0];
	    rule = zen.invertedRulesTable[componType];
	    console.debug('rule = > ' + rule + ', componType => ' + componType);
	    console.debug('rule2ref(rule) => ' + zen.rule2ref(rule));
	    constructor = zen.rule2ref(rule);
	    parentCompon = constructor.call(document, componType);
	    console.debug('parentCompon => ' + parentCompon);
	    len = treeSpec[1].length;
	    for (i=0; i<len; i++) {
		compon = zen.createSubtree(treeSpec[1][i]);
		console.dir('compon => ' + compon);
		compon.appendMyselfToParent(parentCompon.getDomNode());
	    };
	    return parentCompon;
	},
	// Each property of rulesTable is a rule for creating a kind
	// of component. The value of each property is the set (an
	// array) of the kinds of component that can be created using
	// the rule.
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
	    var components, c, rule, len;
	    for (rule in zen.rulesTable) {
		components = zen.rulesTable[rule];
		len = components.length;
		for (c=0; c<len; c++) {
		    zen.invertedRulesTable[components[c]] = rule;
		};
	    };
	},
	rule2ref : function(rule) {
	    var i;
	    for (i in zen.shortCutsTable) {
		if (i == rule) {
		    return eval(zen.shortCutsTable[rule]);
		}
	    }
	    return eval(rule);
	}
    };
    zen.createDijit = function(klass, initParms) {
	console.debug('zen.dojo.createDijit, klass => ' + klass);
	dojo.require(klass);
	console.debug('createNew ...');
	//widget = createNew(zen.rule2ref(klass), {'class':'box'},
	//	                 dojo.byId('id2'));
	widget = createNew(zen.rule2ref(klass), {'class':'box'});
	//dojo.byId('id2'));
	console.debug('widget => ' + widget);
	// FIXME: Check whether this works when the parent is a dijit.
	// Check the semantics of the addChild method of some dijits.
	widget.appendMyselfToParent = function(parent) {
	    console.debug('appendMyselfToParent: this => ' + this);
	    parent.getDomNode().appendChild(this.domNode);
	};
	widget.getDomNode = function() {
	    return this.domNode;
	};
	return widget;
    };
    zen.shortCutsTable = {
	createElement : document.createElement,
	createTextNode : document.createTextNode,
	createDijit : zen.createDijit
    };

    Element.addMethods( // Extend all HTML elements with these methods.
	{
	    appendMyselfToParent : function (element, parent) {
		console.debug('appendMyselfToParent: element => ' +
			      element + ', parent => ' + parent);
		parent.appendChild(element);
	    },
	    getDomNode : function (element) {
		return element;
	    }
	});
    zen.initIRT();

    init = function() {}; // Unused.
