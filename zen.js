    zen = {
	createSubtree : function(treeSpec) {
	    var i, rule, parentCompon, compon, len, constructor, parentDomNode,
		componKind = treeSpec[0],
		initParms = treeSpec[1],
		subtree = treeSpec[2];
	    rule = zen.invertedRulesTable[componKind];
	    console.debug("rule = > " + rule + ", componKind => " +
			  componKind);
	    constructor = zen.rule2ref(rule);
	    parentCompon = constructor.call(document, componKind, initParms);
	    console.debug("parentCompon => " + parentCompon);
	    len = subtree.length;
	    for (i=0; i<len; i++) {
		compon = zen.createSubtree(subtree[i]);
		compon.appendMyselfToParent(parentCompon);
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
			      "dijit.layout.BorderContainer",
			      "dijit.layout.AccordionContainer",
			      "dijit.layout.AccordionPane" //FIXME: deprecated
			    ]
	    // FIXME: add this property and value: createTextNode : [ "*" ]
	},
	// This is a table for looking up a rule given a component name as
	// a key. We fill it up by immediately calling initIRT.
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
	    var s;
	    for (s in zen.shortCutsTable) {
		if (s == rule) {
		    return eval(zen.shortCutsTable[rule]);
		}
	    }
	    return eval(rule);
	},
	widgets : [],
	startup : function() {
	    // Start up all the Dojo widgets. The order is important.
	    dojo.forEach(zen.widgets.reverse(),
			 function(w) {
			     console.debug("starting up " + w);
			     w.startup(); }
			);
	},
	walkTree : function(tree) {
	    console.debug("tree => " + tree);
	    var children = tree.getChildCompons();
	    console.debug("children.length => " + children.length);
	    var i;
	    for (i=0; i<children.length; i++) {
		this.walkTree(children[i]);
	    };
	    console.debug("pop");
	},
	rowNumber : 0,
	boxCompon : function(component, tbl) {
	    var row = this.createElement("tr","r"+this.rowNumber);
	    var cell = this.createElement("td");
	    var div = this.createElement("div",{class:"visualRep"});
	    var text = this.createTextNode("" + component);
	    ++this.rowNumber;
	    tbl.appendChild(row);
	    row.appendChild(cell);
	    cell.appendChild(div);
	    div.appendChild(text);
	    return row;
	},
	boxTable : function(componList, tbl) {
	    var tbl1, i, len = componList.length,
		compon, children, row, cell, div;
	    console.debug("len => " + len);
	    for (i=0; i<len; i++) {
		compon = componList[i];
		console.debug("compon => " + compon);
		row = this.boxCompon(compon, tbl);
		children = compon.getChildCompons();
		if (children.length > 0) {
		    cell = this.createElement("td");
		    div = this.createElement("div",{class:"visualRep"});
		    //cell.appendChild(div);
		    console.debug("row => " + row);
		    row.appendChild(cell);
		    tbl1 = this.createElement("table",
					      {border:"1px solid black",
					       backgroundColor:"antiquewhite"});
		    cell.appendChild(tbl1);
		    this.boxTable(children, tbl1);
		};
	    };
	}
    };
    // Zen.createDijit does not allow a dijit to be built on a
    // passed-in HTML element node. Instead, the dijit constructor is
    // called without reference to a node, thus causing it to create a
    // top node on the fly. The dijit can be added to a parent
    // component afterwards.
    zen.createDijit = function(klass, initParms) {
	console.debug("zen.dojo.createDijit, klass => " + klass);
	dojo.require(klass);
	var widget = createNew(zen.rule2ref(klass), initParms);
	console.debug("widget => " + widget);
	widget.kind = klass;
	widget.children = [];
	widget.getDomNode = function() {
	    return widget.domNode;
	};
	widget.getChildCompons = function() {
	    return widget.children;
	};
	widget.appendMyselfToParent = function(parent) {
	    console.debug("appendMyselfToParent: widget => " + widget);
	    if (parent == parent.getDomNode()) {
		console.debug("element.appendChild(widget.domNode)");
		return parent.appendChild(widget.domNode); // HTML element
	    } else {
		console.debug("widgetp.addChild(widgetc), widgetp => " +
			      parent + ", widgetc => " + widget);
		parent.children.push(widget);
		return parent.addChild(widget);            // Dojo widget
	    };
	};
	widget.appendChild = function(child) {
	    console.debug("widget.appendChild: child => " + child);
	    if (child == child.getDomNode()) {
		console.debug("widget.appendChild(element)");
		if (widget.children.length > 0) {
		    console.warn(
			"A widget can have only one child if it's only HTML.");
		}
		widget.children = [child];
		return widget.setContent(child);           // HTML element
	    } else {
		console.debug("widget.appendChild(widget)");
		widget.children.push(child);
		return widget.addChild(child);             // Dojo widget
	    };
	};
	zen.widgets.push(widget);
	return widget;
    };
    zen.createElement = function(kind, attributes) {
	console.debug("zen.createElement: kind => " + kind +
		      ", attributes => " + attributes);
	var element = document.createElement(kind);
	console.debug("element => " + element);
	dojo.attr(element, attributes || {}); //FIXME: Check this.
	return element;
    };
    zen.createTextNode = function(text, attributes) {
	var element = document.createTextNode(text);
	return element;
    };
    zen.shortCutsTable = {
	createElement : zen.createElement,
	createTextNode : document.createTextNode,
	createDijit : zen.createDijit
    };

    Element.addMethods( // Extend all HTML elements with these methods.
	{
	    appendMyselfToParent : function (element, parent) {
		console.debug("appendMyselfToParent: element => " +
			      element + ", parent => " + parent);
		parent.appendChild(element);
	    },
	    getDomNode : function (element) {
		return element;
	    },
	    getChildCompons : function (element) {
		return dojo.map(element.children,
				function(c) {
				    var w = dijit.byNode(c);
				    return w || c;
				});
	    }
	});
    zen.initIRT();

    init = function() {}; // Unused.
