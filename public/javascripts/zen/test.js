enableHierarchyDiagram = false; // Flag to enable tree diagramming
topComponents = [];

// Test zen.createNew.
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
    zen.debug(".");
    f = zen.createNew(Foo);
    zen.debug("f.a => " + f.a); // => undefined
    zen.debug("f.getA() => " + f.getA()); // => 1
    Bar = function() {
	this.a = 1;
	return 1;
    }
    zen.debug(".");
    b = zen.createNew(Bar);
    zen.debug("b.a => " + b.a); // => 1
    Baz = function(z) {
	this.a = z;
    }
    zen.debug(".");
    c = zen.createNew(Baz, 3, 4);
    zen.debug("c.a => " + c.a); // => 3
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
    ["iframe", {id:"iframe", src:"jquery.com", width:"100%", height:"100%"},
     []];
var tree12 =
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
var tree13 =
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
var tree14 =
    ["dojox.layout.FloatingPane",
     {id:"workingNode",
      title:"Main Controls",style:{bottom:"30px",right:"30px"},closable:true},
     [["center", {},
       [["dijit.form.Button",
	 {label:"Clear the Canvas",onClick:function(){zen.clearTheCanvas();}}, []],
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
var devTools =
    ["dijit.TitlePane",
     {id:"workingNode",
      title:"Main Controls",style:{bottom:"30px",right:"30px"},closable:true},
     [["center", {},
       [["dijit.form.Button",
	 {label:"Clear the Canvas",onClick:function(){zen.clearTheCanvas();}}, []],
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

//FIXME: Should probably be broken into 2 parts: 1 to test the
//creation of a tree & 1 to fill out the hierarchy of web page
//components. And this stuff should be moved to zen.js. Also have
//to think about the use of the same id ('workingNode') for many
//elements. Note that deleting a tree should remove the
//conflicting element, so trying to delete a tree and add it or
//another using the same id would be a good test.
test = function(tree) {
    var newComponent, diagram, deferred = new dojo.Deferred();
    //zen.log("*** Testing creation and diagramming of a tree");
    deferred.then(function(compon) {
	topComponents.push(compon);
	newComponent = compon;
	if (enableHierarchyDiagram) {
	    dojo.require("dojox.layout.FloatingPane");
	    dojo.addOnLoad(function() {
		diagram = zen.makeHierarchyDiagram(compon);
	    });
	}
    }, function(err) {
	console.error("Error in test()");
    });
    newComponent = zen.renderTreeDeferred(tree, zen.ibody, deferred);
    //zen.log("*** Done testing creation and rendering of a tree");
};
