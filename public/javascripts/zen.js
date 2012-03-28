dojo.provide("zen");

// NOTE: We can't just call dojo.require() in this file because that
// messes up the loading of this module via
// dojo.require("zen"). Instead, we make a call like
// "dojo.require.apply(null, [klass]);".

zen.registry = { Compon : {}, DomNodeCompon : {} };

//FIXME: zen.Compon is not necessary because all Zen components have a visible aspect.
dojo.declare("zen.Compon", null, {
    constructor: function (id) {
        if (zen.registry.Compon[id]) {
            throw "Error: trying to create a zen.Compon with an already-used ID " + id;
        }
	if (!id) {
            this.id = zen.getUniqueId("zen_Compon");
	} else {
	    this.id = id;
	}
        zen.registry.Compon[this.id] = this;
        this.children = [];
    },
    toString: function () { // Without this, we get '[object Object]'.
        return "[zen.Compon " + this.id + "]";
    }
});

//FIXME: Not sure much if anything belongs in a "zen.DisplayCompon".
dojo.declare("zen.DisplayCompon", zen.Compon, {
    getDomNode: function () {
        return this.domNode;
    },
    toString: function () { // Without this, we get '[object Object]'.
        return String(this.domNode).replace(/^\[object /, "[Display Compon ").replace(/\]$/, "]");
    },
    appendMyselfToParent: function () { throw("Missing subclass"); },
    appendChild: function () { throw("Missing subclass"); },
    getChildCompons: function () { throw("Missing subclass"); },
    destroyCompon: function () { throw("Missing subclass"); }
});

dojo.declare("zen.DomNodeCompon", zen.DisplayCompon, {
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
    appendMyselfToParent: function (parent) {
        parent.appendChild(this);
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

//FIXME: Consider moving aside console.debug, console.info, etc. to implement
//controllable debugging.
(function (zen) {
    var z = zen;
    dojo.require("dijit.form.Button");
    dojo.require("dijit.form.CheckBox");
    dojo.require("dojo.parser");
    //FIXME: Explore how to use dojox.lang.aspect for debugging.
    TraceArguments = {
        before: function(){
	    var joinPoint = dojox.lang.aspect.getContext().joinPoint,
            args = Array.prototype.join.call(arguments, ", ");
            console.debug("=> " + joinPoint.targetName + "(" + args + ")");
        }
    };
    TraceReturns = {
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

    /* Simplification and consolidation of a simulated "new"
       operator as given in Chapter 5 of _JavaScript: The Good
       Parts_, by Douglas Crockford. Courtesy of Eric Bréchemier
       (on stackoverflow.com; see http: bit.ly/9PiU5W). I have
       made significant corrections and added arguments to the
       constructor.
       
       This function is not just for educational purposes: it allows
       any kind of object to be created in a more functional way than
       the 'new' operator allows, because it allows the object's
       constructor to be passed to a function and then called there to
       create the new object. FIXME: Explain this, and the problem of
       trying to use the 'new' operator in declarative, structured
       data, in detail.
    */

    z.sayHello = function () {
	alert("Greetings from Zen!");
    }

    var hiddenLink = function () {};
    z.createNew = function () {
        // A function to explain (and replace) the "new" operator.
        //   var object = createNew(...);
        //     is equivalent to
        //   var object = new constructor(...);
        //
        // arguments: constructor function, followed by its arguments
        // return: a new instance of the "constructor" kind of objects
        //
        // Preliminaries: convert arguments to a real array, get the
        //                constructor, and get the arguments to the
        //                constructor.
        var args = Array.prototype.slice.call(arguments);
        var constructor = args[0];
        var constructorArgs = args.slice(1);
        // Step 1: Create a new empty object instance linked to the
        //         prototype of provided constructor.
        hiddenLink.prototype = constructor.prototype;
        // CORRECTED: 'object' was 'instance'.
        var object = new hiddenLink(); // cheat: use new to implement new
        // Step 2: Apply the constructor to the new instance and get
        //         the result.
        // CORRECTED: 'instance' was 'result'.
        // ADDED: arguments.slice(1))
        //var instance = constructor.apply(object, args);
        var instance = constructor.apply(object, constructorArgs);
        // Step 3: Check the result, and choose whether to return it
        //         or the created instance.
        return typeof instance === "object" ? instance : object;
    };

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

    //// zen.createElement
    //// zen.createTextNode
    //// Create a component that refers to an HTML text node or HTML
    //// element. This avoids some conflict with Dojo that results
    //// when trying to use prototype.js to add methods to an
    //// element. It also is more future proof since an element can be
    //// handled in a clean way.

    // FIXME: Consider using dojo.fromJSON here for safety.
    // FIXME: Replace zen.info, etc. with z.info, etc.?
    // This method handles inline attributes (like style).
    z.createElement = function (kind, attributes) {
        var domNodeCompon = zen.createNew(zen.DomNodeCompon), domNode;
        // FIXME: Use dojo.create. FIXME: Styles applied to the body won't work!
	if (kind == "BODY") { // Fake this so it can be embedded anywhere.
	    domNode = document.createElement("div");
	} else {
	    domNode = document.createElement(kind);
	}
	if (kind == "STYLE") {
	    console.debug("@@@@@ STYLE: attributes => " + dojo.toJson(attributes));
	}
        zen.DomNodeCompon.domNodeCompons.push(domNodeCompon);
        attributes = attributes || {};

	if (kind == "IMG" && attributes.src) { // Turn a relative URL into an absolute one.
	    src_split = attributes.src.split("http://");
	    if (src_split.length < 2) { // No match: must be relative.
		//console.debug("zen.remoteHost => " + zen.remoteHost +
		//	      ", attributes.src => " + attributes.src);
		attributes.src = "http://" + zen.remoteHost + src_split;
		console.debug("fixed new IMG URL: attributes.src => " + attributes.src);
	    }
	}
	////console.debug("@@@@@ " + kind + ", attributes => " + dojo.toJson(attributes));

	if (attributes.style) {
	    ////console.debug("************************************************");
	    ////console.debug("Calling zen.fixCssDeclUrl");
	    attributes.style = zen.fixCssDeclUrl(attributes.style, zen.remoteHost);
	    ////console.debug("Returned from zen.fixCssDeclUrl");
	}

        if (typeof attributes.klass !== "undefined") {
            dojo.addClass(domNode, attributes.klass);
            delete attributes.klass;
        }
        dojo.attr(domNode, attributes || {}); //FIXME: Check this.
        domNodeCompon.domNode = domNode;
        return domNodeCompon;
    };

    z.createTextNode = function (kind, text) {
        var domNodeCompon = zen.createNew(zen.DomNodeCompon);
	////console.debug("zen.createTextNode: text => " + text);
        // FIXME: Use dojo.create, if appropriate.
        var domNode = document.createTextNode(text);
        zen.DomNodeCompon.domNodeCompons.push(domNodeCompon);
        domNodeCompon.domNode = domNode;
        return domNodeCompon;
    };

    //// createDummyElement
    //// Convert troublesome elements to NOSCRIPT elements.

    z.createDummyElement = function (kind, attributes) {
	console.debug("zen.createDummyElement: kind => " + kind + ", attributes => " + attributes);
        var domNodeCompon = zen.createNew(zen.DomNodeCompon);
        // FIXME: Use dojo.create.
        var domNode = document.createElement("NOSCRIPT");
        zen.DomNodeCompon.domNodeCompons.push(domNodeCompon);
        attributes = attributes || {};
        if (typeof attributes.klass !== "undefined") {
            dojo.addClass(domNode, attributes.klass);
            delete attributes.klass;
        }
        dojo.attr(domNode, attributes || {}); //FIXME: Check this.
        domNodeCompon.domNode = domNode;
        return domNodeCompon;
    };

    z.createSubtree = function (treeSpec) {
        var i, rule, parentCompon, compon, len, constructor;
        var componKind = treeSpec[0], initParms = treeSpec[1], subtree = treeSpec[2];
        rule = invertedRulesTable[componKind];
        constructor = z.rule2ref(rule);
        parentCompon = constructor.call(document, componKind, initParms);
        len = subtree.length;
        for (i = 0; i < len; i++) {
            compon = z.createSubtree(subtree[i]);
            compon.appendMyselfToParent(parentCompon);
        }
        return parentCompon;
    };

    // Each property of rulesTable is the name of a rule
    // (i.e. method) for creating a kind of component. The value
    // of each property is the set (an array) of the kinds of
    // component that can be created using the rule.
    // FIXME: Should not have to include upper case tag names.
    rulesTable = {
        createElement : [ 
	    // Head elements (nodes?)
	    "META", "TITLE", "LINK",
	    // Inline elements
	    "A", "ABBR", "ACRONYM", "B", "BDO", "BIG", "BR", "CITE", "CODE",
	    "DFN", "EM", "I", "IMG", "INPUT", "KBD", "LABEL", "Q", "SAMP",
	    "SELECT", "SMALL", "SPAN", "STRONG", "SUB", "TEXTAREA", "TT",
	    "VAR", "LEGEND", "U", "NOBR", "OPTION", "BDI", "NOSCRIPT",
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

    // This is a table for looking up a rule given a component
    // name as a key.
    var invertedRulesTable = {};

    // Note: the eval method is not used here because it can be
    // unsafe. FaceBook and MySpace, for example, won't allow it in
    // included JavaScript. See
    // http://www.dojotoolkit.org/reference-guide/dojo/_base/json.html
    // for a safe way to evaluate JSON strings.
    z.rule2ref = function (rule) {
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
            dojo.require.apply(null, [componKind]);
        };
    };

    z.headNode = null;
    z.filterHeadNodesAndRender = function (treeSpec, head) {
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
	    console.debug("Added text under style or title => " + z.headNode);
	    z.headNode = null;
	}
	//console.debug("Exiting zen.filterHeadNodesAndRender");
    }

    // As per Douglas Crockford.
    var walkTheDOM = function (node, func) {
        func(node); 
        node = node.firstChild; 
        while (node) { 
            z.walkTheDOM(node, func); 
            node = node.nextSibling; 
        } 
    } 

    //FIXME: Use this function where useful.
    var walkZen = function (compon, func) {
        func(compon);
        dojo.forEach(compon.getChildCompons(),
                     function (child) { z.walkZen(child, func); });
    };

    z.walkZenSpec = function (treeSpec, func) {
	//console.group("treeSpec");
	//console.dir(treeSpec);
	//console.groupEnd();
        func(treeSpec);
        dojo.forEach(treeSpec[2],
                     function (subtree) { z.walkZenSpec(subtree, func); });
    };
    //z.walkZenSpec(z.toolbox, console.info); // Example usage.

    //FIXME: Try to use walkTheDOM.
    z.nodeToObject = function (node) {
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

    //FIXME: Unused.
    z.browserCollectionToArray = function (collection) {
	console.debug("++++++++++ Entering zen.browserCollectionToArray");
	console.debug("collection => " + collection);
	console.debug("collection[0] => " + collection[0]);
	ary = [];
	//FIXME: Maybe there is a more functional way of doing this.
	for (i = 0; i < collection.length; i++) {
	    console.debug("Calling zen.nodeToObject: node => ", collection[i]);
	    ary.push(collection[i]);
	}
	return ary;
    }

    z.renderTree = function (tree, parent) {
        var newComponent;
	//dojox.lang.aspect.advise(zen, "createSubtree", [TraceReturns, TraceArguments]);
        newComponent = z.createSubtree(tree);
        newComponent.appendMyselfToParent(parent);
        z.startup();
        return newComponent;
    };

    z.renderForest = function (forest, parent) {
	var i, len = forest.length;
	//dojox.lang.aspect.advise(z, "createSubtree", [TraceReturns, TraceArguments]);
	for (i=0; i<len; i++) {
	    z.renderTree(forest[i], parent);
	}
    }

    // THIS METHOD MAKES A RELATIVE URL IN A CSS DECLARATION ABSOLUTE
    // so that an image file can be loaded from a different website.
    // FIXME: Rename this something like rebaseStyleUrl and provide it with
    // the new base. Typically this would be used to convert a relative
    // path to an absolute path.
    // FIXME: For convenience in zen.fixClassURLs, return null if the
    // cssDecl is unchanged.
    // FIXME: See fixClassesURLs for more FIXMEs.
    z.fixCssDeclUrl = function (cssDecl, host, options) {
	opt = options || {};
	scheme = opt.scheme || 'http://';
	port = opt.port || '';
	user = opt.user || '';
	password = opt.password || '';
	//////console.debug("Entering zen.fixCssDeclUrl: cssDecl => " + cssDecl + ", host => " + host);
	var cssDeclParts, len, i;
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
		console.debug("##### Found background: cssDeclParts[i] => " + cssDeclParts[i]);
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
	    cssDecl = cssDeclParts.join(";");
	    cssDecl = cssDecl.replace(/(background.*?url\("data:.*?)#(.*?\))/,'$1\;$2')
	    //console.debug("##### Joined: cssDeclParts => " + cssDeclParts +
	    //		  ", cssDecl => " + cssDecl);
	}
	//////console.debug("Leaving zen.fixCssDeclUrl: cssDecl => " + cssDecl);
	return cssDecl;
    }

    //FIXME: Unused. Maybe use for body-embedded styles.
    z.addClasses = function (styleRules) {
	var i, stylesLen = styleRules.length, rule;
	for (i=0; i<stylesLen; i++) {
	    rule = styleRules[i];
	    console.debug("zen.addClasses: selector => " + rule[0] + ", declaration => " + rule[1]);
	    dojox.html.insertCssRule(rule[0], rule[1])
	}
    }

    z.setDoc = function() { //FIXME: For debugging.
	doc = dojo.byId("transclusion1").contentDocument;
    }
    // Method to change a stylesheet.
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
    z.fixClassesURLs = function (doc) { // doc can be a document in an iframe.
        styleSheets = doc.styleSheets; theRules = []; theStylesheetLengths = {};
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
                    for (j=0; j<rulesLen; j++) {
			console.debug("zen.fixClassesURLs: j => " + j);
                        rule = styleSheets[i].cssRules[j];
                        if (rule.type != 4) { // type 4 is for @media rules
			    console.debug("rule => " + rule.selectorText +
			    		  " { " + rule.style.cssText + " }");
			    if (rule.cssText.indexOf("pmolnk") >= 0) {
				console.debug("********************* Found 'pmolnk' in cssText");
				console.debug("rule.style.cssText => " + rule.style.cssText +
					      ", rule.selectorText => " + rule.selectorText);
			    }
			    cssText = zen.fixCssDeclUrl(rule.style.cssText, zen.remoteHost);
			    if (cssText != rule.style.cssText) {
				dojo.withDoc(doc,
					     function() { dojox.html.insertCssRule(rule.selectorText, cssText); },
					     window,
					     null);
				zen.rulesMap[rule.selectorText] = cssText;
			    }
                        }
                    }
                }
            }
        }
    }

    // Asynchonous Ajax requests will be made to retrieve JavaScript
    // modules that will handle some rendering.
    z.renderTreeDeferred = function (tree, parent, deferred) {
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

    //FIXME: Use dojo.create.
    var boxCompon = function (component, tbl) {
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

    // FIXME: Use dojo.create.
    var boxTable = function (componList, tbl) {
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

    //FIXME: Maybe we could think up a good scheme for which components to
    //save and which to destroy.
    z.clearTheCanvas = function (componsToDestroy, componsToSave) {
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
	z.xclusion1 = dojo.byId("transclusion1");
	z.head1 = z.createNew(zen.DomNodeCompon, null,
			      z.xclusion1.contentDocument.head);
	z.body1 = z.createNew(zen.DomNodeCompon, null,
			      z.xclusion1.contentDocument.body);
        dojo.require.apply(null, ["dojo.io.iframe"]); // This is for dojo.io.iframe.send only!
	//console.debug("Calling dojo.addOnLoad(zen.loadToolbox)");
	//dojo.aspect.advise(console, "debug", [zen.TraceReturns, zen.TraceArguments]);
        dojo.addOnLoad(z.loadToolbox);
	z.printStyles();
	//z.createStyleSearcher();
    };

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

dojo.require.apply(null, ["zen.debug"]);
dojo.require.apply(null, ["zen.dojo"]);

zen.printStyles = function () {
    ruleStore = new dojox.data.CssRuleStore({'context': ['dijit/themes/tundra/tundra.css']});
    var gotItems = function (items, request) {
	var i, len = items.length;
	rules = items;
	//console.debug("rules[0].rule.cssText => " + rules[0].rule.cssText);
    };
    ruleStore.fetch({onComplete: gotItems});
}

zen.addTestStyle = function () {
    dojox.html.insertCssRule("#zen", "background-color: red");
}

zen.createStyleSearcher = function () {
    ruleStore = new dojox.data.CssRuleStore({'context': ['dijit/themes/tundra/tundra.css']});
    //console.group("ruleStore._allItems");
    //console.dir(ruleStore._allItems);
    //console.groupEnd();
    ruleCombo = new dijit.form.ComboBox({'store': ruleStore, 'searchAttr': 'selector'}, dojo.byId('ruleCombo'));
    
    function setCssText(){
	//alert('Entering setCssText');
	var item = ruleCombo.item;
	var text = dojo.byId("textLoc");
	if(text){
	    while(text.firstChild){
		text.removeChild(text.firstChild);
	    }
	    if(item){
		text.innerHTML = ruleStore.getValue(item, "cssText");
	    }
	}else {console.log("foo!")}
    }
    dojo.connect(ruleCombo, "onChange", setCssText);
}

// FIXME: Use the following function or delete it.
/*
  DomNodeCompon.fromDomNode: function (node) {
  //DomNodeCompon.fromDomNode = function (node) {
  var i = 0;
  var len = domNodeCompons.length;
  var compon;
  zen.log("DomNodeCompon.fromDomNode: len => %s, node => %s", len, node);
  for (i; i<len; i++) {
  compon = domNodeCompons[i];
  //zen.log("...fromDomNode: i => %s, compon => %s, domNodeCompons.length => %s",
  //i, compon, domNodeCompons.length);
  if (compon.this.domNode == node) {
  zen.log("...fromDomNode: returning compon %s", compon);
  return compon;
  }
  }
  zen.error("...fromDomNode: returning null, node => %s, i => %s", node, i);
  return null;
  }
*/