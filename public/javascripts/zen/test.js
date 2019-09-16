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

var textTree1 =
    ["DIV", {style:"width:180px;height:180px;background-color:red",
	     id:"workingNode",title:"Title"},
     [["text", "This is text!", []]]];
var tree1 =
    ["DIV", {style:"width:180px;height:180px;background-color:red",
	     id:"workingNode",title:"Title"}, []];
var tree2 =
    ["DIV", {style:"width:180px;height:180px;background-color:red",
	     id:"workingNode",title:"Title"},
     [["DIV", {id:"workingNode2",
	       style:"width:180px;height:180px;background-color:orange",
	       title:"Title 1"}, []]]];
var tree3 =
    ["DIV", {style:"width:180px;height:180px;background-color:red",
	     id:"workingNode",title:"Title"},
     [["DIV",
       {}, []],
      ["TABLE",
       {style:{backgroundColor:"yellow"}, title:"Title 3"},
       [["TR",
	 {style:{height:"50px"}},
	 [["TD", {style:{width:"50px"}}, []],
	  ["TD", {style:{width:"50px"}}, []]]],
	["TR",
	 {style:{height:"60px"}},
	 [["TD", {style:{width:"50px"}}, []],
	  ["TD", {style:{width:"50px"}}, []]]],
	["TR",
	 {style:{height:"50px"}},
	 [["TD", {style:{width:"50px"}}, []],
	  ["TD", {style:{width:"50px"}}, []]]]]],
      ["P", {}, [["SPAN", {}, [["DIV", {}, []], ["DIV", {}, []]]],
		 ["DIV", {}, []]]]]];
var tree4 =
    ["DIV", {id:"workingNode"},
     [["P", {}, []],
      ["dijit.layout.ContentPane",
       {style:{width:"300px",height:"300px",backgroundColor:"red"}},
       []]]];
var tree5 =
    ["DIV", {id:"workingNode"},
     [["P", {}, []],
      ["dijit.layout.ContentPane",
       {"class":"box"},
       []]]];
var tree6 =
    ["DIV", {id:"workingNode"},
     [["P", {}, []],
      ["dijit.layout.ContentPane",
       {style:{width:"300px",height:"140px",backgroundColor:"red"}},
       [["DIV", {},
	 [["dijit.layout.ContentPane",
	   {"class":"box"},
	   [["DIV", {}, []]]]]]]]]];
// tree6b does not work: ContentPane has no 'addChild' method.
var tree6b =
    ["DIV", {id:"workingNode"},
     [["P", {}, []],
      ["dijit.layout.ContentPane",
       {style:{width:"300px",height:"140px",backgroundColor:"red"}},
       [["dijit.layout.ContentPane",
	 {"class":"box"},
	 [["DIV", {}, []]]]]]]];
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
    ["DIV", {id:"workingNode"},
     [["dijit.layout.AccordionContainer",
       {style:{width:"100%",height:"160px",backgroundColor:"yellow"}},
       [["dijit.layout.AccordionPane",
	 {title:"pane 1"},
	 [["DIV", {style:{width:"100%",height:"140px",
			  backgroundColor:"orange"}}, []]]],
	["dijit.layout.AccordionPane",
	 {title:"pane 2"},
	 [["DIV", {style:{width:"100%",height:"140px",backgroundColor:"red"}},
	   []]]]]]]];
 var tree10 =
    ["DIV", {id:"workingNode"},
     [["dijit.layout.AccordionContainer",
       {style:{width:"100%",height:"160px",backgroundColor:"yellow"}},
       [["dijit.layout.ContentPane",
	 {title:"pane 1"},
	 [["DIV", {style:{width:"100%",height:"140px",
			  backgroundColor:"orange"}}, []]]],
	["dijit.layout.ContentPane",
	 {title:"pane 2"},
	 [["DIV", {style:{width:"100%",height:"140px",backgroundColor:"red"}},
	   []]]]]]]];
var tree11 =
    ["IFRAME", {id:"iframe", src:"http://tomelam.com", width:"100%", height:"200px"},
     []];
var tree12 =
    ["DIV", {id:"workingNode"},
     [["dijit.layout.AccordionContainer",
       {id:"ac0",style:{width:"100%",height:"400px",backgroundColor:"yellow"}},
       [["dijit.layout.ContentPane",
	 {id:"cp00",title:"pane 1"},
	 [["DIV", {id:"d000",style:{width:"100%",height:"140px",
				    backgroundColor:"orange"}},
	   [["dijit.layout.AccordionContainer",
	     {id:"ac0000",
	      style:{width:"100%",height:"160px",backgroundColor:"yellow"}},
	     [["dijit.layout.ContentPane",
	       {id:"cp00000",title:"pane 1"},
	       [["DIV", {id:"cp000000",style:{width:"100%",height:"140px",
					      backgroundColor:"orange"}}, []]]],
	      ["dijit.layout.ContentPane",
	       {id:"cp00001",title:"pane 2"},
	       [["DIV", {id:"d000000",style:{width:"100%",height:"140px",
					     backgroundColor:"red"}},
		 []]]]]]]]]],
	["dijit.layout.ContentPane",
	 {id:"cp01",title:"pane 2"},
	 [["DIV", {style:{width:"100%",height:"140px",backgroundColor:"red"}},
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
    console.log("*** Testing creation and diagramming of a tree");
    //console.group("tree");
    //console.dir(tree);
    //console.groupEnd();
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
    console.log("*** test.js: Rendering test tree under zen.zenDiv");
    console.debug("zen.zenDiv => " + zen.zenDiv);
    console.group("tree");
    console.dir(tree);
    console.groupEnd();
    newComponent = zen.renderTreeDeferred(tree, zen.zenDiv, deferred);
    //zen.log("*** Done testing creation and rendering of a tree");
};

addHandlerToIframe = function() {
    var ifr = dojo.query("iframe#iframe");
    console.log("ifr => " + ifr);
    console.log("ifr.length => " + ifr.length);
    console.log("ifr.contentDocument => " + ifr.contentDocument);
    console.group("ifr");
    console.dir(ifr);
    console.groupEnd();
    var ibody = dojo.query("iframe#iframe").contentDocument.body;
    console.log("ibody => " + ibody);
    dojo.connect(
	ibody,
	"onclick",
	function(ev) { alert('clicked on body'); }
    );
};
