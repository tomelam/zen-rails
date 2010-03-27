zen = {};
zen.createSubtree = function(treeSpec) {
	    var i, rule, parentCompon, compon, len, constructor, parentDomNode,
		componKind = treeSpec[0],
		initParms = treeSpec[1],
		subtree = treeSpec[2];
	    rule = zen.invertedRulesTable[componKind];
	    console.debug("rule => " + rule + ", componKind => " +
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
};
	// Each property of rulesTable is the name of a rule
	// (i.e. method) for creating a kind of component. The value
	// of each property is the set (an array) of the kinds of
	// component that can be created using the rule.
	zen.rulesTable = {
	    createElement : [ "div", "table", "tr", "td", "p", "span",
			      "center", "br" ],
	    createDijit   : [ "dijit.layout.ContentPane",
			      "dijit.layout.BorderContainer",
			      "dijit.layout.AccordionContainer",
			      "dijit.layout.AccordionPane", //FIXME: deprecated
			      "dijit.DialogUnderlay",
			      "dijit.form.Button",
			      "dojox.layout.FloatingPane" //FIXME: deprecated
			    ],
	    createTextNode : [ "text" ]
	};
	// This is a table for looking up a rule given a component
	// name as a key. We fill it up by immediately calling
	// initIRT.
	zen.invertedRulesTable = {};
	zen.initIRT = function() {
	    var components, c, rule, len;
	    for (rule in zen.rulesTable) {
		components = zen.rulesTable[rule];
		len = components.length;
		for (c=0; c<len; c++) {
		    zen.invertedRulesTable[components[c]] = rule;
		};
	    };
	};
	// FIXME: eval is not cool here. FaceBook and MySpace, for
	// example, won't allow it in included JavaScript.
	zen.rule2ref = function(rule) {
	    var s;
	    for (s in zen.shortCutsTable) {
		if (s == rule) {
		    return eval(zen.shortCutsTable[rule]);
		}
	    }
	    return eval(rule);
	};
	zen.widgets = [];
	zen.startup = function() {
	    // Start up all the Dojo widgets. The order is important.
	    dojo.forEach(zen.widgets.reverse(),
			 function(w) {
			     console.debug("starting up " + w);
			     w.startup(); }
			);
	};
	zen.walkTheDOM = function(node, func) {
	    console.debug("node => " + node);
	    func(node);
	    node = node.firstChild;
	    while (node) {
		zen.walkTheDOM(node, func);
		node = node.nextSibling;
	    }
	};
	zen.walkTree = function(tree, func) {
	    console.debug("tree => " + tree);
	    func(tree);
	    var children = tree.getChildCompons();
	    console.debug("children.length => " + children.length);
	    var i;
	    for (i=0; i<children.length; i++) {
		func(children[i]);
		zen.walkTree(children[i], func);
	    };
	    console.debug("pop");
	};
	//FIXME: Use dojo.create.
	zen.boxCompon = function(component, tbl) {
	    var row = zen.createElement("tr");
	    var cell = zen.createElement("td",
		                          {class:"boxTD1"});
	    var div = zen.createElement("div",{class:"visualRep"});
	    var text = zen.createTextNode("" + component);
	    dojo.attr(cell, "mouseover",
		      function() {
			  var domNode = component.getDomNode();
			  console.debug("component => " + component +
					", domNode => " + domNode +
					", childNodes => " +
					domNode.childNodes);
			  domNode.savedBackgroundColor = dojo.style(
			      domNode, "backgroundColor");
			  dojo.style(
			      domNode,
			      {backgroundColor:"lightblue"});
			  dojo.forEach(
			      domNode.childNodes,
			      function(n) {
				  dojo.addClass(n,"invisible");
			      });
		      });
	    dojo.attr(cell, "mouseout",
		      function() {
			  var domNode = component.getDomNode();
			  dojo.style(domNode, "backgroundColor",
				     domNode.savedBackgroundColor);
			  dojo.forEach(
			      domNode.childNodes,
			      function(n) {
				  dojo.removeClass(n,"invisible");
			      });
		      });
	    tbl.appendChild(row);
	    row.appendChild(cell);
	    cell.appendChild(div);
	    div.appendChild(text);
	    return row;
	};
	// FIXME: Use dojo.create.
	zen.boxTable = function(componList, tbl) {
	    var tbl1, i, len = componList.length,
		compon, children, row, cell, div;
	    console.debug("len => " + len);
	    for (i=0; i<len; i++) {
		compon = componList[i];
		console.debug("compon => " + compon);
		row = zen.boxCompon(compon, tbl);
		children = compon.getChildCompons();
		if (children.length > 0) {
		    cell = zen.createElement("td", {class:"boxTD2"});
		    console.debug("row => " + row);
		    row.appendChild(cell);
		    tbl1 = zen.createElement("table", {class:"boxTable"});
		    cell.appendChild(tbl1);
		    zen.boxTable(children, tbl1);
		};
	    };
	};
    // Zen.createDijit does not allow a dijit to be built on a
    // passed-in HTML element node. Instead, the dijit constructor is
    // called without reference to a node, thus causing it to create a
    // top node on the fly. The dijit can be added to a parent
    // component afterwards.
    zen.createDijit = function(klass, initParms, topNode) {
	console.debug("zen.dojo.createDijit, klass => " + klass);
	dojo.require(klass);
	var widget = createNew(zen.rule2ref(klass), initParms, topNode);
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
	    //FIXME: See the placeat method in _Widget.js.
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
    // FIXME: Use dojo.create.
    zen.createElement = function(kind, attributes) {
	console.debug("zen.createElement: kind => " + kind +
		      ", attributes => " + attributes);
	var element = document.createElement(kind);
	console.debug("element => " + element);
	dojo.attr(element, attributes || {}); //FIXME: Check this.
	return element;
    };
    // FIXME: Use dojo.create, if appropriate.
    zen.createTextNode = function(text, attributes) {
	var element = document.createTextNode(text);
	return element;
    };
    zen.shortCutsTable = {
	createElement : zen.createElement,
	createTextNode : document.createTextNode,
	createDijit : zen.createDijit
    };

    // FIXME: Fix Zen so it will work with Internet Explorer.
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
