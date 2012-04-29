dojo.provide("zen");

zen.registry = { DomNodeCompon : {} };

require(['dojo/_base/declare'], function(declare) {
    declare("zen.DomNodeCompon", null, {
	////
	//// ZEN DOM NODE COMPONENT - FOR CREATING TREE-COMPOSIBLE WEB PAGES
	////
	//// zen.DomNodeCompon - a Dojo class to create encapsulated DOM nodes
	//// 
	//// Like any ZEN COMPONENT, a zen.DomNodeCompon implements the
	//// following interface:
	////	constructor(id, domNode) - create the component and give it the
	////       identifier 'id' or an automatically generated unique one
	////       if 'id' is null or false; returns the new component or false
	////       if 'id' was already used
	////    getDomNode - returns 'domNode'; this is the DOM node used to
	////       connect the component to some kinds of other components
	////    getParent - get the parent Zen component
	////    appendTo(parent) - appends the component to 'parent', a Zen
	////       component
	////    remove - removes the component and all its children
	////    getChildCompons - get the child Zen components
	////
	constructor: function (id, domNode) {
            this.id = id || zen.getUniqueId("zen_DomNodeCompon");
            zen.registry.DomNodeCompon[this.id] = this;
            this.domNode = domNode || null; // "null" reads nicer than "undefined".
            this.children = [];
	},
	toString: function () { // Without this, we get '[object Object]'.
            var rep;
            rep = String(this.domNode).replace(/^\[object /, "[HTML Compon ").replace(/\]$/, "]");
            return rep;
	},
	getId: function () {
	    return this.id;
	},
	getDomNode: function () {
	    return this.domNode;
	},
	appendMyselfToParent: function (parent) {
	    var htmlElement, oldBody;
	    if (this.getDomNode().nodeName == "BODY") {
		console.log("Appending BODY element");
		oldBody = dojo.body();
		console.log("oldBody => " + oldBody);
		if (parent.getDomNode().nodeName != "HTML") {
		    console.log("parent.nodeName != 'HTML'");
		    if (parent.getDomNode() == oldBody) { // Special case: replace the old body.
			console.log("Replace old body");
			htmlElement = oldBody.parentElement;
			htmlElement.removeChild(oldBody);
			console.log("Removed old body");
			htmlElement.appendChild(this.getDomNode());
			console.log("Appending new BODY element");
			return this;
		    } else {
			new Error("Cannot append a BODY element to the specified parent");
		    }
		}
	    }
	    parent.appendChild(this);
	    return this;
	},
	appendChild: function (child) {
            this.domNode.appendChild(child.getDomNode());
            this.children.push(child);
	},
	getChildCompons: function () { //FIXME: WORKING ON THIS: WAS BROKEN!
            return this.children;
            /*
              zen.log("DomNodeCompon.getChildCompons: domNode => %s", this.domNode);
              return dojo.map(this.domNode.children,
              function (c) {
              var w = dijit.byNode(c);
              //return w || c;
              return w || DomNodeCompon.fromDomNode(c);
              });
            */
	},
	destroyCompon: function () {
            var compon, index;
            dojo.forEach(this.getChildCompons(),
			 function (child) { child.destroyCompon(); });
            dojo.destroy(this.domNode);
            index = zen.DomNodeCompon.domNodeCompons.indexOf(this);
            if (index >= 0) {
		delete zen.DomNodeCompon.domNodeCompons[index];
		compon = zen.DomNodeCompon.domNodeCompons.pop();
		if (index !== zen.DomNodeCompon.domNodeCompons.length) {
                    zen.DomNodeCompon.domNodeCompons[index] = compon;
		} else {
                    console.warn("compon was last in the list; won't put it back!");
		}
            } else {
		//FIXME: Remove this console output:
		console.group("zen.DomNodeCompon.domNodeCompons");
		console.dir(zen.DomNodeCompon.domNodeCompons);
		console.groupEnd();
            }
	}
    });
});

//FIXME: Consider moving aside console.debug, console.info, etc. to implement
//controllable debugging.
(function (zen) {
    console.warn("Do zen module preliminaries");
    var z = zen;
    TraceArguments = {
	//FIXME: Explore how to use dojox.lang.aspect for debugging.
        before: function(){
	    var joinPoint = dojox.lang.aspect.getContext().joinPoint,
            args = Array.prototype.join.call(arguments, ", ");
            console.debug("=> " + joinPoint.targetName + "(" + args + ")");
        }
    };
    TraceReturns = {
	//FIXME: Explore how to use dojox.lang.aspect for debugging.
        afterReturning: function(retVal){
            var joinPoint = dojox.lang.aspect.getContext().joinPoint;
            console.debug("<= " + joinPoint.targetName + " returns " +
			  ((typeof retVal == "function") ? "function" : retVal));
        },
        afterThrowing: function(excp){
            var joinPoint = dojox.lang.aspect.getContext().joinPoint;
            console.debug("<= " + joinPoint.targetName + " throws: " + excp);
        }
    };
    dojo.require("dijit.form.Button");
    dojo.require("dijit.form.CheckBox");
    dojo.require("dojo.parser");

    console.warn("Define zen.createNew");
    var hiddenLink = function () {};
    z.createNew = function () {
	////
	//// DECLARATIVE OBJECT CREATOR
	////
	//// zen.createNew - a function to create objects, based upon
	//// a similar function by Douglas Crockford. Thanks to Eric
	//// Bréchemier (see bit.ly/9PiU5W) for some
	//// clarification. This function allows an object's
	//// instantiation to be described in a declarative way; the
	//// not-so-good alternative is to describe the instantiation
	//// by putting the 'new' operator in a string and instantiate
	//// the object by evaluating the string.
	//
	// Arguments: constructor function, followed by its arguments
	// Return: a new instance of the "constructor" kind of objects
	//
	// Example usage:
	//   var object = createNew(...);
	//     is equivalent to
	//   var object = new constructor(...);
	//
        // Preliminaries: convert arguments to a real array, get the
        //                constructor, and get the arguments to the
        //                constructor.
	try {
	    //console.warn("Trying to get args");
            var args = Array.prototype.slice.call(arguments);
	} catch (e) {
	    console.error("Error in Array.prototype.slice.call(" + arguments + "): " + e);
	}
        var constructor = args[0];
        var constructorArgs = args.slice(1);
        // Step 1: Create a new empty object instance linked to the
        //         prototype of provided constructor.
        hiddenLink.prototype = constructor.prototype;
        var object = new hiddenLink(); // cheat: use new to implement new
        // Step 2: Apply the constructor to the new instance and get
        //         the result.
	try {
            var instance = constructor.apply(object, constructorArgs);
	} catch (e) {
	    console.error("Error in constructor.apply(object, constructorArgs): " + e);
	}


        // Step 3: Check the result, and choose whether to return it
        //         or the created instance.
        return typeof instance === "object" ? instance : object;
    };

    console.warn("Define zen.createElement");
    var _instanceCounters = {};
    z.getUniqueId = function (objectType) { // objectType is a string
        var count;
        if (typeof _instanceCounters[objectType] === "undefined") {
	    //console.debug("count = 0");
            count = 0;
            _instanceCounters[objectType] = count;
        } else {
	    //console.debug("count => " + count);
            count = ++_instanceCounters[objectType];
	    //console.debug("count => " + count);
        }
        return objectType + "_" + count;
    };
    z.createElement = function (kind, attributes) {
	// FIXME: Fix non-absolute href URLs for <a> tags.
	new Error("zen.createElement");
        var domNodeCompon = zen.createNew(zen.DomNodeCompon), domNode;
	// FIXME: Use dojo.create. FIXME: Styles applied to the body won't work!
	if (kind.toLowerCase() == "style") {
	    console.error("Error: STYLE element being created");
	}
	if (kind == "BODY") {
	    // Reuse the old body if it exists.
	    domNode = dojo.body() || dojo.create(kind);
	} else {
	    domNode = dojo.create(kind);
	}
	zen.DomNodeCompon.domNodeCompons.push(domNodeCompon);
	attributes = attributes || {};
	if (kind == "IMG" && attributes.src) { // Turn a relative URL into an absolute one.
	    src_split = attributes.src.split("http://");
	    if (src_split.length < 2) { // No match: must be relative.
		console.info("Going to make IMG URL absolute");
		attributes.src = "http://" + host + src_split;
		console.info("fixed new IMG URL: attributes.src => " + attributes.src);
	    }
	}
	if (attributes.style) {
	    if (typeof attributes.style == "object") {
		x = "";
		for (i in attributes.style) { x += attributes.style[i]; }
	    } else {
		x = attributes.style;
	    }
	    //console.log("Calling zen.fixCssDeclUrl: attributes.style => " + x + ", host => " + host +
	    //		  ", typeof attributes.style => " + typeof attributes.style);
	    attributes.style = zen.fixCssDeclUrl(attributes.style, host);
	    //console.log("zen.fixCssDeclUrl returned " + attributes.style);
	}
        if (typeof attributes.klass !== "undefined") {
            dojo.addClass(domNode, attributes.klass);
            delete attributes.klass;
        }
        dojo.attr(domNode, attributes || {}); //FIXME: Check this.
        domNodeCompon.domNode = domNode;
	////console.log("zen.createElement returning " + domNodeCompon);
        return domNodeCompon;
    };

    console.warn("Define zen.createTextNode");
    z.createTextNode = function (kind, text) {
        var domNodeCompon = zen.createNew(zen.DomNodeCompon);
        // FIXME: Use dojo.create, if appropriate.
        var domNode = document.createTextNode(text);
        zen.DomNodeCompon.domNodeCompons.push(domNodeCompon);
        domNodeCompon.domNode = domNode;
        return domNodeCompon;
    };

    console.warn("Define zen.createDummyElement");
    z.createDummyElement = function (kind, attributes) {
	console.warn("zen.createDummyElement: kind => " + kind + ", attributes => " + attributes);
        var domNodeCompon = zen.createNew(zen.DomNodeCompon);
        // FIXME: Use dojo.create.
	var domNode;
	/*
	if (attributes.style) {
	    if (typeof attributes.style == "object") {
		x = "";
		for (i in attributes.style) { x += attributes.style[i]; }
	    } else {
		x = attributes.style;
	    }
	}
	console.log("zen.createDummyElement: attributes.style => " + x +
		    ", typeof attributes.style => " + (typeof attributes.style));
	*/
	if (kind == "STYLE") {
	    domNode = document.createElement("textarea");
	    dojo.style(domNode, "display", "none");
	} else {
            domNode = document.createElement("noscript");
	}
        zen.DomNodeCompon.domNodeCompons.push(domNodeCompon);
        attributes = attributes || {};
        if (typeof attributes.klass !== "undefined") {
            dojo.addClass(domNode, attributes.klass);
            delete attributes.klass;
        }
	if (kind == "STYLE") {
	    dojo.addClass(domNode, "zenStyle"); // Don't add "type='text/css'" attribute.
	} else {
            dojo.attr(domNode, attributes || {}); //FIXME: Check this.
	}
        domNodeCompon.domNode = domNode;
        return domNodeCompon;
    };

    console.warn("Define zen.createSubtree");
    z.createSubtree = function (treeSpec) {
        var i, rule, parentCompon, compon, len, constructor, element;
        var componKind = treeSpec[0], initParms = treeSpec[1], subtree = treeSpec[2];
	//console.warn("zen.createSubtree: componKind => " + componKind + ", initParms => " + initParms);
	if (componKind == "CANVAS") {
	    alert("CANVAS");
	}
        rule = invertedRulesTable[componKind];
        constructor = z.rule2ref(rule);
        parentCompon = constructor.call(document, componKind, initParms);
        len = subtree.length;
        for (i = 0; i < len; i++) {
            compon = z.createSubtree(subtree[i]);
	    //if (compon.domNode.nodeName != "STYLE") {
		compon.appendMyselfToParent(parentCompon);
	    /*
	    } else {
		console.warn("Appending STYLE tag to unrendered element");
		try {
		    compon.appendMyselfToParent(unrendered); // This and its children won't be added to the DOM.
		} catch(e) {
		    console.error("Could not append to 'unrendered' node: " + e);
		}
		console.warn("Creating NOSCRIPT Zen component");
		try {
		    element = zen.createElement("NOSCRIPT");
		} catch (e) {
		    console.error("Could not create NOSCRIPT Zen element: " + e);
		}
		console.warn("Appending NOSCRIPT component to parent");
		try {
		    element.appendMyselfToParent(parentCompon); // Substitution to make createSubtree work.
		} catch (e) {
		    console.error("Could not append NOSCRIPT element: " + e);
		}
		console.warn("Appended NOSCRIPT component to parent");
	    }
	    */
        }
        return parentCompon;
    };

    console.warn("Define rulesTable and invertedRulesTable");
    rulesTable = {
	// Each property of rulesTable is the name of a rule
	// (i.e. function) for creating a kind of component. The value
	// of each property is the set (an array) of the kinds of
	// component that can be created using the rule.  FIXME:
	// Should not have to include upper case tag names.  FIXME:
	// Check the categorizations of the elements given by the
	// comments.
        createElement : [ 
	    // Head elements (nodes?)
	    "META", "TITLE", "LINK",
	    // Inline elements
	    "A", "ABBR", "ACRONYM", "B", "BDO", "BIG", "BR", "CITE", "CODE",
	    "DFN", "EM", "I", "IMG", "INPUT", "KBD", "LABEL", "Q", "SAMP",
	    "SELECT", "SMALL", "SPAN", "STRONG", "SUB", "TEXTAREA", "TT",
	    "VAR", "LEGEND", "U", "NOBR", "OPTION", "BDI", "NOSCRIPT", // "STYLE",
	    "CANVAS",
	    // Block elements
	    "BODY",
	    "IFRAME", "DIV", "P", "CENTER", "HR", "EMBED", "FONT",
	    "TABLE", "TR", "TD", "AREA",
	    // Defined as block-level components in HTML 4
	    "ADDRESS", "BLOCKQUOTE", "DIV", "DL", "FIELDSET", "FORM",
	    "H1", "H2", "H3", "H4", "H5", "H6",
	    "OL", "P", "PRE", "TABLE", "UL",
	    // Elements that may also be considered block-level
	    // elements since they may contain block-level elements
	    "DD", "DT", "LI", "TBODY", "TD", "TFOOT", "TH", "THEAD", "TR",
	    // Elements that may be used as either block-level or
	    // inline elements
	    "BUTTON", "DEL", "INS", "MAP", "OBJECT", "PARAM"
	],
	createDummyElement : [
	    "SCRIPT", "STYLE"
	],
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
    var invertedRulesTable = {
	// This is a table for looking up a rule given a component
	// name as a key.
    };

    console.warn("Define zen.rule2ref");
    z.rule2ref = function (rule) {
	// Note: the eval method is not used here because it can be
	// unsafe. FaceBook and MySpace, for example, won't allow it
	// in included JavaScript. See
	// http://www.dojotoolkit.org/reference-guide/dojo/_base/json.html
	// for a safe way to evaluate JSON strings.
        var s, ref = null;
        for (s in zen.shortcutsTable) {
            if (zen.shortcutsTable.hasOwnProperty(s)) {
                if (s === rule) {
                    ref = dojo.fromJson(zen.shortcutsTable[rule]);
                }
            }
        }
        if (!ref) {
            //ref = eval(rule);
            ref = dojo.fromJson(rule);
        }
        return ref;
    };

    var requireSubtreeCompon = function (treeSpec) {
        var i, rule = "", parentCompon, compon, len, constructor, parentDomNode,
        componKind = treeSpec[0],
        initParms = treeSpec[1],
        subtree = treeSpec[2];
        rule = invertedRulesTable[componKind];
        if (rule === "createDijit") {
	    // NOTE: We can't just call dojo.require() in this file because that
	    // messes up the loading of this module via "dojo.require('zen')".
	    // Instead, we make a call like "dojo.require.apply(null, [klass]);".
	    // FIXME: Try to use Dojo 1.7's require() API.
            dojo.require.apply(null, [componKind]);
        };
    };

    //z.headNode = null;
    //FIXME: Check whether a STYLE node could contain more than one TEXT nodes.
    /*z.filterHeadNodesAndRender = function (treeSpec, head) {
	var kind = treeSpec[0], attributes = treeSpec[1];
	//console.debug("zen.filterHeadNodesAndRender: kind => " +
	//	      kind + ", attributes => " + attributes);
	if (kind == "STYLE" || kind == "TITLE" || kind == "META" || kind == "LINK") {
	    node = document.createElement(kind);
	    dojo.attr(node, attributes || {}); //FIXME: check this.
	    head.appendChild(node);
	    if (kind == "STYLE" || kind == "TITLE") {
		z.headNode = node;
	    }
	    console.debug("Added style, title, or meta => " + z.headNode);
	} else if (treeSpec[0] == "text" && zen.headNode) {
	    node = document.createTextNode(attributes);
	    z.headNode.appendChild(node);
	    console.debug("Added text under style or title => " + z.headNode + ", attributes => " +
			 attributes);
	    z.headNode = null;
	}
	//console.debug("Exiting zen.filterHeadNodesAndRender");
    }*/

    console.warn("Define walkTheDOM, walkZen, and zen.walkZenSpec");
    var walkTheDOM = function (node, func) {
	// As per Douglas Crockford.
        func(node); 
        node = node.firstChild; 
        while (node) { 
            z.walkTheDOM(node, func);
            node = node.nextSibling; 
        } 
    } 
    var walkZen = function (compon, func) {
	//FIXME: Use this function where useful.
        func(compon);
        dojo.forEach(compon.getChildCompons(),
                     function (child) { z.walkZen(child, func); });
    };
    z.walkZenSpec = function (treeSpec, func) {
	//z.walkZenSpec(z.toolbox, console.info); // Example usage.
        func(treeSpec);
        dojo.forEach(treeSpec[2],
                     function (subtree) { z.walkZenSpec(subtree, func); });
    };

    console.warn("Define zen.nodeToObject, zen.nodeToJson, and zen.browserCollectionToArray");
    z.nodeToObject = function (node) {
	//FIXME: Try to use walkTheDOM.
	if (node.nodeType == 3) {
	    return ["text", node.textContent, []];
	} else if (node.nodeType == 1) {
            if (node.tagName == "SCRIPT") {
                return null;
            }
	    var i = 0, attr = node.attributes, len, attributes = {};
	    if (attr) {
		var len = attr.length;
		for (i ; i < len; i++) {
                    var name = attr[i].name;
		    if (attr[i].name == "class") {
			attributes.klass = attr[i].value;
		    } else if (attr[i].name.slice(0,2) == "on") {
                        attributes[name] = "";
                    } else if (attr[i].name != '"') {//Test for malformed attribute (as at yahoo.com)
			attributes[name] = attr[i].value;
		    }
		}
	    }
	    var children = []; //FIXME: Incl. text nodes, so use better name.
	    var i = 0, j = 0, len = node.childNodes.length;
	    for (i; i < len; i++) {
		var child = node.childNodes[i];
		//children[i] = z.nodeToObject(child);
		var obj = z.nodeToObject(child);
                if (obj) {
                    children[j] = obj;
                    j += 1;
                }
	    }
	    return [node.tagName, attributes, children];
	} else {
            return null;
        }
    }
    z.nodeToJson = function (obj) {
	return dojo.toJson(z.nodeToObject(obj));
    }
    z.browserCollectionToArray = function (collection) {
	//FIXME: Unused.
	ary = [];
	//FIXME: Maybe there is a more functional way of doing this.
	for (i = 0; i < collection.length; i++) {
	    console.debug("Calling zen.nodeToObject: node => ", collection[i]);
	    ary.push(collection[i]);
	}
	return ary;
    }

    console.warn("Define zen.renderTree, zen.renderTreeDeferred and zen.renderForest");
    z.renderTree = function (tree, parent) {
        var newComponent;
	//dojox.lang.aspect.advise(zen, "createSubtree", [TraceReturns, TraceArguments]);
        newComponent = z.createSubtree(tree);
	saveNewComponent = newComponent;
	console.log("zen.renderTree: returned from zen.createSubtree; parent => " + parent);
        newComponent.appendMyselfToParent(parent);
	console.log("zen.renderTree: appended newComponent to parent; calling zen.startup");
        z.startup();
	console.log("zen.renderTree: exiting");
        return newComponent;
    };
    z.renderTreeDeferred = function (tree, parent, deferred) {
	// Asynchonous Ajax requests will be made to retrieve
	// JavaScript modules that will handle some rendering.
        var newComponent;
        z.walkZenSpec(
            tree,
            function(tree) {
		//console.debug("zen.walkZenSpec: tree => " + tree);
                requireSubtreeCompon(tree);
            });
        dojo.addOnLoad(function() {
	    //console.debug("zen.renderTreeDeferred: loaded, now calling createSubtree");
            newComponent = z.createSubtree(tree);
	    //console.debug("zen.renderTreeDeferred: newComponent => " +
	    //		    newComponent);
            newComponent.appendMyselfToParent(parent);
            z.startup();
	    //console.debug("zen.renderTreeDeferred: calling deferred.resolve()");
            //deferred.resolve(newComponent);
        });
    };
    z.renderForest = function (forest, parent) {
	var i, len = forest.length;
	//dojox.lang.aspect.advise(z, "createSubtree", [TraceReturns, TraceArguments]);
	for (i=0; i<len; i++) {
	    z.renderTree(forest[i], parent);
	}
    }

    console.warn("Define zen.fixCssDeclUrl and zen.fixClassesURLs");
    z.fixCssDeclUrl = function (cssDecl, host, options) {
	// THIS METHOD MAKES A RELATIVE URL IN A CSS DECLARATION
	// ABSOLUTE so that an image file can be loaded from a
	// different website.  FIXME: Rename this something like
	// rebaseStyleUrl and provide it with the new base. Typically
	// this would be used to convert a relative path to an
	// absolute path.  FIXME: For convenience in zen.fixClassURLs,
	// return null if the cssDecl is unchanged.  FIXME: See
	// fixClassesURLs for more FIXMEs.
	i = null;
	j = 0;
	opt = options || {};
	scheme = opt.scheme || 'http://';
	port = opt.port || '';
	user = opt.user || '';
	password = opt.password || '';
	console.log("Entering zen.fixCssDeclUrl: cssDecl => " + cssDecl + ", host => " + host +
		    ", typeof cssDecl => " + typeof cssDecl);
	var cssDeclParts, len, i;
	if (typeof cssDecl == "string") {
	    // Use a regular expression to split out the attributes from a CSS declaration.
	    // Two patterns are used to match attributes: (1) a background attribute
	    // with a URL -- something like 'url(...);' and (2) any other kind of
	    // attribute. A simpler regular expression would split a background
	    // attribute containing a URL into two parts, whereas we want only one
	    // part per attribute.
	    //re = /(background: url\(.*?\).*?;)|((?!background: url\(.*?\).*?);)/;
	    //FIXME: The next re leaves a ';' at the end of 1 match if there is 'data'.
	    //ALMOST OK?
	    re = /(background:.*?url\(.*?\).*?;)/ //|((?!background:.*?url\(.*?\).*?);)/;
	    //re = /((?!background:.*?url\(.*?\).*?);)|/;
	    //FIXME: This re mistakenly chops off the data URL at its ';'.
	    //re = /((background:.*?url\(.*?\).*?)(?:;))|((?!background:.*?url\(.*?\).*?);)/;
	    re = /;/;	    
	    cssDecl = cssDecl.replace(/(background.*?url\("data:.*?);(.*?\))/,'$1#$2');
	    ////console.debug("cssDecl => " + cssDecl);
	    cssDeclParts = cssDecl.split(re).filter(function(el) {
		return (el != ';' && el != ' ' && el != '' && typeof el != 'undefined');
		////FIXME: Delete this. return (el != ';' && el != '' && typeof el != 'undefined');
	    });
	} else {
	    cssDeclParts = [];
	    for (i in cssDecl) {
		cssDeclParts[j] = i + ":" + cssDecl[i] + "; ";
	    }
	}
	////console.debug("cssDeclParts => " + cssDeclParts);
	//console.group("cssDeclParts");
	//console.dir(cssDeclParts);
	//console.groupEnd();
	len = cssDeclParts.length;
	var foundBackgroundSpec = false;
	for (i = 0; i < len; i++) {
	    // Split out the style properties from the attribute, making sure
	    // not to mistake the colon in 'data:' for a property deliminator.
	    //FIXME: Search for single-quote character (') below?
	    idx = cssDeclParts[i].indexOf(":");
	    styleProp = cssDeclParts[i].slice(0, idx);
	    styleValue = cssDeclParts[i].slice(idx + 1);
	    ////console.debug("styleProp => " + styleProp + ", styleValue => " + styleValue);
	    if (styleProp == "background") {
		foundBackgroundSpec = true;
		console.warn("##### Found background: cssDeclParts[i] => " + cssDeclParts[i]);
		if (cssDeclParts[i].search(/\(\"data:/) < 0) {
		    // A URL that starts with '//' is a protocol relative URL.
		    // See http://paulirish.com/2010/the-protocol-relative-url/ .
		    valueParts = styleValue.match('(url.*)(\".*)(\/\/.*)');
		    ////console.debug("valueParts => " + valueParts);
		    if (valueParts) {
			// Convert protocol relative URL to absolute-path URL.
			styleValue = valueParts[1] + '"' + scheme + valueParts[3].slice(2);
		    } else if (styleValue.indexOf("url(") >= 0 && styleValue.indexOf("http://") < 0) {
			// Convert a relative-path URL to an absolute-path URL.
			////console.debug('styleValue.indexOf("http://") < 0');
			idx = styleValue.indexOf('(') + 1;
			console.debug("Get index of relative URL in style: idx => " + idx);
			quoteUsed = styleValue.charAt(idx) == '"'? true : false;
			if (quoteUsed) {
			    idx += 1;
			}
			if (styleValue.charAt(idx) == '/') {
			    console.debug("Incremented index by one for full path URL (which includes root /)");
			    idx += 1;
			}
			styleValue = 'url(' + (quoteUsed? '"' : '') + scheme + (user? (user+'@') : '') + (password? (password+':') : '') +
			    host + (port? (':'+port) : '') + '/' + styleValue.slice(idx);
			console.debug("styleValue (with host, scheme, etc.) => " + styleValue);
		    }			
		} /* else {
		    console.debug("##### Found data URL => cssDecl => " + cssDecl + ", cssDeclParts[i] => " + cssDeclParts[i]);
		    //FIXME
		} */
		////console.debug("##### styleValue => " + styleValue);
	    }
	    cssDeclParts[i] = styleProp + ":" + styleValue;
	    //console.debug("##### cssDeclParts[" + i + "] => " + cssDeclParts[i]);
	}
	if (foundBackgroundSpec) {
	    //cssDeclParts.push(""); // Ensures a ";" at the end of the join. FIXME: Probably should not do this.
	    cssDeclParts.push("");
	    cssDecl = cssDeclParts.join(";");
	    cssDecl = cssDecl.replace(/(background.*?url\("data:.*?)#(.*?\))/,'$1\;$2')
	    //console.debug("##### Joined: cssDeclParts => " + cssDeclParts +
	    //		  ", cssDecl => " + cssDecl);
	}
	console.debug("Leaving zen.fixCssDeclUrl: cssDecl => " + cssDecl);
	return cssDecl;
    }
    z.fixClassesURLs = function (doc) { // doc can be a document in an iframe.
	// Method to adjust the URLs in a web page's stylesheets to work
	// on a different domain.
	// NOTE: We are not editing the styles of a DOM node here.
	//
	// Doing some reading in some good places turns up some possibly good code:
	// http://archive.plugins.jquery.com/project/jquerycssrule allows you to
	//   $.rule('.classname', 'style').append('font-size: 30px');
	// http://archive.plugins.jquery.com/project/jquerycssrule allows you to
	//   var cssRuleText = " \
	//       body { font-size: 16px; } \
	//       * html body { font-size: 100%; } \
	//     ";
	//   $.tocssRule(cssRuleText);
	//
	// There is also some bad code that ranks high in a Google query for
	// "how to modify css rule":
	// http://www.javascriptkit.com/dhtmltutors/externalcss3.shtml
	// http://www.rainbodesign.com/pub/css/css-javascript.html
	//
	// FIXME: Rename this something like rebaseStyleUrls or rebaseStylesheetUrls
	// and see also fixCssDeclUrl.
	// FIXME: The argument should be a stylesheet, not a document.
	// FIXME: Replace globals with locals (and that goes for other functions, too).
        styleSheets = doc.styleSheets;
	console.group("zen.fixClassesURLS: styleSheets");
	console.dir(styleSheets);
	console.groupEnd();
        if (styleSheets.length > 0) {
	    console.debug("styleSheets.length");
            styleSheetsLen = styleSheets.length;
            isIEorSafari = typeof styleSheets[0].cssRules == "undefined" ? true : false;
	    console.debug("isIEorSafari");
            for (i=0; i<styleSheetsLen; i++) {
		console.debug("zen.fixClassesURLs: i => " + i);
                if (isIEorSafari) {
	            new Error('not implemented'); //FIXME: For IE and Safari
                } else {
                    rulesLen = styleSheets[i].cssRules.length;
		    console.warn("zen.fixClassesURLs: rulesLen => " + rulesLen);
                    for (j=0; j<rulesLen; j++) {
			console.debug("zen.fixClassesURLs: j => " + j);
                        rule = styleSheets[i].cssRules[j];
                        if (rule.type != 4) { // type 4 is for @media rules
			    console.debug("rule => " + rule.selectorText +
			    		  " { " + rule.style.cssText + " }");
			    cssText = zen.fixCssDeclUrl(rule.style.cssText, zen.remoteHost);
			    if (cssText != rule.style.cssText) {//FIXME: Bug: true even for inconsequential differences.
				dojo.withDoc(doc,
					     function() { dojox.html.insertCssRule(rule.selectorText, cssText); },
					     window,
					     null);
			    }
                        }
                    }
                }
            }
        }
	console.debug("zen.fixClassesURLs: exiting");
	console.group("zen.fixClassesURLS: styleSheets");
	console.dir(styleSheets);
	console.groupEnd();
    }

    console.warn("Define diagramming functions");
    var boxCompon = function (component, tbl) {
	//FIXME: Use dojo.create.
        var row = z.createElement("tr");
        var cell = z.createElement("td", {klass: "boxTD1"});
        var div = z.createElement("div", {klass: "visualRep"});
        var text = createTextNode(component.toString());
        dojo.attr(
            cell.domNode,
            "mouseover",
            function () {
                var domNode = component.getDomNode();
                domNode.savedBackgroundColor = dojo.style(domNode, "backgroundColor");
                dojo.style(domNode, { backgroundColor: "lightblue" });
                dojo.forEach(domNode.childNodes,
                             function (n) { dojo.addClass(n, "invisible"); }
                            );
            }
        );
        dojo.attr(
            cell.domNode,
            "mouseout",
            function () {
                var domNode = component.getDomNode();
                dojo.style(domNode, "backgroundColor", domNode.savedBackgroundColor);
                dojo.forEach(domNode.childNodes,
                             function (n) { dojo.removeClass(n, "invisible"); }
                            );
            }
        );
        tbl.appendChild(row);
        row.appendChild(cell);
        cell.appendChild(div);
        div.appendChild(text);
        return row;
    };
    var boxTable = function (componList, tbl) {
	// FIXME: Use dojo.create.
        var tbl1, i, len = componList.length, compon, children, row, cell;
        for (i = 0; i < len; i++) {
            compon = componList[i];
            row = boxCompon(compon, tbl);
            children = compon.getChildCompons();
            if (children.length > 0) {
                cell = z.createElement("td", { klass: "boxTD2" });
                row.appendChild(cell);
                tbl1 = z.createElement("table", { klass: "boxTable" });
                cell.appendChild(tbl1);
                boxTable(children, tbl1);
            }
        }
    };
    z.clearTheCanvas = function (componsToDestroy, componsToSave) {
	//FIXME: Maybe we could think up a good scheme for which
	//components to save and which to destroy.
        if (typeof componsToSave === "undefined" || !componsToSave) {
            componsToSave = null;
        }
        dojo.forEach(componsToDestroy,
                     function (compon) { console.log("compon => %s", compon); }
                    );
        dojo.forEach(
            componsToDestroy,
            function (compon) {
                if (!componsToSave || (componsToSave.indexOf(compon) < 0)) {
                    compon.destroyCompon();
                }
            }
        );
    };
    z.makeHierarchyDiagram = function(newComponent) {
        //var tblCompon, contentBox, floatingPaneContent;
        //diagramPaneCompon, floatingPane;

        zen.clearTheHierarchyDiagram();
        // FIXME: tblCompon = zen.createElement("table",
        //      {id:"componTbl",class:"boxTable"});
	if (!dojo.byId("componTbl")) {
            tblCompon = zen.createElement("table",
					  {id:"componTbl"});
	}
        diagramPaneCompon = zen.createNew(zen.DomNodeCompon, "diagramPane", dojo.byId("diagramPane"));
	// NOTE: We can't just call dojo.require() in this file because that
	// messes up the loading of this module via "dojo.require('zen')".
	// Instead, we make a call like "dojo.require.apply(null, [klass]);".
	// FIXME: Try to use Dojo 1.7's require() API.
        dojo.require.apply(null, ["dijit._base"]);
        floatingPane = dijit.byId("diagramPane");
        if (!floatingPane) {
            floatingPane = zen.createDijit(
                "dojox.layout.FloatingPane",
                {title:"Hierarchy of Web Page Components",
                 style:{backgroundColor:"yellow", zIndex:"10"},
                 resizable:true},
                diagramPaneCompon);
        };
        //tblCompon.appendMyselfToParent(floatingPane);
	floatingPane.domNode.appendChild(tblCompon.domNode);

        boxTable([newComponent], tblCompon);
        contentBox = dojo.contentBox("componTbl");
        floatingPane.startup();
        floatingPane.resize({t:5, l:5, w:contentBox.w+5, h:contentBox.h+31});
        floatingPaneContent = dojo.query(
            "#diagramPane.dojoxFloatingPane > .dojoxFloatingPaneCanvas > .dojoxFloatingPaneContent")[0];
        dojo.addClass(floatingPaneContent,"zenDiagramFloatingPaneContent");
        return floatingPane;
    };
    z.clearTheHierarchyDiagram = function () {
        //var diagramPaneElement, diagramPaneCompon;
        diagramPaneElement = dojo.byId("diagramPane");
        if (!diagramPaneElement) {
            diagramPaneElement =
                z.createElement(
                    "div",
                    {
                        id: "diagramPane",
                        style: "position:absolute;width:100px;height:100px;top:100px;left:300px;",
                        duration: "750"
                    }
                );
            z.zenDiv.appendChild(diagramPaneElement);
        }
        diagramPaneCompon = dijit.byId("diagramPane");
        // Even if an element with id 'diagramPane' exists, we need to
        // have a Zen component so that we can use it. If we already have
        // a widget with that id, we can use that.
        if (!diagramPaneCompon) {
            //diagramPaneCompon = z.createNew(dojox.layout.FloatingPane, dojo.byId("diagramPane"));
            diagramPaneCompon = z.createNew(dojox.layout.FloatingPane, {id:"diagramPane"});
        }
	/*
        var compons = diagramPaneCompon.getChildCompons();
        z.log("compons => %s", compons);
        dojo.forEach(
            diagramPaneCompon.getChildCompons(),
            function (child) { z.log("Destroying %s", child); child.destroyCompon(); }
        );
	*/
    };

    console.warn("Define zen.loadToolbox");
    z.loadToolbox = function () {
	//console.debug("Entered zen.loadToolbox");
        var deferred = new dojo.Deferred();
        deferred.then(
            function() {
		console.info("Success in loading toolbox");
	    },
            function(err) {
                console.error("Error in loading toolbox: error => " + err);
            });
	
        dojo.io.iframe.send({
            url: "toolbox.json.html",
            //url: "http://localhost:5984/zen/toolbox",
            method: "GET",
            timeoutSeconds: 5,
            preventCache: true,
            // handleAs: "text",
            handleAs: "json",
            handle: function (result) {
		//console.debug("Ajax result => " + result + ", zen.zenDiv => "
		//	      + z.zenDiv);
                if (!(result instanceof Error)) {
                    z.renderTreeDeferred(result, z.zenDiv, deferred);
                    //FIXME: Do this after the callback in
                    //z.renderTree completes.
                    dojo.style("zenLoadingImg", "display", "none");
                } else {
                    console.error("json iframe error");
                }
            }
        });

	//console.debug("Called dojo.io.iframe.send");
    };

    console.warn("Define zen.init");
    z.init = function () {
	/*
	  FIXME
	define(["dojo/aspect"], function(aspect){
	    var signal = aspect.after(zen, "createSubtree", function(treeSpec){
		// This will be called when targetObject.methodName()
		// is called, after the original function is called.
		console.debug("zen.createSubtree: treeSpec[0] => " + treeSpec[0]);
	    });
	});
	*/
	z.zenDiv = z.createNew(zen.DomNodeCompon, null, dojo.query("#zen")[0]);
	parser = new CSSParser();
	// NOTE: We can't just call dojo.require() in this file because that
	// messes up the loading of this module via "dojo.require('zen')".
	// Instead, we make a call like "dojo.require.apply(null, [klass]);".
	// FIXME: Try to use Dojo 1.7's require() API.
        dojo.require.apply(null, ["dojo.io.iframe"]); // This is for dojo.io.iframe.send only!
	//console.debug("Calling dojo.addOnLoad(zen.loadToolbox)");
	//dojo.aspect.advise(console, "debug", [zen.TraceReturns, zen.TraceArguments]);
        dojo.addOnLoad(z.loadToolbox);
	//E.g.: targetBody = zen.createNew(zen.DomNodeCompon, "targetBody", win.body());
	// Arguments to zen.createNew here are zen.DomNodeCompon, an id, and a node to append to.
	unrendered = zen.createNew(zen.DomNodeCompon, "unrendered", dojo.create("div"));
    }

    console.warn("Define zen.getRemotePageHandle");
    z.getRemotePageHandle = function (jsonIframe) {
	require(["dojo/dom", "dojo/_base/window"], function(dom, win) {
	    ifr = dom.byId(jsonIframe);
	    console.log("ifr => " + ifr);
	    jsonGlobal = ifr.contentWindow; // Get the global scope object from the frame.
	});
	return jsonGlobal;
    }

    console.warn("Define zen.copyRemotePage");
    z.copyRemotePage = function (jsonIframe, targetIframe) {
	// Make a copy of a snapshot of a remote page. 'jsonIframe' is
	// the id of an IFRAME holding a JSON representation of a
	// remote page's content.  FIXME: Maybe use
	// zen.getRemotePageHandle.
	require(["dojo/dom", "dojo/_base/window"], function(dom, win) {
	    jp = dom.byId("jsonIframe1"); //FIXME: Make this unnecessary.
	    console.log("jp => " + jp);
	    ifr = dom.byId(jsonIframe);
	    console.log("ifr => " + ifr);
	    jsonGlobal = ifr.contentWindow; // Get the global scope object from the frame.
	    targetIframe = dom.byId(targetIframe);
	    //var targetIframe = dojo.byId(targetIframe);
	    console.log("targetIframe => " + targetIframe);
	    targetGlobal = targetIframe.contentWindow; // Get the global scope object from the frame.
	    // Call a callback with different 'global' values and context. FIXME: Use only one DIV.
	    win.withGlobal(jsonGlobal,  function() {
		console.log("The current win.global is: ", win.global);
		console.log("The current win.doc is: ", win.doc);
		console.log("The current scope is: ", this);
		host = jp.contentDocument.getElementById("remoteHost").textContent;
		z.remoteHost = host;
		console.debug("host => " + host);
		options = {};
		//options.user = dojo.byId("remoteUser").textContent;
		//options.password = dojo.byId("remotePassword").textContent;
		options.scheme = dojo.byId("remoteScheme").textContent;
		console.log(dojo.byId("remoteScheme"));
		options.path = dojo.byId("remotePath").textContent;
		console.log(dojo.byId("remotePath"));
		options.port = dojo.byId("remotePort").textContent;
		console.log(dojo.byId("remotePort"));
		jsonForCssFiles = dojo.byId("remoteCssFiles").textContent;
		remoteCssFiles = dojo.fromJson(jsonForCssFiles);
		console.debug("options => " + options.toString());
		console.debug(dom.byId("jsonFromWatir"));
		remoteData = dojo.fromJson(dom.byId("jsonFromWatir").textContent);
		console.group("remoteData");
		console.dir(remoteData);
		console.groupEnd();
		remoteHeadContent = remoteData.theHeadContent;
		remoteBodyContent = remoteData.theBodyContent;
		remoteWidth = remoteData.theWidth + 20;
		remoteHeight = remoteData.theHeight + 15;
	    }, this); // win.withGlobal
	    // Call a callback with different 'global' values and context.
	    win.withGlobal(targetGlobal,  function() {
		console.log("The current win.global is: ", win.global);
		console.log("The current win.doc is: ", win.doc);
		console.log("The current scope is: ", this);
		//FIXME: Generalize this.
		targetBody = zen.createNew(zen.DomNodeCompon, "targetBody", win.body());
		zen.renderTree(remoteBodyContent, targetBody);
		console.log("Returned from zen.renderTree");
		//remoteCssFiles.pop();
		//remoteCssFiles.pop();
		dojo.query(".zenStyle").forEach(
		    function(cssElement) {
			console.warn("Pushing embedded CSS onto array");
			remoteCssFiles.push(cssElement.innerHTML);
		    }
		);
		remoteCssFiles.forEach(
		    function(cssFile) {
			console.info("/////////////////////// next cssFile");
			parsedCss=parser.parse(cssFile);
			//console.group("parsedCss");
			//console.dir(parsedCss);
			    //console.groupEnd();
			cssRules = parsedCss.cssRules;
			console.warn("zen.copyRemotePage: cssRules.length => " + cssRules.length);
			cssRules.forEach(
			    function(cssRule) {
				decls = dojo.map(
				    cssRule.declarations,
				    function(decl) {
					return decl.parsedCssText;
				    }
				).join(" ");
				/*
				  if (cssRule.declarations.length > 1) {
				  console.debug("decls => " + decls);
				  }
				*/
				selectorText = cssRule.mSelectorText;
				//console.debug("selectorText => " + selectorText +
				//		  ", decls => " + decls);
				try {
				    dojox.html.insertCssRule(selectorText, decls);
				} catch(err) {
				    console.error("Failed CSS rule insertion: " + selectorText + " " + decls);
				}
			    }
			);
		    }
		);
	    }, this); // win.withGlobal
	}); // require
    }

    z.dynStyleSheets = [];
	    
    dojo.addOnLoad(function() {
        var components, c, rule, len;
        for (rule in rulesTable) {
            if (rulesTable.hasOwnProperty(rule)) {
                components = rulesTable[rule];
                len = components.length;
                for (c = 0; c < len; c++) {
                    invertedRulesTable[components[c]] = rule;
                }
            }
        }

        // These shortcuts make it easy to specify methods for
        // creating various kinds of components. FIXME: it might be
        // better to use a Dojo function to create a TextNode instead
        // of using document.createTextNode() directly.  FIXME: This
        // shortcutsTable used to be worth something, but it looks all
        // messed up now: (1) Shouldn't it be possible to encapsulate
        // any class-based widget from any JavaScript library in a Zen
        // Compon container, without having a specific Zen class for
        // it (like DomNodeCompon)? If this is indeed possible, I
        // think this shortcutsTable should be useful by making it
        // easier to hand-code the JSON specification of a chunk of a
        // web page by providing shortcut references to anticipated
        // types of components. (2) It looks like z.createElement
        // could simply be replaced by createElement. (3) If we decide
        // to use document.createTextNode as a value in this table, it
        // is a perfect example of a method that needs a shortcut
        // reference (simply 'createTextNode' or something
        // similar). (4) An important idea about this shortcutsTable
        // is that it should be extensible at run time. This run-time
        // extension could be used to keep zen.js modular and lean.
        z.shortcutsTable = {
            createElement : z.createElement,
	    createDummyElement : z.createDummyElement,
            createTextNode : z.createTextNode,
            createDijit : z.createDijit
        };
    });
})(zen);

zen.DomNodeCompon.domNodeCompons = [];
