    dojo.require("dijit.layout.ContentPane");

    zen = {
	dojo : {
	    createDijit : function(parm1, parm2) {
		console.debug('Entering zen.dojo.createDijit, parm1 => ' + parm1);
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
    
    // This table shows all the component types that can be created
    // with each of the kinds of components (element, dijit, etc.)
    // that we can handle. We use this table because we don't want
    // to create a property for each kind of component.
    // We'll need a default rule to handle the
    // creation of text nodes unless a better heuristic can be
    // invented. Perhaps a regular expression could be used instead of
    // an exact comparison. FIXME: make the regular expression work.
    var invertedRulesTable = {
	createElement : [ "div", "table", "tr", "td", "p", "span" ],
	createDijit : [ "dijit.layout.ContentPane", "dijit.layout.BorderContainer" ]
	// FIXME: add this property and value: createTextNode : [ "*" ]
    }

    // We need references (symbols) to functions for the creation of
    // components. Unfortunately, 'for (r in invertedRulesTable)',
    // used to access invertedRulesTable, loops over strings, not
    // symbols. However, with the following translation table, we can
    // get the symbols we need. Note that dotted referencs (like
    // document.createElement) don't get automatically converted to
    // strings, so we have to use a key that is either a non-dotted
    // reference or a string.
    //
    // We add Dojo widgets to this table because they cannot be
    // specified directly via strings as are arguments to
    // document.createElement(...), and the array keyed by createDijit
    // in invertedRulesTable must not include symbols. The translation
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

    var rulesTable = {};
    
    // Fill up the rules table.
    (function() {
	var components, c, r;
	for (r in invertedRulesTable) {
	    //console.debug('rule => ' + r + ', typeof r => ' + typeof r);
	    components = invertedRulesTable[r];
	    for (c=0; c<components.length; c++) {
		rulesTable[components[c]] = r;
	    };
	};
    })();
