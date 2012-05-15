dojo.provide("zen.module");

try{
    //dojo.require("zen.test_creator");
    dojo.require("zen.test_zen");
    dojo.require("zen.test_zendojo");
    dojo.require("zen.test_cssfixer");
    //dojo.registerModulePath("dom+css-tests", "../../../javascripts/zen");
    doh.registerUrl("zen.test_cssparsing",
		    dojo.moduleUrl("zen", "test_cssparsing.html"), 99999999);
}catch(e){
    doh.debug(e);
}
