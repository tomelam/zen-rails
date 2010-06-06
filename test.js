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
       [["dijit.layout.ContentPane",
	 {"class":"box"},
	 [["div", {}, []]]]]]]];
    var tree7 =
    ["dijit.layout.AccordionContainer",
     {id:"workingNode",
      style:{width:"100%",height:"160px",backgroundColor:"yellow"}},
     [["dijit.layout.AccordionPane",
       {id:"workingNode",title:"pane 1"},
       []],
      ["dijit.layout.AccordionPane",
       {id:"cp1",title:"pane 1"},
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
	 {label:"Clear the Canvas",onClick:zen.cleanUpWebpage}, []],
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
    var testRendering =
    ["dojox.layout.FloatingPane",
     {id:"testRendering",
      title:"Main Controls",style:{bottom:"30px",right:"30px"},closable:true},
     [["center", {},
       [["dijit.form.Button",
	 {label:"red DIV",onClick:function(){test(tree1)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"red DIV with orange DIV",onClick:function(){test(tree2)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"red DIV with table",onClick:function(){test(tree3)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"DIV with P and red ContentPane",
	  onClick:function(){test(tree4)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"DIV (id:workingNode) with<br/>ContentPane (class:box)",
	  onClick:function(){test(tree5)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"DIV w/ P & red ContentPane<br/>w/ box ContentPane w/ DIV",
	  onClick:function(){test(tree6)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"AccordionContainer & AccordionPanes<br/>'workingNode' & 'cp1'",
	  onClick:function(){test(tree7)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"AccordionContainer 'workingNode' & AccordionPane with title",
	  onClick:function(){test(tree8)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"AccordionContainer w/ AccordionPanes, each w/ DIV",
	  onClick:function(){test(tree9)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"AccordionContainer w/ AccordionPanes, each /w DIV",
	  onClick:function(){test(tree10)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"Main Controls",onClick:function(){test(devTools)}}, []]]]]];
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

    var tblCompon, floatingPane;// for testing
    test = function(tree) {
	console.debug("*** Testing creation of a tree");
	var div0, tblComponx, newComponent, contentBox, floatingPaneContent;
	var diagramDivCompon, floatingPanex;
	console.debug("*** dojo.byId('diagramDiv') => " +
		      dojo.byId("diagramDiv"));
	tblCompon = zen.createElement("table",
				      {id:"componTbl",class:"boxTable"});
	console.debug("*** tblCompon => " + tblCompon +
		      ", tblCompon.domNode => " + tblCompon.domNode);
	diagramDivCompon = createNew(zen.DomNodeCompon,
				     dojo.byId("diagramDiv"));
	console.debug("*** diagramDivCompon => " + diagramDivCompon);
	floatingPane = zen.createDijit(
	    "dojox.layout.FloatingPane",
	    {id:"diagramPane",
	     title:"Hierarchy of Web Page Components",
	     style:{backgroundColor:"yellow", zIndex:"10"},
	     resizable:true},
	    diagramDivCompon);
	console.debug("*** append diagramDivCompon");
	diagramDivCompon.appendMyselfToParent(zen.body);
	console.debug("*** appended diagramDivCompon");
	tblCompon.appendMyselfToParent(floatingPane);
	console.debug("*** appended tblCompon");
	newComponent = zen.createSubtree(tree);
	console.debug("******* newComponent => " + newComponent);
	newComponent.appendMyselfToParent(zen.body);
	zen.startup();
	console.info("############################");
	console.info("##### CREATING DIAGRAM #####");
	console.info("############################");
	zen.boxTable([newComponent], tblCompon);
	console.debug("*** created boxTable");
	contentBox = dojo.contentBox("componTbl");
	console.debug("*** contentBox => " + contentBox);
	floatingPane.startup();
	console.debug("*** started up floatingPane");
	floatingPane.resize({t:30, l:30, w:contentBox.w+5, h:contentBox.h+31});
	console.debug("*** resized floatingPane");
	floatingPaneContent = dojo.query(
	    "#diagramPane.dojoxFloatingPane > .dojoxFloatingPaneCanvas > .dojoxFloatingPaneContent")[0];
	console.debug("floatingPaneContent => " + floatingPaneContent);
	dojo.addClass(floatingPaneContent,"zenDiagramFloatingPaneContent");
	console.debug("Done");
    };

    //init = function() { console.debug("init: doing nothing"); };
    //init = function() { test(tree12); };
    //init = function() { test(devTools); };
    init = function() { zen.init(); test(testRendering); };
    //init = function() { zen.init(); };


