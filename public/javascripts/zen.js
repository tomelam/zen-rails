dojo.provide("zen");

// NOTE: We can't just call dojo.require() in this file because that
// messes up the loading of this module via
// dojo.require("zen"). Instead, we make a call like
// "dojo.require.apply(null, [klass]);".

zen.registry = { Compon : {}, DomNodeCompon : {} };

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

(function (zen) {
    var z = zen;
    dojo.require("dijit.form.Button");
    dojo.require("dijit.form.CheckBox");
    dojo.require("dojo.parser");
    dojo.require("dojox.lang.aspect");
    var aop = dojox.lang.aspect, adviceHandle;
    disconnect = function(handle) {
        // Use a copy of the handle array because
        // dojo.disconnect wipes out the first element.
        var h = [], len = handle.length;
        for (i = 0; i < len; i++) { h[i] = handle[i]; };
        dojo.disconnect(h);
    };
    getHandlers = function() {
        return handlers;
    };
    TraceArguments = {
        before: function(){
            var joinPoint = aop.getContext().joinPoint,
            args = Array.prototype.join.call(arguments, ", ");
            console.debug("=> " + joinPoint.targetName + "(" + args + ")");
            if (!dojo.byId("kill").checked) {
                console.debug("Pushing handler to list");
                handlers.push(arguments);
            } else {
                console.debug("Not pushing handler to list");
            };
            console.info("Connecting handler");
        }
    };
    TraceReturns = {
        afterReturning: function(retVal){
            var joinPoint = aop.getContext().joinPoint;
            console.debug("<= " + joinPoint.targetName + " returns " + retVal);
            if (!dojo.byId("kill").checked) {
                console.debug("Pushing handle to list");
                handles.push(retVal);
            } else {
                console.debug("Disconnecting handler");
                dojo.disconnect(retVal);
            };
            console.info("Number of handlers = " + handlers.length);
            console.info("Number of handles = " + handles.length);
        },
        afterThrowing: function(excp){
            var joinPoint = aop.getContext().joinPoint;
            console.debug("<= " + joinPoint.targetName + " throws: " + excp);
        }
    };
    doChange = function() {
        console.debug("doChange");
        if (dojo.byId("kill").checked) {
            console.info("Now in Edit Mode! Number of handles = " + handles.length);
            dojo.forEach(handles, function(handle) {
                // Use a copy of the handle array because
                // dojo.disconnect wipes out the first element.
                var h = [], len = handle.length;
                for (i = 0; i < len; i++) { h[i] = handle[i]; };
                dojo.disconnect(h);
            });
        } else {
            console.info("Now in Run Mode! Number of handlers = " + handlers.length);
            aop.unadvise(adviceHandle);
            dojo.forEach(handlers, function(handler) {
                console.debug('dojo.connect ' + handler[0] + " " +
                              handler[1] + " " + handler[2]);
                dojo.connect(handler[0], handler[1], handler[2]);
            });
            adviceHandle = aop.advise(frames[0].dojoi, "connect",
                                      [TraceReturns, TraceArguments]);
        };
        return false; // FIXME: remove?
    };


    //zen.createTools(tools);
    //adviceHandle = aop.advise(frames[0].dojoi, "connect", [TraceReturns, TraceArguments]);


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
	    console.debug("count = 0");
            count = 0;
            _instanceCounters[objectType] = count;
        } else {
	    console.debug("count => " + count);
            count = ++_instanceCounters[objectType];
	    console.debug("count => " + count);
        }
        return objectType + "_" + count;
    };

    // FIXME: Consider using dojo.fromJSON here for safety.
    // FIXME: Replace zen.info, etc. with z.info, etc.?
    z.createElement = function (kind, attributes) {
        var domNodeCompon = zen.createNew(zen.DomNodeCompon);
        // FIXME: Use dojo.create.
        var domNode = document.createElement(kind);
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

    // Create a component that refers to an HTML text node or HTML
    // element. This avoids some conflict with Dojo that results when
    // trying to use prototype.js to add methods to an element. It also is
    // more future proof since an element can be handled in a clean way.
    //
    // FIXME: Can text nodes have attributes?
    var createTextNode = function (text, attributes) {
        var domNodeCompon = z.createNew(zen.DomNodeCompon);
        // FIXME: Use dojo.create, if appropriate.
        var domNode = document.createTextNode(text);
        z.DomNodeCompon.domNodeCompons.push(domNodeCompon);
        domNodeCompon.domNode = domNode;
        return domNodeCompon;
    };

    var createSubtree = function (treeSpec) {
	console.debug("createSubtree");
        var i, rule, parentCompon, compon, len, constructor;
        var componKind = treeSpec[0], initParms = treeSpec[1], subtree = treeSpec[2];
        rule = invertedRulesTable[componKind];
        constructor = z.rule2ref(rule);
	console.debug("typeof constructor => " + typeof constructor);
	console.debug("constructor => " + constructor);
	console.debug("componKind => " + componKind);
	console.group("initParms");
	console.dir(initParms);
	console.groupEnd();
        parentCompon = constructor.call(document, componKind, initParms);
        //parentCompon = constructor.call(document, componKind, {});
	console.debug("parentCompon => " + parentCompon);
        len = subtree.length;
        for (i = 0; i < len; i++) {
            compon = createSubtree(subtree[i]);
            compon.appendMyselfToParent(parentCompon);
        }
	console.debug("return parentCompon");
        return parentCompon;
    };

    // Each property of rulesTable is the name of a rule
    // (i.e. method) for creating a kind of component. The value
    // of each property is the set (an array) of the kinds of
    // component that can be created using the rule.
    var rulesTable = {
        createElement : [ "iframe", "div", "table", "tr", "td", "p", "span",
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
    // name as a key.
    var invertedRulesTable = {};

    // FIXME: eval is not cool here. FaceBook and MySpace, for
    // example, won't allow it in included JavaScript. See
    // http://www.dojotoolkit.org/reference-guide/dojo/_base/json.html
    // for a safe way to evaluate JSON strings.
    z.rule2ref = function (rule) {
        var s, ref = null;
        for (s in zen.shortcutsTable) {
            if (zen.shortcutsTable.hasOwnProperty(s)) {
                if (s === rule) {
                    //ref = eval(z.shortcutsTable[rule]);
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

    var requireSubtreeCompon = function(treeSpec) {
        var i, rule = "", parentCompon, compon, len, constructor, parentDomNode,
        componKind = treeSpec[0],
        initParms = treeSpec[1],
        subtree = treeSpec[2];
        rule = invertedRulesTable[componKind];
        if (rule === "createDijit") {
            dojo.require.apply(null, [componKind]);
        };
    };

    //FIXME: Use this function where useful.
    var walkZen = function (compon, func) {
        func(compon);
        dojo.forEach(compon.getChildCompons(),
                     function (child) { z.walkZen(child, func); });
    };

    var walkZenSpec = function (treeSpec, func) {
        func(treeSpec);
        dojo.forEach(treeSpec[2],
                     function (subtree) { walkZenSpec(subtree, func); });
    };
    //walkZenSpec(z.toolbox, console.info); // Example usage.

    z.renderTree = function (tree, parent) {
        var newComponent;
        newComponent = createSubtree(tree);
        newComponent.appendMyselfToParent(parent);
        z.startup();
        return newComponent;
    };

    // Asynchonous Ajax requests will be made to retrieve JavaScript
    // modules that will handle some rendering.
    z.renderTreeDeferred = function (tree, parent, deferred) {
        var newComponent;
        walkZenSpec(
            tree,
            function(tree) {
		console.debug("zen.walkZenSpec: tree => " + tree);
                requireSubtreeCompon(tree);
            });
        dojo.addOnLoad(function() {
	    console.debug("zen.renderTreeDeferred: loaded, now calling createSubtree");
            newComponent = createSubtree(tree);
	    console.debug("zen.renderTreeDeferred: newComponent => " +
			  newComponent);
            newComponent.appendMyselfToParent(parent);
            z.startup();
	    console.debug("zen.renderTreeDeferred: calling deferred.resolve()");
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
	console.debug("Entered zen.loadToolbox");
	//z.renderTree(tree9, z.zenDiv);
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
		console.debug("Ajax result => " + result + ", zen.zenDiv => "
			      + z.zenDiv);
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
    };

    z.init = function () {
	z.zenDiv = z.createNew(zen.DomNodeCompon, null, dojo.query("#zen")[0]);
        z.ibody = z.createNew(zen.DomNodeCompon, null,
                              dojo.query("body>iframe#ifr")[0].contentDocument.body);
        dojo.require.apply(null, ["dojo.io.iframe"]);
	console.debug("Calling dojo.addOnLoad(zen.loadToolbox)");
        dojo.addOnLoad(z.loadToolbox);
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
            createTextNode : document.createTextNode,
            createDijit : z.createDijit
        };
    });
})(zen);

zen.DomNodeCompon.domNodeCompons = [];

dojo.require.apply(null, ["zen.debug"]);
dojo.require.apply(null, ["zen.dojo"]);

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