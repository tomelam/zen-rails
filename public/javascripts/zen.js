dojo.provide("zen");

// NOTE: We can't just call dojo.require() in this file because that
// messes up the loading of this module via
// dojo.require("zen"). Instead, we make a call like
// "dojo.require.apply(null, [klass]);".

zen.registry = { Compon : {}, DomNodeCompon : {} };

dojo.declare("zen.Compon", null, {
    constructor: function (id) {
	if (zen.registry.Compon[id]) {
	    throw "Error: trying to create a zen.Compon with an already-used ID";
	}
        this.id = id || zen.getUniqueId("zen_Compon");
        zen.registry.Compon[this.id] = this;
        zen.info("ENTER/EXIT Compon.constructor for %s, id %s", this, this.id);
        this.children = [];
    },
    toString: function () { // Without this, we get '[object Object]'.
        zen.log("ENTER Compon.toString");
        return "[zen.Compon " + this.id + "]";
    }
});

dojo.declare("zen.DisplayCompon", zen.Compon, {
    getDomNode: function () {
        zen.log("Compon.getDomNode: domNode => %s", this.domNode);
        return this.domNode;
    },
    toString: function () { // Without this, we get '[object Object]'.
        zen.log("ENTER Compon.toString");
        return String(this.domNode).replace(/^\[object /, "[Display Compon ").replace(/\]$/, "]");
    },
    appendMyselfToParent: function () {	throw("Missing subclass"); },
    appendChild: function () { throw("Missing subclass"); },
    getChildCompons: function () { throw("Missing subclass"); },
    destroyCompon: function () { throw("Missing subclass"); }
});

dojo.declare("zen.DomNodeCompon", zen.DisplayCompon, {
    constructor: function (domNode, id) {
        this.id = id || zen.getUniqueId("zen_DomNodeCompon");
        zen.registry.DomNodeCompon[this.id] = this;
        this.domNode = domNode || null; // "null" reads nicer than "undefined".
        zen.info("ENTER/EXIT DomNodeCompon.constructor for %s, id %s", this, this.id);
        this.children = [];
    },
    toString: function () { // Without this, we get '[object Object]'.
        var rep;
        rep = String(this.domNode).replace(/^\[object /, "[HTML Compon ").replace(/\]$/, "]");
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
          function (c) {
          var w = dijit.byNode(c);
          //return w || c;
          return w || DomNodeCompon.fromDomNode(c);
          });
        */
    },
    destroyCompon: function () {
        var compon, index;
        zen.log("DomNodeCompon.destroyCompon: this => %s, domNode => %s", this, this.domNode);
        dojo.forEach(this.getChildCompons(),
                     function (child) { child.destroyCompon(); });
        dojo.destroy(this.domNode);
        index = zen.DomNodeCompon.domNodeCompons.indexOf(this);
        if (index >= 0) {
            zen.log("...destroyCompon: index => %s, compon => %s, zen.DomNodeCompon.domNodeCompons.length => %s",
                    index, zen.DomNodeCompon.domNodeCompons[index], zen.DomNodeCompon.domNodeCompons.length);
            delete zen.DomNodeCompon.domNodeCompons[index];
            compon = zen.DomNodeCompon.domNodeCompons.pop();
            if (index !== zen.DomNodeCompon.domNodeCompons.length) {
                zen.DomNodeCompon.domNodeCompons[index] = compon;
            } else {
                zen.warn("compon was last in the list; won't put it back!");
            }
        } else {
            zen.error("DomNodeCompon.destroyCompon: couldn't find last ref");
	    //FIXME: Remove this console output:
            console.group("zen.DomNodeCompon.domNodeCompons");
            console.dir(zen.DomNodeCompon.domNodeCompons);
            console.groupEnd();
        }
    }
});

(function (zen) {
    var z = zen;

    if (typeof zen.debugLevel === "undefined") {
	z.debug = function () {};
	z.log = function () {};
	z.info = function () {};
	z.warn = function () {};
	z.error = function () {};
	z.group = function () {};
	z.groupEnd = function () {};
	z.dir = function () {};
    }

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
        z.debug("ENTER createNew: constructorArgs => " + constructorArgs);
        z.debug("  ... constructor => " + constructor);
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
	    count = 0;
            _instanceCounters[objectType] = count;
        } else {
            count = ++_instanceCounters[objectType];
        }
        return objectType + "_" + count;
    };

    // FIXME: Consider using dojo.fromJSON here for safety.
    // FIXME: Replace zen.info, etc. with z.info, etc.?
    z.createElement = function (kind, attributes) {
        zen.info("ENTER createElement: kind => %s", kind);
        var domNodeCompon = zen.createNew(zen.DomNodeCompon);
        zen.log("createElement: kind => %s, attributes => %s", kind, attributes);
        // FIXME: Use dojo.create.
        var domNode = document.createElement(kind);
        zen.log("createElement: domNode => %s", domNode);
        zen.DomNodeCompon.domNodeCompons.push(domNodeCompon);
        zen.log("createElement: # of zen.DomNodeCompon.domNodeCompons => %s", zen.DomNodeCompon.domNodeCompons.length);
        attributes = attributes || {};
        if (typeof attributes.klass !== "undefined") {
            dojo.addClass(domNode, attributes.klass);
            delete attributes.klass;
            zen.log("added class");
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
        z.info("ENTER createTextNode: text => %s, attributes => %s", text, attributes);
        // FIXME: Use dojo.create, if appropriate.
        var domNode = document.createTextNode(text);
        z.log("createTextNode: domNode => %s", domNode);
        z.DomNodeCompon.domNodeCompons.push(domNodeCompon);
        z.log("createTextNode: # of zen.DomNodeCompon.domNodeCompons => %s", zen.DomNodeCompon.domNodeCompons.length);
        domNodeCompon.domNode = domNode;
        return domNodeCompon;
    };

    var createSubtree = function (treeSpec) {
        var i, rule, parentCompon, compon, len, constructor;
        var componKind = treeSpec[0], initParms = treeSpec[1], subtree = treeSpec[2];
        rule = invertedRulesTable[componKind];
        z.info("ENTER createSubtree: rule => %s, componKind => %s", rule, componKind);
        z.debug("createSubtree: treeSpec => %s", treeSpec);
        constructor = z.rule2ref(rule);
        z.debug("createSubtree: constructor => %s", constructor);
        z.log("createSubtree: typeof => %s", typeof constructor);
        parentCompon = constructor.call(document, componKind, initParms);
        z.log("createSubtree: parentCompon => %s", parentCompon);
        len = subtree.length;
        for (i = 0; i < len; i++) {
            compon = createSubtree(subtree[i]);
            compon.appendMyselfToParent(parentCompon);
        }
        z.log("EXIT createSubtree, parentCompon => %s", parentCompon);
        return parentCompon;
    };

    // Each property of rulesTable is the name of a rule
    // (i.e. method) for creating a kind of component. The value
    // of each property is the set (an array) of the kinds of
    // component that can be created using the rule.
    var rulesTable = {
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
    // name as a key.
    var invertedRulesTable = {};

    // FIXME: eval is not cool here. FaceBook and MySpace, for
    // example, won't allow it in included JavaScript. See
    // http://www.dojotoolkit.org/reference-guide/dojo/_base/json.html
    // for a safe way to evaluate JSON strings.
    z.rule2ref = function (rule) {
        z.debug("ENTER rule2ref");
        var s, ref = null;
        for (s in zen.shortcutsTable) {
            if (zen.shortcutsTable.hasOwnProperty(s)) {
                if (s === rule) {
                    z.debug("rule2ref: rule from shortcutsTable => " + rule);
                    //ref = eval(z.shortcutsTable[rule]);
                    ref = dojo.fromJson(zen.shortcutsTable[rule]);
                }
            }
        }
        if (!ref) {
            //ref = eval(rule);
            z.debug("rule2ref: rule (not from shortcutsTable) => " + rule);
            ref = dojo.fromJson(rule);
        }
        z.debug("EXIT rule2ref: ref => %s", ref);
        return ref;
    };

    var requireSubtreeCompon = function(treeSpec) {
        var i, rule = "", parentCompon, compon, len, constructor, parentDomNode,
        componKind = treeSpec[0],
        initParms = treeSpec[1],
        subtree = treeSpec[2];
        rule = invertedRulesTable[componKind];
        zen.info("ENTER requireSubtreeCompon: rule => " + rule + ", componKind => " + componKind);
        z.debug("requireSubtreeCompon: treeSpec => " + treeSpec);
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
        zen.log("ENTER renderTree, tree => %s, parent => %s", tree, parent);
        newComponent = createSubtree(tree);
        z.log("  renderTree: newComponent => %s", newComponent);
        newComponent.appendMyselfToParent(parent);
        z.startup();
        z.log("EXIT renderTree");
        return newComponent;
    };

    // Asynchonous Ajax requests will be made to retrieve JavaScript
    // modules that will handle some rendering.
    z.renderTreeDeferred = function (tree, parent, deferred) {
        var newComponent;
        walkZenSpec(
            tree,
            function(tree) {
                requireSubtreeCompon(tree);
            });
        dojo.addOnLoad(function() {
            zen.log("ENTER renderTreeDeferred, tree => %s, parent => %s", tree, parent);
            newComponent = createSubtree(tree);
            z.log("  renderTree: newComponent => %s", newComponent);
            newComponent.appendMyselfToParent(parent);
            z.startup();
            z.log("EXIT renderTreeDeferred");
            deferred.resolve(newComponent);
        });
    };

    //FIXME: Use dojo.create.
    var boxCompon = function (component, tbl) {
        z.log("ENTER boxCompon");
        var row = z.createElement("tr");
        var cell = z.createElement("td", {klass: "boxTD1"});
        var div = z.createElement("div", {klass: "visualRep"});
        z.log("boxCompon: createTextNode %s", component);
        var text = createTextNode(component.toString());
        z.log("boxCompon: createTextNode done, call dojo.attr");
        dojo.attr(
            cell.domNode,
            "mouseover",
            function () {
                var domNode = component.getDomNode();
                z.log("boxCompon: component => %s, domNode => %s, domNode.childNodes => %s",
                      component, domNode, domNode.childNodes);
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
        z.log("boxCompon: called dojo.attr");
        tbl.appendChild(row);
        z.log("boxCompon: appended row");
        row.appendChild(cell);
        z.log("boxCompon: appended cell");
        cell.appendChild(div);
        z.log("boxCompon: appended div");
        div.appendChild(text);
        z.log("EXIT boxCompon: returning compon with domNode => %s", row.domNode);
        return row;
    };

    // FIXME: Use dojo.create.
    var boxTable = function (componList, tbl) {
        var tbl1, i, len = componList.length, compon, children, row, cell;
        z.log("ENTER boxTable: len => %s", len);
        for (i = 0; i < len; i++) {
            z.log("boxTable: i => %s", i);
            z.group("boxTable: componList");
            z.dir(componList);
            z.groupEnd();
            compon = componList[i];
            z.log("boxTable: compon => %s", compon);
            row = boxCompon(compon, tbl);
            z.log("boxTable: compon => %s, compon.domNode => %s", compon, compon.domNode);
            children = compon.getChildCompons();
            z.group("boxTable: component children");
            z.dir(children);
            z.groupEnd();
            if (children.length > 0) {
                z.log("boxTable: create cell");
                cell = z.createElement("td", { klass: "boxTD2" });
                z.log("boxTable: row.domNode => %s", row.domNode);
                row.appendChild(cell);
                z.log("boxTable: create table");
                tbl1 = z.createElement("table", { klass: "boxTable" });
                z.log("boxTable: append table to cell");
                cell.appendChild(tbl1);
                boxTable(children, tbl1);
            }
        }
        z.log("EXIT boxTable");
    };

    //FIXME: Maybe we could think up a good scheme for which components to
    //save and which to destroy.
    z.clearTheCanvas = function (componsToDestroy, componsToSave) {
        if (typeof componsToSave === "undefined" || !componsToSave) {
            componsToSave = null;
        }
        z.log("ENTER clearTheCanvas, destroying compons %s except for %s",
              componsToDestroy, componsToSave);
        z.log("componsToDestroy.length => %s", componsToDestroy.length);
        z.group("componsToDestroy");
        z.dir(componsToDestroy);
        z.groupEnd();
        dojo.forEach(componsToDestroy,
                     function (compon) { z.log("compon => %s", compon); }
                    );
        z.log("Destroying ...");
        dojo.forEach(
            componsToDestroy,
            function (compon) {
                z.log("compon => %s", compon);
                if (!componsToSave || (componsToSave.indexOf(compon) < 0)) {
                    compon.destroyCompon();
                }
            }
        );
        z.log("EXIT clearTheCanvas");
    };

    z.makeHierarchyDiagram = function(newComponent) {
        var tblCompon, contentBox, floatingPaneContent,
        diagramPaneCompon, floatingPane;

        z.debug("*** Entering treeDiagram");
        zen.info("############################");
        zen.info("##### CREATING DIAGRAM #####");
        zen.info("############################");
        z.debug("*** dojo.byId('diagramPane') => " +
                  dojo.byId("diagramPane"));
        zen.clearTheHierarchyDiagram();
        // FIXME: tblCompon = zen.createElement("table",
        //      {id:"componTbl",class:"boxTable"});
        tblCompon = zen.createElement("table",
                                      {id:"componTbl"});
        z.debug("*** tblCompon => " + tblCompon +
                  ", tblCompon.domNode => " + tblCompon.domNode);
        diagramPaneCompon = zen.createNew(zen.DomNodeCompon, dojo.byId("diagramPane"));
        z.debug("*** diagramPaneCompon => " + diagramPaneCompon);
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
        z.debug("*** Appended diagramPaneCompon");
        tblCompon.appendMyselfToParent(floatingPane);
        z.debug("*** Appended tblCompon");

        boxTable([newComponent], tblCompon);
        z.debug("*** Created boxTable");
        contentBox = dojo.contentBox("componTbl");
        z.debug("*** Got contentBox => " + contentBox);
        floatingPane.startup();
        z.debug("*** Started up floatingPane");
        floatingPane.resize({t:30, l:30, w:contentBox.w+5, h:contentBox.h+31});
        z.debug("*** Resized floatingPane");
        floatingPaneContent = dojo.query(
            "#diagramPane.dojoxFloatingPane > .dojoxFloatingPaneCanvas > .dojoxFloatingPaneContent")[0];
        z.debug("*** floatingPaneContent => " + floatingPaneContent);
        dojo.addClass(floatingPaneContent,"zenDiagramFloatingPaneContent");
        return floatingPane;
    };

    z.clearTheHierarchyDiagram = function () {
        var diagramPaneElement, diagramPaneCompon;
        z.log("ENTER clearTheHierarchyDiagram");
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
            z.body.appendChild(diagramPaneElement);
        }
        diagramPaneCompon = dijit.byId("diagramPane");
        // Even if an element with id 'diagramPane' exists, we need to
        // have a Zen component so that we can use it. If we already have
        // a widget with that id, we can use that.
        if (!diagramPaneCompon) {
            diagramPaneCompon = z.createNew(zen.DomNodeCompon, dojo.byId("diagramPane"));
        }
        var compons = diagramPaneCompon.getChildCompons();
        z.log("compons => %s", compons);
        dojo.forEach(
            diagramPaneCompon.getChildCompons(),
            function (child) { z.log("Destroying %s", child); child.destroyCompon(); }
        );
        z.log("EXIT clearTheHierarchyDiagram");
    };

    z.loadToolbox = function () {
        var deferred = new dojo.Deferred();
        deferred.then(
            function() { },
            function(err) {
                zen.error("Error in loading toolbox: error => " + err);
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
                if (!(result instanceof Error)) {
                    z.log("dojo.io.iframe.send callback succeeded");
                    z.group("json iframe");
                    z.dir(result);
                    z.groupEnd();
                    z.renderTreeDeferred(result, z.body, deferred);
                    //FIXME: Do this after the callback in
                    //z.renderTree completes.
                    dojo.style("zenLoadingImg", "display", "none");
                } else {
                    z.error("json iframe error");
                }
            }
        });
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
        z.body = z.createNew(zen.DomNodeCompon, dojo.body());
        z.group("zen.body");
        z.dir(z.body);
        z.groupEnd();
        dojo.require.apply(null, ["dojo.io.iframe"]);
        //dojo.addOnLoad(z.loadToolbox);
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