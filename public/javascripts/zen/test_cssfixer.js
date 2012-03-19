dojo.provide("zen.test_cssfixer");

dojo.require("zen");

//FIXME: Use locals, not globals.
tests.register(
    "zen.test_cssfixer",
    [
	{
	    name: "1. Do not convert a one-property CSS declaration without a URL",
	    runTest: function() {
		var fixedDecl = zen.fixCssDeclUrl('margin:0', 'example.com');
		doh.assertEqual('margin:0', fixedDecl);
	    }
	},
	{
	    name: "2. Do not convert a 3-property CSS declaration without a URL",
	    runTest: function() {
		var fixedDecl = zen.fixCssDeclUrl('margin:0;overflow-y:scroll;padding:3px 8px 0', 'example.com');
		doh.assertEqual('margin:0;overflow-y:scroll;padding:3px 8px 0', fixedDecl);
	    }
	},
	{
	    name: "3. Do not convert an absolute-path URL",
	    runTest: function() {
		var fixedDecl = zen.fixCssDeclUrl('background:url("http://example.com/foo.png") repeat', 'example.com');
		doh.assertEqual('background:url("http://example.com/foo.png") repeat', fixedDecl);
	    }
	},
	{
	    name: "4. Convert a protocol relative URL to an absolute-path URL",
	    runTest: function() {
		var fixedDecl = zen.fixCssDeclUrl('background:url("//example.com/foo.png") repeat', 'example.com');
		doh.assertEqual('background:url("http://example.com/foo.png") repeat', fixedDecl);
	    }
	},
	{
	    name: "5. Convert relative-path URL to absolute-path URL",
	    runTest: function() {
		var fixedDecl = zen.fixCssDeclUrl('background:url("/foo.png")', 'example.com');
		doh.assertEqual('background:url("http://example.com/foo.png")', fixedDecl);
	    }
	},
	{
	    name: "6. Do not convert a 'data' URL (IETF RFC 2397)",
	    runTest: function() {
		var fixedDecl = zen.fixCssDeclUrl('background: url("data:image/gif;base64,R0lGODlhCgAEAMIEAP9BGP6pl") transparent;margin:0', 'example.com');
		doh.assertEqual('background: url("data:image/gif;base64,R0lGODlhCgAEAMIEAP9BGP6pl") transparent;margin:0', fixedDecl);
	    }
	}
    ]);