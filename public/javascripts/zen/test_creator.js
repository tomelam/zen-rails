dojo.provide("zen.test_creator");

dojo.require("zen");
dojo.require("dijit.TitlePane");

// The createNew function.

tests.register(
    "zen.test_creator",
[
{
    name: "1. createNew(Array) returns an empty array",
    setUp: function() {
    },
    runTest: function() {
	object = zen.createNew(Array);
	doh.assertTrue(typeof object === "object");
	doh.assertTrue(typeof object.length === "number");
    }
},
{
    name: "2. createNew(dijit.TitlePane, { id:'tp1', title:'Creator test 2' }) creates a TitlePane with id and title",
    setUp: function() {
    },
    runTest: function() {
	titlePane = zen.createNew(dijit.TitlePane, { id:"tp1", title:"Creator test 2" });
	doh.assertEqual(typeof dijit.byId("tp1"), "object");
	doh.assertEqual(titlePane.title, "Creator test 2");
    }
}
]);