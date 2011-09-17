dojo.provide("zen.zen");

// NOTE: We can't just call dojo.require() in this file because that messes
// up the loading of this module via dojo.require("zen.zen"). Instead, we
// make a call like "dojo.require.apply(null, [klass]);".

zen.domNodeCompons = [];

// Some crude debug printing facilities.  These facilities work much
// better in Firefox than in Webkit-based browsers (Chrome and
// Safari).
//
// Example usage: zen.debug("The result is an %s", "object");
//
// Note 1: The arguments are evaluated whether or not the debug call
// is turned off or on.  Therefore, if an argument is an object with a
// toString method, that method will be called.  To avoid this
// superfluous evaluation, use the interpolating operator (%s) within
// the format string (the first argument to zen.debug, zen.log, etc.)
// and avoid expressions using the string concatenation operator (+),
// such as zen.debug("The result is an " + x) .  The interpolation
// operator won't work in Webkit-based browsers, but the output will
// be legible, if not highly readable.
//
// Note 2: In Firefox, the arguments pseudo-array can be converted to
// a real array by calling Array.prototype.slice.call(arguments) and
// applying the resulting array to Firebug's console functions, like
// so: console.debug.apply(null,
// Array.prototype.slice.call(arguments)) .  But console.debug.apply,
// console.log.apply, etc. do not work in Webkit-based browsers like
// Chrome and Safari.
zen.debugLevel = 3; // No tracing except errors.
zen.debugDir = false; // No calls to console.dir.
// Thanks to bart (http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format).
zen.debug = function(format, etc) {
    if (zen.debugLevel > 3) {
	var args = arguments, i = 1;
	console.debug(format.replace(/%((%)|s)/g, function(m) { return m[2] || args[i++] }));
    }
}
zen.log = function(format, etc) {
    if (zen.debugLevel > 2) {
	var args = arguments, i = 1;
	console.log(format.replace(/%((%)|s)/g, function(m) { return m[2] || args[i++] }));
    }
}
zen.info = function(format, etc) {
    if (zen.debugLevel > 1) {
	var args = arguments, i = 1;
	console.info(format.replace(/%((%)|s)/g, function(m) { return m[2] || args[i++] }));
    }
}
zen.warn = function(format, etc) {
    if (zen.debugLevel > 0) {
	var args = arguments, i = 1;
	console.warn(format.replace(/%((%)|s)/g, function(m) { return m[2] || args[i++] }));
    }
}
zen.error = function(format, etc) {
	var args = arguments, i = 1;
	console.error(format.replace(/%((%)|s)/g, function(m) { return m[2] || args[i++] }));
}
zen.group = function(format, etc) {
    if (zen.debugDir) {
	var args = arguments, i = 1;
	console.group(format.replace(/%((%)|s)/g, function(m) { return m[2] || args[i++] }));
    }
} 
zen.groupEnd = function() {
    if (zen.debugDir) {
	console.groupEnd();
    }
}
zen.dir = function(value) {
    if (zen.debugDir) {
	console.dir(value);
    }
}

zen.registry = {};
zen._instanceCounters = {};
zen.getUniqueId = function(/*String*/objectType) {
    return objectType + "_" +
	(objectType in zen._instanceCounters ?
	 ++zen._instanceCounters[objectType] : zen._instanceCounters[objectType] = 0);
};

zen.registry.Compon = {};
dojo.declare("Compon", null, {
    constructor: function(domNode, id) {
	this.id = id || zen.getUniqueId("zen_Compon");
	zen.registry.Compon[this.id] = this;
	this.domNode = domNode || null;
	zen.info("ENTER/EXIT Compon.constructor for %s, id %s", this, this.id);
	this.children = [];
    },
    toString: function () { // Without this, we get '[object Object]'.
	zen.log("ENTER Compon.toString");
	return String(this.domNode).replace(/^\[object /,"[Compon ").replace(/\]$/,"]");
    },
    getDomNode: function() {
	zen.log("Compon.getDomNode: domNode => %s", this.domNode);
	return this.domNode;
    }
});

zen.registry.DomNodeCompon = {};
dojo.declare("DomNodeCompon", Compon, {
    constructor: function(domNode, id) {
	this.id = id || zen.getUniqueId("zen_DomNodeCompon");
	zen.registry.DomNodeCompon[this.id] = this;
	this.domNode = domNode || 0; // "null" reads nicer than "undefined".
	zen.info("ENTER/EXIT DomNodeCompon.constructor for %s, id %s", this, this.id);
	this.children = [];
    },
    toString: function () { // Without this, we get '[object Object]'.
	var rep;
	rep = String(this.domNode).replace(/^\[object /,"[DomNodeCompon ").replace(/\]$/,"]");
	zen.debug("ENTER/EXIT DomNodeCompon.toString; returning %s", rep);
	return rep;
    },
    appendMyselfToParent: function (parent) {
	zen.log("DomNodeCompon.appendMyselfToParent: domNode => %s, parent => %s", this.domNode, parent);
	parent.appendChild(this);
    },
    appendChild: function (child) {
	zen.log("DomNodeCompon.appendChild: child => %s, this => %s, this.id => %s",
		child, this, this.id);
	this.domNode.appendChild(child.getDomNode());
	this.children.push(child);
    },
    getChildCompons: function () { //FIXME: WORKING ON THIS: WAS BROKEN!
	zen.log("DomNodeCompon.getChildCompons");
	return this.children;
	/*
	zen.log("DomNodeCompon.getChildCompons: domNode => %s", this.domNode);
	return dojo.map(this.domNode.children,
			function(c) {
			    var w = dijit.byNode(c);
			    //return w || c;
			    return w || DomNodeCompon.fromDomNode(c);
			});
	*/
    },
    destroyCompon: function() {
	var compon, index;
	zen.log("DomNodeCompon.destroyCompon: this => %s, domNode => %s", this, this.domNode);
	dojo.forEach(this.getChildCompons(),
		     function(child) { child.destroyCompon(); });
	dojo.destroy(this.domNode);
	index = zen.domNodeCompons.indexOf(this);
	if (index >= 0) {
	    zen.log("...destroyCompon: index => %s, compon => %s, zen.domNodeCompons.length => %s",
		    index, zen.domNodeCompons[index], zen.domNodeCompons.length);
	    delete zen.domNodeCompons[index];
	    compon = zen.domNodeCompons.pop();
	    if (index != zen.domNodeCompons.length) {
		zen.domNodeCompons[index] = compon;
	    } else {
		zen.warn("compon was last in the list; won't put it back!");
	    };
	} else {
	    zen.error("DomNodeCompon.destroyCompon: couldn't find last ref");
	};
    }
});

/*
DomNodeCompon.fromDomNode: function(node) {
    //DomNodeCompon.fromDomNode = function (node) {
    var i = 0;
    var len = zen.domNodeCompons.length;
    var compon;
    zen.log("DomNodeCompon.fromDomNode: len => %s, node => %s", len, node);
    for (i; i<len; i++) {
	compon = zen.domNodeCompons[i];
	//zen.log("...fromDomNode: i => %s, compon => %s, zen.domNodeCompons.length => %s",
	//i, compon, zen.domNodeCompons.length);
	if (compon.this.domNode == node) {
	    zen.log("...fromDomNode: returning compon %s", compon);
	    return compon;
	};
    };
    zen.error("...fromDomNode: returning null, node => %s, i => %s", node, i);
    return null;
}
*/

// Create a component that refers to an HTML text node or HTML
// element. This avoids some conflict with Dojo that results when
// trying to use prototype.js to add methods to an element. It also is
// more future proof since an element can be handled in a clean way.
//
// FIXME: Can text nodes have attributes?
zen.createTextNode = function(text, attributes) {
    var domNodeCompon = zen.createNew(DomNodeCompon);
    zen.info("ENTER createTextNode: text => %s, attributes => %s", text, attributes);
    // FIXME: Use dojo.create, if appropriate.
    var domNode = document.createTextNode(text);
    zen.log("createTextNode: domNode => %s", domNode);
    zen.domNodeCompons.push(domNodeCompon);
    zen.log("createTextNode: # of domNodeCompons => %s", zen.domNodeCompons.length);
    domNodeCompon.domNode = domNode;
    return domNodeCompon;
};

// FIXME: Consider using dojo.fromJSON here for safety.
zen.createElement = function(kind, attributes) {
    zen.info("ENTER createElement: kind => %s", kind);
    var domNodeCompon = zen.createNew(DomNodeCompon);
    zen.log("createElement: kind => %s, attributes => %s", kind, attributes);
    // FIXME: Use dojo.create.
    var domNode = document.createElement(kind);
    zen.log("createElement: domNode => %s", domNode);
    zen.domNodeCompons.push(domNodeCompon);
    zen.log("createElement: # of domNodeCompons => %s", zen.domNodeCompons.length);
    attributes = attributes || {};
    if (typeof attributes.klass != "undefined") {
	dojo.addClass(domNode, attributes.klass);
	delete attributes.klass;
	zen.log("added class");
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
    zen.info("ENTER createSubtree: rule => %s, componKind => %s", rule, componKind);
    zen.debug("createSubtree: treeSpec => %s", treeSpec);
    constructor = zen.rule2ref(rule);
    zen.debug("createSubtree: constructor => %s", constructor);
    zen.log("createSubtree: typeof => %s", typeof constructor);
    parentCompon = constructor.call(document, componKind, initParms);
    zen.log("createSubtree: parentCompon => %s", parentCompon);
    len = subtree.length;
    for (i=0; i<len; i++) {
	compon = zen.createSubtree(subtree[i]);
	compon.appendMyselfToParent(parentCompon);
    };
    zen.log("EXIT createSubtree, parentCompon => %s", parentCompon);
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
    zen.debug("ENTER rule2ref");
    var s, ref = null;
    for (s in zen.shortcutsTable) {
	if (s == rule) {
	    //ref = eval(zen.shortcutsTable[rule]);
	    ref = dojo.fromJson(zen.shortcutsTable[rule]);
	}
    }
    if (!ref) {
	//ref = eval(rule);
	ref = dojo.fromJson(rule)
    };
    zen.debug("EXIT rule2ref: ref => %s", ref);
    return ref;
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
    zen.log("ENTER renderTree, tree => %s, parent => %s", tree, parent);
    newComponent = zen.createSubtree(tree);
    zen.log("  renderTree: newComponent => %s", newComponent);
    newComponent.appendMyselfToParent(parent);
    zen.startup();
    zen.log("EXIT renderTree");
    return newComponent;
};

//FIXME: Use dojo.create.
zen.boxCompon = function(component, tbl) {
    zen.log("ENTER boxCompon");
    var row = zen.createElement("tr");
    var cell = zen.createElement("td", {klass:"boxTD1"});
    var div = zen.createElement("div", {klass:"visualRep"});
    zen.log("boxCompon: createTextNode %s", component);
    var text = zen.createTextNode("" + component);
    zen.log("boxCompon: createTextNode done, call dojo.attr");
    dojo.attr(cell.domNode, "mouseover",
	      function() {
		  var domNode = component.getDomNode();
		  zen.log("boxCompon: component => %s, domNode => %s, domNode.childNodes => %s",
			  component, domNode, domNode.childNodes);
		  domNode.savedBackgroundColor = dojo.style(domNode, "backgroundColor");
		  dojo.style(domNode, { backgroundColor: "lightblue" });
		  dojo.forEach(domNode.childNodes,
			       function(n) { dojo.addClass(n,"invisible"); }
			      );
	      });
    dojo.attr(cell.domNode, "mouseout",
	      function() {
		  var domNode = component.getDomNode();
		  dojo.style(domNode, "backgroundColor", domNode.savedBackgroundColor);
		  dojo.forEach(domNode.childNodes,
			       function(n) { dojo.removeClass(n, "invisible"); }
			      );
	      });
    zen.log("boxCompon: called dojo.attr");
    tbl.appendChild(row);
    zen.log("boxCompon: appended row");
    row.appendChild(cell);
    zen.log("boxCompon: appended cell");
    cell.appendChild(div);
    zen.log("boxCompon: appended div");
    div.appendChild(text);
    zen.log("EXIT boxCompon: returning compon with domNode => %s", row.domNode);
    return row;
};

// FIXME: Use dojo.create.
zen.boxTable = function(componList, tbl) {
    var tbl1, i, len = componList.length, compon, children, row, cell, div;
    zen.log("ENTER boxTable: len => %s", len);
    for (i=0; i<len; i++) {
	zen.log("boxTable: i => %s", i);
	zen.group("boxTable: componList");
	zen.dir(componList);
	zen.groupEnd();
	compon = componList[i];
	zen.log("boxTable: compon => %s", compon);
	row = zen.boxCompon(compon, tbl);
	zen.log("boxTable: compon => %s, compon.domNode => %s", compon, compon.domNode);
	children = compon.getChildCompons();
	zen.group("boxTable: component children");
	zen.dir(children);
	zen.groupEnd();
	if (children.length > 0) {
	    zen.log("boxTable: create cell");
	    cell = zen.createElement("td", { klass: "boxTD2" });
	    zen.log("boxTable: row.domNode => %s", row.domNode);
	    row.appendChild(cell);
	    zen.log("boxTable: create table");
	    tbl1 = zen.createElement("table", { klass: "boxTable" });
	    zen.log("boxTable: append table to cell");
	    cell.appendChild(tbl1);
	    zen.boxTable(children, tbl1);
	};
    };
    zen.log("EXIT boxTable");
};

//FIXME: Maybe we could think up a good scheme for which components to
//save and which to destroy.
zen.clearTheCanvas = function (componsToDestroy, componsToSave) {
    if (typeof componsToSave == "undefined" || !componsToSave) {
	componsToSave = null;
    };
    zen.log("ENTER clearTheCanvas, destroying compons %s except for %s",
	    componsToDestroy, componsToSave);
    zen.log("componsToDestroy.length => %s", componsToDestroy.length);
    dojo.forEach(componsToDestroy,
		 function(compon) { zen.log("compon => %s", compon); }
		);
    zen.log("Destroying ...");
    dojo.forEach(componsToDestroy,
		 function(compon) {
		     zen.log("compon => %s", compon);
		     if (!componsToSave ||
			 (componsToSave.indexOf(compon) < 0)) {
			 compon.destroyCompon();
		     };
		 });
    //zen.domNodeCompons = [];
    //zen.widgets = [];
    zen.log("EXIT clearTheCanvas");
};

zen.clearTheHierarchyDiagram = function () {
    var diagramPaneElementx, diagramPaneCompon;
    zen.log("ENTER clearTheHierarchyDiagram");
    diagramPaneElement = dojo.byId("diagramPane");
    if (!diagramPaneElement) {
	diagramPaneElement =
	    zen.createElement(
		"div",
		{ id: "diagramPane",
		  style:
		  "position:absolute;width:100px;height:100px;top:100px;left:300px;",
		  duration: "750"
		});
	zen.body.appendChild(diagramPaneElement);
    };
    diagramPaneCompon = dijit.byId("diagramPane");
    // Even if an element with id 'diagramPane' exists, we need to
    // have a Zen component so that we can use it. If we already have
    // a widget with that id, we can use that.
    if (!diagramPaneCompon) {
	diagramPaneCompon = zen.createNew(DomNodeCompon, dojo.byId("diagramPane"));
    }
    var compons = diagramPaneCompon.getChildCompons();
    zen.log("compons => %s", compons);
    dojo.forEach(diagramPaneCompon.getChildCompons(),
		 function(child) {
		     zen.log("Destroying %s", child);
		     child.destroyCompon();
		 });
    zen.log("EXIT clearTheHierarchyDiagram");
};

// These shortcuts make it easy to specify methods for creating
// various kinds of components.
zen.shortcutsTable = {
    createElement : zen.createElement,
    createTextNode : document.createTextNode,
    createDijit : zen.createDijit
};

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
		    zen.log("dojo.io.iframe.send callback succeeded");
		    //smallToolbox = result.toolbox;
		    smallToolbox = result;
		    zen.group("json iframe");
		    zen.dir(result);
		    zen.groupEnd();
		    zen.walkZenSpec(
			result,
			function() { zen.requireSubtreeDijit(arguments[0]); }
		    );
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
    zen.body = zen.createNew(DomNodeCompon, dojo.body());
    zen.group("zen.body");
    zen.dir(zen.body);
    zen.groupEnd();
    dojo.require("dijit._base.manager");
    dojo.require.apply(null, ["dojo.io.iframe"]);
    dojo.addOnLoad(ioIframeGetJson);
}
