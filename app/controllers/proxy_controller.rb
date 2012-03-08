class ProxyController < ApplicationController
  protect_from_forgery

  def open
    require 'watir-webdriver'
    browser = Watir::Browser.new :firefox
    #browser = Watir::Browser.new :chrome
    #logger.debug "browser.methods are #{browser.methods}"
    #logger.debug "--------------------------------------------------"
    #logger.debug "browser.class.methods are #{browser.class.methods}"

    url = params[:url]
    scheme = 'http://'
    host = URI.parse(scheme + url).host
    path = URI.parse(scheme + url).path
    port = URI.parse(scheme + url).port
    new_url = scheme + host + ':' + port.to_s + path

    logger.debug "url is #{url}"
    #logger.debug "host is #{host}"
    #logger.debug "path is #{path}"
    #logger.debug "port is #{port}"
    #logger.debug "new_url is #{new_url}"

    browser.goto new_url
    logger.debug "browser.url is #{browser.url}"
    #browser.text_field(:name => 'q').set("WebDriver rocks!")
    #browser.button(:name => 'btnG').click

    #page = browser.html
    #page.gsub!(/(<a[^>]*href=\"(?!http))/, '\1/web/' + host + ':' + port.to_s + '/')
    #send_data page, :filename => 'x.png', :type => response.content_type, :disposition => 'inline'

    @from_zen = browser.driver.execute_script <<-JS
        //FIXME: Use script injection, if possible.
        // This technique of getting CSS rules is derived from
        // http://www.quirksmode.org/dom/changess.html . FIXME: Make this work
        // in more browsers.

        theRules = []; theStylesheetLengths = {};
        if (document.styleSheets.length > 0) {
            styleSheetsLen = document.styleSheets.length;
            isIEorSafari = document.styleSheets[0].cssRules ? false : true;
            for (i=0; i<styleSheetsLen; i++) {
                if (isIEorSafari) {
                    // For IE and Safari
                    //FIXME
	            new Error('not implemented');
                } else {
                    rulesLen = document.styleSheets[i].cssRules.length;
                    //theStylesheetLengths["stylesheet_" + i] = rulesLen;
                    for (j=0; j<rulesLen; j++) {
                        rule = document.styleSheets[i].cssRules[j];
                        if (rule.type != 4) { // type 4 is for @media rules
                            theRules.push([rule.selectorText, rule.style.cssText]);
                        }
                    }
                }
            }
        }

	nodeToObject = function (node) {
	    if (node.nodeType == 3) {
	        return ["text", node.textContent, []];
	    } else if (node.nodeType == 1) {
                if (node.tagName == "SCRIPT") {
                    return null;
                }
	        var i = 0, attr = node.attributes, len, attributes = {};
	        if (attr) {
		    var len = attr.length;
		    for (i ; i < len; i++) {
                        var name = attr[i].name;
		        if (attr[i].name == "class") {
			    attributes.klass = attr[i].value;
		        } else if (attr[i].name.slice(0,2) == "on") {
                            attributes[name] = "";
                        } else {
			    attributes[name] = attr[i].value;
		        }
		    }
	        }
	        var children = []; //FIXME: Incl. text nodes, so use better name.
	        var i = 0, j = 0, len = node.childNodes.length;
	        for (i; i < len; i++) {
		    var child = node.childNodes[i];
		    //children[i] = nodeToObject(child);
		    var obj = nodeToObject(child);
                    if (obj) {
                        children[j] = obj;
                        j += 1;
                    }
	        }
	        return [node.tagName, attributes, children];
	    } else {
                return null;
            }
	}

	var theHeadNodes = [], j = 0, ary = document.head.childNodes;
	for (var i=0; i<ary.length; i++) {
            var obj = nodeToObject(ary[i]);
            if (obj) { // Account for nodes that should not be included.
                theHeadNodes[j] = obj;
                j += 1;
            }
        }

        theBody = nodeToObject(document.body);

        foreignJSON = JSON.stringify({theHeadNodes:theHeadNodes, theBody:theBody,
                                      theWidth:document.body.clientWidth,
                                      theHeight:document.body.clientHeight});
	return foreignJSON;
JS

    render :inline => '<html><head><title></title></head><body><div style="display:none" id="remoteJson">' + ERB::Util.html_escape(@from_zen) + '</div></object></body>'

    browser.close

  end

end
