dojo.provide("zen.zen");

// NOTE: We can't just call dojo.require() in this file because that messes
// up the loading of this module via dojo.require("zen.zen").

zen.domNodeCompons = [];
zen.widgets = [];

// Some crude debug printing facilities.
zen.debugLevel = 0; // No tracing except errors.
zen.debugDir = false; // No calls to console.dir.
zen.debug = function() {
    if (zen.debugLevel > 3) {
	var args = Array.prototype.join.call(arguments, ", ");
	console.debug(args);
    }
}
zen.log = function() {
    if (zen.debugLevel > 2) {
	var args = Array.prototype.join.call(arguments, ", ");
	console.log(args);
    }
}
zen.info = function() {
    if (zen.debugLevel > 1) {
	var args = Array.prototype.join.call(arguments, ", ");
	console.info(args);
    }
}
zen.warn = function() {
    if (zen.debugLevel > 0) {
	var args = Array.prototype.join.call(arguments, ", ");
	console.warn(args);
    }
}
zen.error = function() {
    var args = Array.prototype.join.call(arguments, ", ");
    console.error(args);
}
zen.group = function() {
    if (zen.debugDir) {
	var args = Array.prototype.join.call(arguments, ", ");
	console.group(args);
    }
} 
zen.groupEnd = function() {
    if (zen.debugDir) {
	console.groupEnd();
    }
}
zen.dir = function() {
    if (zen.debugDir) {
	console.dir(arguments[0]);
    }
}

zen.DomNodeCompon = function(e) {
    this.domNode = e || null; // "null" reads nicer than "undefined".
    this.stringRep = "[zen.DomNodeCompon " + this.domNode + "]";
    this.children = [];
    this.toString = function () { // Without this, we get '[object Object]'.
	//return "[zen.DomNodeCompon " + this.domNode + "]";
	return "[zen.DomNodeCompon " +
	    String(this.domNode).replace(/^\[object /,"").replace(/\]$/,"") +
	    "]";
    };
    this.appendMyselfToParent = function (parent) {
	zen.log("DomNodeCompon.appendMyselfToParent: domNode => " +
		      this.domNode + ", parent => " + parent);
	parent.appendChild(this);
    };
    this.appendChild = function (child) {
	zen.log("DomNodeCompon.appendChild: child => " +
		      child + ", this => " + this);
	this.domNode.appendChild(child.getDomNode());
	this.children.push(child);
    };
    this.getDomNode = function () {
	zen.log("DomNodeCompon.getDomNode: domNode => " + this.domNode);
	return this.domNode;
    };
    this.getChildCompons = function () { //FIXME: WORKING ON THIS: WAS BROKEN!
	return this.children;

	var domNode = this.domNode;
	zen.log("DomNodeCompon.getChildCompons: domNode => " +
		      domNode);
	return dojo.map(domNode.children,
			function(c) {
			    var w = dijit.byNode(c);
			    //return w || c;
			    return w ||
				zen.DomNodeCompon.fromDomNode(c);
			});
    };
    this.destroyCompon = function() {
	var compon, index;
	zen.log("DomNodeCompon.destroyCompon: this => " + this +
		      ", domNode => " + this.domNode);
	dojo.forEach(this.getChildCompons(),
		     function(child) {
			 child.destroyCompon();
		     });
	dojo.destroy(this.domNode);
	index = zen.domNodeCompons.indexOf(this);
	if (index >= 0) {
	    zen.log("...destroyCompon: index => " + index + ", compon => " +
		      zen.domNodeCompons[index] +
		      ", zen.domNodeCompons.length => " +
		      zen.domNodeCompons.length);
	    delete zen.domNodeCompons[index];
	    compon = zen.domNodeCompons.pop();
	    if (index != zen.domNodeCompons.length) {
		zen.domNodeCompons[index] = compon;
	    } else {
		zen.warn("compon was last in the list; won't put it back!");
	    };
	} else {
	    zen.error("zen.DomNodeCompon.destroyCompon: couldn't find last ref");
	};
    };
}

zen.DomNodeCompon.fromDomNode = function (node) {
    var i = 0;
    var len = zen.domNodeCompons.length;
    var compon;
    //zen.log("DomNodeCompon.fromDomNode: len => " + len + ", node => " + node);
    for (i; i<len; i++) {
	compon = zen.domNodeCompons[i];
	//zen.log("...fromDomNode: i => " + i + ", compon => " + compon +
	//	  ", zen.domNodeCompons.length => " +
	//	  zen.domNodeCompons.length);
	if (compon.domNode == node) {
	    zen.log("...fromDomNode: returning compon " + compon);
	    return compon;
	};
    };
    zen.error("...fromDomNode: returning null, node => " + node + ", i => " + i);
    return null;
};

// Create a component that refers to an HTML text node or HTML
// element. This avoids some conflict with Dojo that results when
// trying to use prototype.js to add methods to an element. It also is
// more future proof since an element can be handled in a clean way.
//
// FIXME: Can text nodes have attributes?
zen.createTextNode = function(text, attributes) {
    var domNodeCompon = zen.createNew(zen.DomNodeCompon);
    zen.log("*** zen.createTextNode: text => " + text + ", attributes => " + attributes);
    // FIXME: Use dojo.create, if appropriate.
    var domNode = document.createTextNode(text);
    zen.log("createTextNode: domNode => " + domNode);
    zen.domNodeCompons.push(domNodeCompon);
    zen.log("createTextNode: # of domNodeCompons => " + zen.domNodeCompons.length);
    domNodeCompon.domNode = domNode;
    return domNodeCompon;
};

// FIXME: Consider using dojo.fromJSON here for safety.
zen.createElement = function(kind, attributes) {
    zen.info("ENTER createElement: kind => " + kind);
    var domNodeCompon = zen.createNew(zen.DomNodeCompon);
    zen.log("*** zen.createElement: kind => " + kind + ", attributes => " + attributes);
    // FIXME: Use dojo.create.
    var domNode = document.createElement(kind);
    zen.log("createElement: domNode => " + domNode);
    zen.domNodeCompons.push(domNodeCompon);
    zen.log("createElement: # of domNodeCompons => " + zen.domNodeCompons.length);
    attributes = attributes || {};
    if (typeof attributes.klass != "undefined") {
	dojo.addClass(domNode, attributes.klass);
	delete attributes.klass;
	zen.debug("added class");
    }
    dojo.attr(domNode, attributes || {}); //FIXME: Check this.
    domNodeCompon.domNode = domNode;
    return domNodeCompon;
};

zen.createSubtree = function(treeSpec) {
    var i, rule, parentCompon, compon, len, constructor, parentDomNode,
	componKind = treeSpec[0],
	initParms = treeSpec[1],
	subtree = treeSpec[2];
    rule = zen.invertedRulesTable[componKind];
    zen.info("ENTER createSubtree: rule => " + rule + ", componKind => " + componKind);
    zen.debug("createSubtree: treeSpec => " + treeSpec);
    constructor = zen.rule2ref(rule);
    zen.debug('constructor => ' + constructor + ', typeof => ' + typeof constructor);
    parentCompon = constructor.call(document, componKind, initParms);
    zen.log("createSubtree: parentCompon => " + parentCompon);
    len = subtree.length;
    for (i=0; i<len; i++) {
	compon = zen.createSubtree(subtree[i]);
	compon.appendMyselfToParent(parentCompon);
    };
    zen.debug("* EXIT zen.createSubtree, parentCompon => " + parentCompon);
    return parentCompon;
};

// Each property of rulesTable is the name of a rule
// (i.e. method) for creating a kind of component. The value
// of each property is the set (an array) of the kinds of
// component that can be created using the rule.
zen.rulesTable = {
    createElement : [ "div", "table", "tr", "td", "p", "span",
		      "center", "br" ],
    createDijit   : [ "dijit.TitlePane",
		      "dijit.layout.ContentPane",
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
// example, won't allow it in included JavaScript. See
// http://www.dojotoolkit.org/reference-guide/dojo/_base/json.html
// for a safe way to evaluate JSON strings.
zen.rule2ref = function(rule) {
    var s;
    for (s in zen.shortcutsTable) {
	if (s == rule) {
	    //return eval(zen.shortcutsTable[rule]);
	    return dojo.fromJson(zen.shortcutsTable[rule]);
	}
    }
    //return eval(rule);
    return dojo.fromJson(rule)
};

zen.startup = function() {
    // Start up all the Dojo widgets. The order is important.
    zen.debug("startup: starting up widgets");
    dojo.forEach(zen.widgets.reverse(),
		 function(w) {
		     //zen.debug("starting up " + w);
		     w.startup(); }
		);
};

//FIXME: Use this function where useful.
zen.walkZen = function(compon, func) {
    func(compon);
    dojo.forEach(compon.getChildCompons(),
		 function(child) {
		     zen.walkZen(child, func);
		 });
};

zen.walkZenSpec = function(treeSpec, func) {
    func(treeSpec);
    dojo.forEach(treeSpec[2],
		 function(subtree) {
		     zen.walkZenSpec(subtree, func);
		 });
};
//zen.walkZenSpec(zen.toolbox, console.info); // Example usage.

zen.renderTree = function(tree, parent) {
    var newComponent;
    
    zen.debug("*** Entering renderTree");
    newComponent = zen.createSubtree(tree);
    zen.debug("******* newComponent => " + newComponent);
    newComponent.appendMyselfToParent(parent);
    zen.startup();
    zen.debug("*** Exiting renderTree");
    return newComponent;
};

//FIXME: Use dojo.create.
zen.boxCompon = function(component, tbl) {
    zen.debug("ENTER boxCompon");
    var row = zen.createElement("tr");
    var cell = zen.createElement("td", {klass:"boxTD1"});
    var div = zen.createElement("div", {klass:"visualRep"});
    zen.debug("boxCompon: createTextNode " + component);
    var text = zen.createTextNode("" + component);
    zen.debug("boxCompon: createTextNode done, call dojo.attr");
    dojo.attr(cell.domNode, "mouseover",
	      function() {
		  var domNode = component.getDomNode();
		  zen.debug("boxCompon: component => " + component +
			    ", domNode => " + domNode +
			    ", childNodes => " + domNode.childNodes);
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
    dojo.attr(cell.domNode, "mouseout",
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
    zen.debug("boxCompon: called dojo.attr");
    tbl.appendChild(row);
    zen.debug("boxCompon: appended row");
    row.appendChild(cell);
    zen.debug("boxCompon: appended cell");
    cell.appendChild(div);
    zen.debug("boxCompon: appended div");
    div.appendChild(text);
    zen.debug("EXIT boxCompon: returning compon with domNode => " +
		  row.domNode);
    return row;
};

// FIXME: Use dojo.create.
zen.boxTable = function(componList, tbl) {
    var tbl1, i, len = componList.length, compon, children, row, cell, div;
    zen.debug("ENTER boxTable: len => " + len);
    for (i=0; i<len; i++) {

	zen.debug("boxTable: i => " + i);
	zen.group("boxTable: componList");
	zen.dir(componList);
	zen.groupEnd();

	compon = componList[i];
	zen.debug("boxTable: compon => " + compon);
	row = zen.boxCompon(compon, tbl);
	zen.debug("boxTable: compon => " + compon + ", domNode => " +
		      compon.domNode);
	children = compon.getChildCompons();

	zen.group("boxTable: component children");
	zen.dir(children);
	zen.groupEnd();

	if (children.length > 0) {
	    zen.debug("boxTable: create cell");
	    cell = zen.createElement("td", {klass:"boxTD2"});
	    zen.debug("boxTable: row.domNode => " + row.domNode);
	    row.appendChild(cell);
	    zen.debug("boxTable: create table");
	    tbl1 = zen.createElement("table", {klass:"boxTable"});
	    zen.debug("boxTable: append table to cell");
	    cell.appendChild(tbl1);
	    zen.boxTable(children, tbl1);
	};
    };
    zen.debug("EXIT boxTable");
};

//FIXME: Maybe we could think up a good scheme for which components to
//save and which to destroy.
zen.clearTheCanvas = function (componsToDestroy, componsToSave) {
    if (typeof componsToSave == 'undefined' || !componsToSave) {
	componsToSave = null;
    };
    zen.debug("ENTER clearTheCanvas, destroying compons " +
		  componsToDestroy + " except for " + componsToSave);
    zen.debug("componsToDestroy.length => " + componsToDestroy.length);
    dojo.forEach(componsToDestroy,
		 function(compon) {
		     zen.debug("compon => " + compon);
		 });
    zen.debug("Destroying ...");
    dojo.forEach(componsToDestroy,
		 function(compon) {
		     zen.debug("compon => " + compon);
		     if (!componsToSave ||
			 (componsToSave.indexOf(compon) < 0)) {
			 compon.destroyCompon();
		     };
		 });
    //zen.domNodeCompons = [];
    //zen.widgets = [];
    zen.debug("EXIT clearTheCanvas");
};

zen.clearTheHierarchyDiagram = function () {
    var diagramPaneElementx, diagramPaneCompon;
    zen.debug("ENTER clearTheHierarchyDiagram");
    diagramPaneElement = dojo.byId("diagramPane");
    if (!diagramPaneElement) {
	diagramPaneElement = zen.createElement(
	    "div",
	    {id:"diagramPane",
	     style:
	     "position:absolute;width:100px;height:100px;top:100px;left:300px;",
	     duration:"750"});
	zen.body.appendChild(diagramPaneElement);
    };
    diagramPaneCompon = dijit.byId("diagramPane");
    // Even if an element with id 'diagramPane' exists, we need to
    // have a Zen component so that we can use it. If we already have
    // a widget with that id, we can use that.
    if (!diagramPaneCompon) {
	diagramPaneCompon = zen.createNew(zen.DomNodeCompon,
				      dojo.byId("diagramPane"));
    }
    var compons = diagramPaneCompon.getChildCompons();
    zen.debug("compons => " + compons);
    dojo.forEach(diagramPaneCompon.getChildCompons(),
		 function(child) {
		     zen.debug("Destroying " + child);
		     child.destroyCompon();
		 });
    zen.debug("EXIT clearTheHierarchyDiagram");
};

// Zen.createDijit does not allow a dijit to be built on a
// passed-in HTML element node. Instead, the dijit constructor is
// called without reference to a node, thus causing it to create a
// top node on the fly. The dijit can be added to a parent
// component afterwards.
zen.createDijit = function(klass, initParms, topNode) {
    zen.info("createDijit, klass => " + klass);
    var node = null, widget;
    dojo.require.apply(null, [klass]); // To get zen to load via require().
    if (topNode) {
	node = topNode.domNode;
    }
    widget = zen.createNew(zen.rule2ref(klass), initParms, node);
    zen.log("widget => " + widget);
    widget.isDojoWidget = true; // FIXME: Dumb.
    widget.kind = klass;
    widget.children = [];
    widget.getDomNode = function() {
	zen.debug("widget.getDomNode: domNode => " + widget.domNode);
	return widget.domNode;
    };
    widget.getChildCompons = function() {
	return widget.children;
    };
    widget.appendMyselfToParent = function(parent) {
	//FIXME: See the placeat method in _Widget.js.
	zen.debug("appendMyselfToParent: widget => " + widget +
		      ", parent => " + parent);
	if (parent.isDojoWidget) {
	    zen.debug("widgetp.addChild(widgetc), widgetp => " +
			  parent + ", widgetc => " + widget);
	    parent.children.push(widget);
	    return parent.addChild(widget);         // parent is Dojo widget
	} else {
	    zen.debug("domNode.appendChild(widget.domNode)");
	    return parent.appendChild(widget);      // parent is not Dojo widget
	};
    };
    widget.appendChild = function(child) {
	zen.debug("widget.appendChild: child => " + child);
	if (child.isDojoWidget) {
	    zen.debug("widget.appendChild(widget)");
	    widget.children.push(child);
	    return widget.addChild(child);           // child is Dojo widget
	} else {
	    zen.debug("widget.appendChild(domNode)");
	    if (widget.children.length > 0) {
		zen.warn(
		    "A widget can have only one child if it's only HTML.");
	    }
	    widget.children = [child];
	    return widget.set('content', child.domNode); // child is not Dojo widget
	};
    };
    widget.destroyCompon = function() {
	var compon, index;
	zen.debug("widget.destroyCompon: widget => " + widget +
		  ", domNode => " + widget.domNode);
	dojo.forEach(widget.getChildCompons(),
		     function(child) {
			 child.destroyCompon();
		     });
	widget.destroy();
	index = zen.widgets.indexOf(widget);
	if (index >= 0) {
	    zen.debug("...destroyCompon: index => " + index + ", compon => " +
		      zen.widgets[index] +
		      ", zen.widgets.length => " + zen.widgets.length);
	    delete zen.widgets[index];
	    compon = zen.widgets.pop();
	    if (index != zen.widgets.length) {
		zen.widgets[index] = compon;
	    } else {
		zen.warn("widget was last in the list; won't put it back!");
	    };
	} else {
	    zen.error("widget.destroyCompon: couldn't find last ref");
	};
    };
    zen.widgets.push(widget);
    return widget;
};

// These shortcuts make it easy to specify methods for creating
// various kinds of components.
zen.shortcutsTable = {
    createElement : zen.createElement,
    createTextNode : document.createTextNode,
    createDijit : zen.createDijit
};

zen.requireSubtreeDijit = function(treeSpec) {
    var i, rule, parentCompon, compon, len, constructor, parentDomNode,
	componKind = treeSpec[0],
	initParms = treeSpec[1],
	subtree = treeSpec[2];
    rule = zen.invertedRulesTable[componKind];
    zen.info("ENTER requireSubtreeDijits: rule => " + rule + ", componKind => " + componKind);
    zen.debug("createSubtree: treeSpec => " + treeSpec);
    if (rule === 'createDijit') {
	dojo.require.apply(null, [componKind]);
    };
}

zen.init = function() {
    var ioIframeGetJson = function() {
	dojo.io.iframe.send({
	    url: "toolbox.json.html",
	    //url: "http://localhost:5984/zen/toolbox",
	    method: "GET",
	    timeoutSeconds: 5,
	    preventCache: true,
	    // handleAs: "text",
	    handleAs: "json",
	    handle: function(result, ioArgs){
		resultSave = result;
		if(!(result instanceof Error)){
		    zen.debug("AJAX call succeeded");
		    //smallToolbox = result.toolbox;
		    smallToolbox = result;
		    zen.group("json iframe");
		    zen.dir(result);
		    zen.groupEnd();
		    zen.walkZenSpec(
			result,
			function() {
			    zen.requireSubtreeDijit(arguments[0]);
			});
		    dojo.addOnLoad(
			function() {
			    zen.renderTree(result, zen.body)
			    //zen.renderTree(result.toolbox, zen.body);
			    dojo.style("zenLoadingImg", "display", "none");
			});
		}else{
		    zen.error("json iframe error");
		}
	    }		
	});
    }

    zen.initIRT();
    zen.body = zen.createNew(zen.DomNodeCompon, dojo.body());
    zen.debug("zen.body => " + zen.body + ", zen.body.domNode => " + zen.body.domNode);
    dojo.require.apply(null, ["dojo.io.iframe"]);
    dojo.addOnLoad(ioIframeGetJson);
}
