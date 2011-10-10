dojo.provide("zen.module");

try{
    dojo.require("zen.test_creator");
    dojo.require("zen.test_zen");
    doh.registerUrl("oojs01.json",
		    dojo.moduleUrl("oojs01", "json.html"), 99999999);
}catch(e){
    doh.debug(e);
}
