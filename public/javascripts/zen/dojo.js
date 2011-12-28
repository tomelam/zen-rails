dojo.provide("zen.dojo");

// NOTE: We can't just call dojo.require() in this file because that messes
// up the loading of this module via dojo.require("zen.zen"). Instead, we
// make a call like "dojo.require.apply(null, [klass]);".

zen.widgets = [];

// Zen.createDijit does not allow a dijit to be built on a
// passed-in HTML element node. Instead, the dijit constructor is
// called without reference to a node, thus causing it to create a
// top node on the fly. The dijit can be added to a parent
// component afterwards.
zen.createDijit = function(klass, initParms, rootNode) {
    //zen.info("createDijit, klass => " + klass);
    var node = null, widget;
    dojo.require.apply(null, [klass]); // To get zen to load via require().
    if (rootNode) {
	node = rootNode.domNode;
    }
    widget = zen.createNew(zen.rule2ref(klass), initParms, node);
    //zen.log("widget => " + widget);
    widget.isDojoWidget = true; // FIXME: Dumb.
    widget.kind = klass;
    widget.children = [];
    widget.getDomNode = function() {
	//zen.debug("widget.getDomNode: domNode => " + widget.domNode);
	return widget.domNode;
    };
    widget.getChildCompons = function() {
	//zen.debug("ENTER widget.getChildCompons");
	return widget.children;
    };
    widget.appendMyselfToParent = function(parent) {
	//FIXME: See the placeat method in _Widget.js.
	//zen.debug("appendMyselfToParent: widget => " + widget + ", parent => " + parent);
	if (parent.isDojoWidget) {
	    //zen.debug("widgetp.addChild(widgetc), widgetp => " +
	    //	      parent + ", widgetc => " + widget);
	    parent.children.push(widget);
	    return parent.addChild(widget);         // parent is Dojo widget
	} else {
	    //zen.debug("domNode.appendChild(widget.domNode)");
	    return parent.appendChild(widget);      // parent is not Dojo widget
	};
    };
    widget.appendChild = function(child) {
	//zen.debug("widget.appendChild: child => " + child);
	if (child.isDojoWidget) {
	    //zen.debug("widget.appendChild(widget)");
	    widget.children.push(child);
	    return widget.addChild(child);           // child is Dojo widget
	} else {
	    //zen.debug("widget.appendChild(domNode)");
	    if (widget.children.length > 0) {
		console.warn("A widget can have only one child if it's only HTML.");
	    }
	    widget.children = [child];
	    return widget.set("content", child.domNode); // child is not Dojo widget
	};
    };
    widget.destroyCompon = function() {
	var compon, index;
	//zen.debug("widget.destroyCompon: widget => " + widget +
		  //", domNode => " + widget.domNode);
	dojo.forEach(widget.getChildCompons(),
		     function(child) {
			 child.destroyCompon();
		     });
	widget.destroy();
	index = zen.widgets.indexOf(widget);
	if (index >= 0) {
	    /*
	    zen.debug("...destroyCompon: index => " + index + ", compon => " +
		      zen.widgets[index] +
		      ", zen.widgets.length => " + zen.widgets.length);
		      */
	    delete zen.widgets[index];
	    compon = zen.widgets.pop();
	    if (index != zen.widgets.length) {
		zen.widgets[index] = compon;
	    } else {
		console.warn("widget was last in the list; won't put it back!");
	    };
	} else {
	    console.error("widget.destroyCompon: couldn't find last ref");
	};
    };
    zen.widgets.push(widget);
    return widget;
};

zen.startup = function() {
    // Start up all the Dojo widgets. The order is important.
    //zen.debug("ENTER startup: starting up widgets");
    dojo.forEach(zen.widgets.reverse(),
		 function(w) {
		     //zen.debug("starting up " + w);
		     w.startup(); }
		);
};
