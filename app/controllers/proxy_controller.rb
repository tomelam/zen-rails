class ProxyController < ApplicationController
  protect_from_forgery

  def open
    require 'watir-webdriver'
    browser = Watir::Browser.new :firefox
    #browser = Watir::Browser.new :chrome
    #logger.debug "browser.methods are #{browser.methods}"
    #logger.debug "--------------------------------------------------"
    #logger.debug "browser.class.methods are #{browser.class.methods}"

    # FIXME: Should these variables be prefixed with '@'?
    # FIXME: How to adapt the scheme where appropriate?
    url = params[:url]
    scheme = 'http://'
    @remote_host = URI.parse(scheme + url).host
    @remote_path = URI.parse(scheme + url).path
    @remote_port = URI.parse(scheme + url).port
    #@website_url = scheme + host + ':' + port.to_s + '/'
    new_url = scheme + @remote_host + ':' + @remote_port.to_s + @remote_path

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

    @json_from_watir = browser.driver.execute_script <<-JS
        //FIXME: Use script injection, if possible.
        // This technique of getting CSS rules is derived from
        // http://www.quirksmode.org/dom/changess.html . FIXME: Make this work
        // in more browsers.

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
                        var name = attr[i].name; //FIXME: use name for DRYness.
		        if (attr[i].name == "class") {
			    attributes.klass = attr[i].value;
		        } else if (attr[i].name.slice(0,2) == "on") {
                            attributes[name] = "";
                        } else if (attr[i].name != '"') {//Test for malformed attribute (as at yahoo.com)
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
//alert('Here: defined function via Watir');

	var theHead = [], j = 0, ary = document.head.childNodes;
//alert('Here: got array of head nodes');
	for (var i=0; i<ary.length; i++) {
            // Exclude nodes of type "STYLE" and "LINK" because of
            // cross-origin resource sharing policy. (See
            // http://www.w3.org/TR/cors/ .) We will copy the rules
            // from the stylesheets and send them instead of the
            // links to the stylesheets.
            if (ary[i].nodeType != "STYLE" && ary[i].nodeType != "LINK") {
                var obj = nodeToObject(ary[i]);
                if (obj) { // Account for nodes that should not be included.
                    theHead[j] = obj;
                    j += 1;
                }
            }
        }
//alert('Here: filled theHead');

        var theCssRules = [], styleSheets = document.styleSheets;
//alert('Here: got stylesheets');
        for (i=0; i<styleSheets.length; i++) {
//alert('Here: got length: ' + styleSheets.length);
            cssRules = styleSheets[i].cssRules;
alert('Here: got rules');
            for (j=0; j<cssRules.length; j++) {
alert('Here: got cssRules.length');
                rule = cssRules[j];
alert('Here: got rule');
                if (rule.type != 4) { // type 4 is for @media rules
                    theCssRules.push([rule.selectorText, rule.style.cssText]);
alert('Here: pushed rule');
                }
            }
        }
alert('Here: got rules');

        theBody = nodeToObject(document.body);
alert('Here: got body');

        jsonFromWatir = JSON.stringify({theHead:theHead, theBody:theBody,
                                        theCssRules:theCssRules,
                                        theWidth:document.body.clientWidth,
                                        theHeight:document.body.clientHeight});
alert('Here: stringified data');
	return jsonFromWatir;
JS

    render :inline => '<html><head><title></title></head><body><div style="display:none" id="jsonFromWatir">' + ERB::Util.html_escape(@json_from_watir) + '</div><div style="display:none" id="remoteScheme">' + ERB::Util.html_escape("http://") + '</div><div style="display:none" id="remoteHost">' + ERB::Util.html_escape(@remote_host) + '</div><div style="display:none" id="remotePort">' + ERB::Util.html_escape(@remote_port) + '</div><div style="display:none" id="remotePath">' + ERB::Util.html_escape(@remote_path) + '</div></body>'

    browser.close

  end

end
