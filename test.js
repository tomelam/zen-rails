    zen.test.topCompons = [];

    // Test createNew.
    Foo = function() {
	var a = 1;
	return {
	    // This is a closure. It acts like an
	    // accessor to a private variable.
	    getA : function() {
		return a;
	    }
	};
	
    };
    testObjectCreator = function() {
	console.debug(".");
	f = createNew(Foo);
	console.debug("f.a => " + f.a); // => undefined
	console.debug("f.getA() => " + f.getA()); // => 1
	Bar = function() {
	    this.a = 1;
	    return 1;
	}
	console.debug(".");
	b = createNew(Bar);
	console.debug("b.a => " + b.a); // => 1
	Baz = function(z) {
	    this.a = z;
	}
	console.debug(".");
	c = createNew(Baz, 3, 4);
	console.debug("c.a => " + c.a);
    }
    sayHello = function() { alert("Hi!"); }
    //testObjectCreator();

    var tree1 =
    ["div", {style:{width:"180px",height:"180px",backgroundColor:"red"},
	     id:"workingNode",title:"Title"}, []];
    var tree2 =
    ["div", {id:"workingNode",
	     style:{width:"200px",height:"200px",backgroundColor:"red"}},
     [["div", {id:"workingNode",
	       style:{width:"180px",height:"180px",backgroundColor:"orange"},
	title:"Title 1"}, []]]];
    var tree3 =
    ["div", {id:"workingNode",
	     style:{width:"200px",height:"250px",backgroundColor:"red"}},
     [["div",
       {}, []],
      ["table",
       {style:{backgroundColor:"yellow"}, title:"Title 3"},
       [["tr",
	 {style:{height:"50px"}},
	 [["td", {style:{width:"50px"}}, []],
	  ["td", {style:{width:"50px"}}, []]]],
	["tr",
	 {style:{height:"60px"}},
	 [["td", {style:{width:"50px"}}, []],
	  ["td", {style:{width:"50px"}}, []]]],
	["tr",
	 {style:{height:"50px"}},
	 [["td", {style:{width:"50px"}}, []],
	  ["td", {style:{width:"50px"}}, []]]]]],
      ["p", {}, [["span", {}, [["div", {}, []], ["div", {}, []]]],
		  ["div", {}, []]]]]];
    var tree4 =
    ["div", {id:"workingNode"},
     [["p", {}, []],
      ["dijit.layout.ContentPane",
       {style:{width:"300px",height:"300px",backgroundColor:"red"}},
       []]]];
    var tree5 =
    ["div", {id:"workingNode"},
     [["p", {}, []],
      ["dijit.layout.ContentPane",
       {"class":"box"},
       []]]];
    var tree6 =
    ["div", {id:"workingNode"},
     [["p", {}, []],
      ["dijit.layout.ContentPane",
       {style:{width:"300px",height:"140px",backgroundColor:"red"}},
       [["div", {},
	 [["dijit.layout.ContentPane",
	   {"class":"box"},
	   [["div", {}, []]]]]]]]]];
    // tree6b does not work: ContentPane has no 'addChild' method.
    var tree6b =
    ["div", {id:"workingNode"},
     [["p", {}, []],
      ["dijit.layout.ContentPane",
       {style:{width:"300px",height:"140px",backgroundColor:"red"}},
       [["dijit.layout.ContentPane",
	 {"class":"box"},
	 [["div", {}, []]]]]]]];
    var tree7 =
    ["dijit.layout.AccordionContainer",
     {id:"workingNode",
      style:{width:"100%",height:"160px",backgroundColor:"yellow"}},
     [["dijit.layout.AccordionPane",
       {id:"insideWorkingNode",title:"pane 1"},
       []],
      ["dijit.layout.AccordionPane",
       {id:"cp1",title:"pane 2"},
       []]]];
    var tree8 =
    ["dijit.layout.AccordionContainer",
     {id:"workingNode",
      style:{width:"100%",height:"160px",backgroundColor:"yellow"}},
     [["dijit.layout.ContentPane",
       {title:"pane 1"},
       []]]];
    var tree9 =
    ["div", {id:"workingNode"},
     [["dijit.layout.AccordionContainer",
       {style:{width:"100%",height:"160px",backgroundColor:"yellow"}},
       [["dijit.layout.AccordionPane",
	 {title:"pane 1"},
	 [["div", {style:{width:"100%",height:"140px",
			  backgroundColor:"orange"}}, []]]],
	["dijit.layout.AccordionPane",
	 {title:"pane 2"},
	 [["div", {style:{width:"100%",height:"140px",backgroundColor:"red"}},
	   []]]]]]]];
    var tree10 =
    ["div", {id:"workingNode"},
     [["dijit.layout.AccordionContainer",
       {style:{width:"100%",height:"160px",backgroundColor:"yellow"}},
       [["dijit.layout.ContentPane",
	 {title:"pane 1"},
	 [["div", {style:{width:"100%",height:"140px",
			  backgroundColor:"orange"}}, []]]],
	["dijit.layout.ContentPane",
	 {title:"pane 2"},
	 [["div", {style:{width:"100%",height:"140px",backgroundColor:"red"}},
	   []]]]]]]];
    var tree11 =
    ["div", {id:"workingNode"},
     [["dijit.layout.AccordionContainer",
       {id:"ac0",style:{width:"100%",height:"400px",backgroundColor:"yellow"}},
       [["dijit.layout.ContentPane",
	 {id:"cp00",title:"pane 1"},
	 [["div", {id:"d000",style:{width:"100%",height:"140px",
			  backgroundColor:"orange"}},
	   [["dijit.layout.AccordionContainer",
	     {id:"ac0000",
	      style:{width:"100%",height:"160px",backgroundColor:"yellow"}},
	     [["dijit.layout.ContentPane",
	       {id:"cp00000",title:"pane 1"},
	       [["div", {id:"cp000000",style:{width:"100%",height:"140px",
					      backgroundColor:"orange"}}, []]]],
	      ["dijit.layout.ContentPane",
	       {id:"cp00001",title:"pane 2"},
	       [["div", {id:"d000000",style:{width:"100%",height:"140px",
					     backgroundColor:"red"}},
		 []]]]]]]]]],
	["dijit.layout.ContentPane",
	 {id:"cp01",title:"pane 2"},
	 [["div", {style:{width:"100%",height:"140px",backgroundColor:"red"}},
	   []]]]]]]];
    var tree12 =
    ["dijit.layout.AccordionContainer",
     {id:"workingNode",
      style:{width:"100%",height:"400px",backgroundColor:"yellow"}},
     [["dijit.layout.ContentPane",
       {id:"cp00",title:"pane 1"},
       [["div", {id:"d000",style:{width:"100%",height:"140px",
				  backgroundColor:"orange"}},
	 [["dijit.layout.AccordionContainer",
	   {id:"ac0000",
	    style:{width:"100%",height:"160px",backgroundColor:"yellow"}},
	   [["dijit.layout.ContentPane",
	     {id:"cp00000",title:"pane 1"},
	     [["div", {id:"cp000000",style:{width:"100%",height:"140px",
					    backgroundColor:"orange"}}, []]]],
	    ["dijit.layout.ContentPane",
	     {id:"cp00001",title:"pane 2"},
	     [["div", {id:"d000000",style:{width:"100%",height:"140px",
					   backgroundColor:"red"}},
	       []]]]]]]]]],
      ["dijit.layout.ContentPane",
       {id:"cp01",title:"pane 2"},
       [["div", {style:{width:"100%",height:"140px",backgroundColor:"red"}},
	 []]]]]];
    var devTools =
    ["dojox.layout.FloatingPane",
     {id:"workingNode",
      title:"Main Controls",style:{bottom:"30px",right:"30px"},closable:true},
     [["center", {},
       [["dijit.form.Button",
	 {label:"Clear the Canvas",onClick:zen.clearTheCanvas}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"Clear the Canvas",onClick:sayHello}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"Clear the Canvas",onClick:sayHello}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"Clear the Canvas",onClick:sayHello}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"Clear the Canvas",onClick:sayHello}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"Clear the Canvas",onClick:sayHello}, []]]]]];
    var underlay =
    ["dijit.DialogUnderlay",
     {id:"workingNode",style:{width:"100%",height:"200px",
			      backgroundColor:"lightgreen"}},
     []];
    var pane =
    ["dijit.layout.ContentPane",
     {id:"workingNode",style:{width:"100%",height:"200px",
			      backgroundColor:"lightgreen"}},
     []];    

    diagramTree = function(newComponent) {
	var tblCompon, contentBox, floatingPaneContent;
	var diagramPaneCompon, floatingPane;

	zen.debug("*** Entering diagramTree");
	zen.info("############################");
	zen.info("##### CREATING DIAGRAM #####");
	zen.info("############################");
	zen.debug("*** dojo.byId('diagramPane') => " +
		  dojo.byId("diagramPane"));
	zen.clearTheHierarchyDiagram();
	tblCompon = zen.createElement("table",
				      {id:"componTbl",class:"boxTable"});
	zen.debug("*** tblCompon => " + tblCompon +
		  ", tblCompon.domNode => " + tblCompon.domNode);
	diagramPaneCompon = createNew(zen.DomNodeCompon,
				      dojo.byId("diagramPane"));
	zen.debug("*** diagramPaneCompon => " + diagramPaneCompon);
	dojo.require("dijit._base");
	floatingPane = dijit.byId("diagramPane");
	if (!floatingPane) {
	    floatingPane = zen.createDijit(
		"dojox.layout.FloatingPane",
		{title:"Hierarchy of Web Page Components",
		 style:{backgroundColor:"yellow", zIndex:"10"},
		 resizable:true},
		diagramPaneCompon);
	};
	zen.debug("*** Appended diagramPaneCompon");
	tblCompon.appendMyselfToParent(floatingPane);
	zen.debug("*** Appended tblCompon");

	zen.boxTable([newComponent], tblCompon);
	zen.debug("*** Created boxTable");
	contentBox = dojo.contentBox("componTbl");
	zen.debug("*** Got contentBox => " + contentBox);
	floatingPane.startup();
	zen.debug("*** Started up floatingPane");
	floatingPane.resize({t:30, l:30, w:contentBox.w+5, h:contentBox.h+31});
	zen.debug("*** Resized floatingPane");
	floatingPaneContent = dojo.query(
	    "#diagramPane.dojoxFloatingPane > .dojoxFloatingPaneCanvas > .dojoxFloatingPaneContent")[0];
	zen.debug("*** floatingPaneContent => " + floatingPaneContent);
	dojo.addClass(floatingPaneContent,"zenDiagramFloatingPaneContent");
	return floatingPane;
    };

     //FIXME: Should probably be broken into 2 parts: 1 to test the
     //creation of a tree & 1 to fill out the hierarchy of web page
     //components. And this stuff should be moved to zen.js. Also have
     //to think about the use of the same id ('workingNode') for many
     //elements. Note that deleting a tree should remove the
     //conflicting element, so trying to delete a tree and add it or
     //another using the same id would be a good test.
    test = function(tree) {
	var newComponent, diagram;

	console.debug("*** Testing creation and diagramming of a tree");

	newComponent = zen.renderTree(tree, zen.body);
	zen.test.topCompons.push(newComponent);
	diagram = diagramTree(newComponent);
	zen.test.topCompons.push(diagram);
	console.debug("*** Done testing creation and rendering of a tree");
    };
