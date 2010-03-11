    dojo.require("dijit.layout.ContentPane");

    zen = {
	dojo : {
	    createDijit : function(parm1, parm2) {
		console.debug('Entering zen.dojo.createDijit, parm1 => ' + parm1);
		dojo.require(parm1);
		console.debug('createNew ...');
		widget = createNew(s2f[parm1], {'class':'box'}, dojo.byId('id2'));
		console.debug('widget => ' + widget);
		widget.addToComponent = function() {
		    console.debug('addToComponent: this => ' + this);
		};
		widget.appendMyselfToParent = function() {
		    console.debug('appendMyselfToParent: this => ' + this);
		};
		return widget;
	    }
        }
    };
    
    // Naming the components that follow a certain rule in an array
    // saves typing. 
    var rulesTable = {
	createElement : [ "div", "table", "tr", "td", "p", "span" ],
	createDijit : [ "dijit.layout.ContentPane", "dijit.layout.BorderContainer" ]
	// FIXME: add this property and value: createTextNode : [ "*" ]
    };

    // This is a table for looking up a rule given a component name as
    // a key. We fill it up by immediately calling the following
    // anonymous function.
    var invertedRulesTable = {};
    (function() {
	var components, c, r;
	for (r in rulesTable) {
	    components = rulesTable[r];
	    for (c=0; c<components.length; c++) {
		invertedRulesTable[components[c]] = r;
	    };
	};
    })();

    // We need references (symbols) to functions for the creation of
    // components. Unfortunately, 'for (r in rulesTable)',
    // used to access rulesTable, loops over strings, not
    // symbols. However, with the following translation table, we can
    // get the symbols we need. Note that dotted referencs (like
    // document.createElement) don't get automatically converted to
    // strings, so we have to use a key that is either a non-dotted
    // reference or a string.
    //
    // We add Dojo widgets to this table because they cannot be
    // specified directly via strings as are arguments to
    // document.createElement(...), and the array keyed by createDijit
    // in rulesTable must not include symbols. The translation
    // from string to symbol must be used when a Dojo widget is made.
    s2f = {
	'document.createElement' : document.createElement,
	createElement : document.createElement,
	'document.createTextNode' : document.createTextNode,
	createTextNode : document.createTextNode,
	'zen.dojo.createDijit' : zen.dojo.createDijit,
	createDijit : zen.dojo.createDijit, // FIXME: make this work (?)
	'dijit.layout.ContentPane' : dijit.layout.ContentPane
    };
