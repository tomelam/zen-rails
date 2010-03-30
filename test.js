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

    sayHello = function() { alert("Hi!"); }

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
	 {label:"tree 1",onClick:function(){test(tree1)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"tree 2",onClick:function(){test(tree2)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"tree 3",onClick:function(){test(tree3)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"tree 4",onClick:function(){test(tree4)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"tree 5",onClick:function(){test(tree5)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"tree 6",onClick:function(){test(tree6)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"tree 7",onClick:function(){test(tree7)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"tree 8",onClick:function(){test(tree8)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"tree 9",onClick:function(){test(tree9)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"tree 10",onClick:function(){test(tree10)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"dev tools",onClick:function(){test(devTools)}}, []]]]]];
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
		
    test = function(tree) {
	console.debug("Testing creation of a tree");
	var div0, tbl, newComponent, contentBox, floatingPaneContent;
	var div0 = dojo.byId("id0");
	var tbl = zen.createElement(
	    "table",{id:"componTbl",class:"boxTable"});
	var diagramDiv = dojo.byId("diagramDiv");
	var floatingPane = zen.createDijit(
	    "dojox.layout.FloatingPane",
	    {id:"diagramPane",
	     title:"Hierarchy of Web Page Components",
	     style:{backgroundColor:"yellow", zIndex:"10"},
	     resizable:true},
	    diagramDiv);
	diagramDiv.appendMyselfToParent(dojo.body());
	tbl.appendMyselfToParent(floatingPane);
	newComponent = zen.createSubtree(tree);
	console.debug("newComponent => " + newComponent);
	newComponent.appendMyselfToParent(dojo.body());
	zen.startup();
	console.debug("##### CREATING DIAGRAM #####");
	zen.boxTable([newComponent],tbl);
	contentBox = dojo.contentBox("componTbl");
	floatingPane.startup();
	floatingPane.resize({t:30, l:30, w:contentBox.w, h:contentBox.h+21});
	floatingPaneContent = dojo.query(
	    "#diagramPane.dojoxFloatingPane > .dojoxFloatingPaneCanvas > .dojoxFloatingPaneContent")[0];
	dojo.addClass(floatingPaneContent,"zenDiagramFloatingPaneContent");
	console.debug("Done");
    };

    //init = function() { console.debug("init: doing nothing"); };
    //init = function() { test(tree12); };
    //init = function() { test(devTools); };
    init = function() { test(testRendering); };


