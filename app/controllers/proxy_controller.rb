class ProxyController < ApplicationController
  protect_from_forgery

  require 'net/http'
  require 'uri'
  
  def open
    require 'watir-webdriver'
    #browser = Watir::Browser.new :firefox
    browser = Watir::Browser.new :chrome
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
    
    # Cross-domain stylesheets' rules will be inaccessible, so pull in
    # all stylesheets with HREFs. See below. Stylesheets without HREFs
    # must be embedded stylesheets, so they are copied rule by rule.
    @css_info_from_watir = browser.driver.execute_script <<-JS
        var theCssStylesheets = [], styleSheets = document.styleSheets;
        for (var i=0; i<styleSheets.length; i++) {
            var styleSheet = styleSheets[i];
            if (styleSheets[i].href) {
                theCssStylesheets.push(["External", styleSheet.href]);
            } else {
                theCssStylesheets.push(["Embedded", styleSheet.ownerNode.innerHTML]);
                //theCssStylesheets.push(["Embedded", "found embedded stylesheet"]);
            }
        }
        jsonFromWatir = JSON.stringify(theCssStylesheets);
        return jsonFromWatir;
JS
    
    logger.debug "@css_info_from_watir is #{@css_info_from_watir}"
    @css_info = JSON.parse(@css_info_from_watir)
    @css_files = @css_info.collect { |css_file|
      logger.debug '+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++'
      # Pull in and copy stylesheets with HREFs, so that if they're cross-domain, their rules can be parsed.
      #if css_file.instance_of?(String)
      if css_file[0] == "External"
        logger.debug "Fetching external CSS file"
        fetch(css_file[1]).body
      else
        logger.debug "Got embedded stylesheet"
        logger.debug css_file[1]
        css_file[1]
      end
    }

    @json_from_watir = browser.driver.execute_script <<-JS2
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

	var theHeadContent = [], j = 0, ary = document.head.childNodes;
	for (var i=0; i<ary.length; i++) {
            // Exclude nodes of type "STYLE" and "LINK" because of
            // cross-origin resource sharing policy. (See
            // http://www.w3.org/TR/cors/ .) We will copy the rules
            // from the stylesheets and send them instead of the
            // links to the stylesheets.
            if (ary[i].nodeType != "STYLE" && ary[i].nodeType != "LINK") {
                var obj = nodeToObject(ary[i]);
                if (obj) { // Account for nodes that should not be included.
                    theHeadContent[j] = obj;
                    j += 1;
                }
            }
        }

        theBodyContent = nodeToObject(document.body);

        jsonFromWatir = JSON.stringify({theHeadContent:theHeadContent, theBodyContent:theBodyContent,
                                        theWidth:document.body.clientWidth,
                                        theHeight:document.body.clientHeight});
//alert('Here: stringified data');
	return jsonFromWatir;
JS2

    logger.debug "Got jsonFromWatir"

    # FIXME: Use a better id than "jsonFromWatir".
    render :inline => '<html><head><title></title></head><body><div style="display:none" id="jsonFromWatir">' + ERB::Util.html_escape(@json_from_watir) + '</div><div style="display:none" id="remoteScheme">' + ERB::Util.html_escape("http://") + '</div><div style="display:none" id="remoteHost">' + ERB::Util.html_escape(@remote_host) + '</div><div style="display:none" id="remotePort">' + ERB::Util.html_escape(@remote_port) + '</div><div style="display:none" id="remotePath">' + ERB::Util.html_escape(@remote_path) + '</div><div style="display:none" id="remoteCssFiles">' + ERB::Util.html_escape(@css_files) + '</div></body>'

    browser.close

  end

  def fetch(uri_str, limit = 10)
    # You should choose a better exception.
    raise ArgumentError, 'too many HTTP redirects' if limit == 0
    
    response = Net::HTTP.get_response(URI(uri_str))
    
    case response
    when Net::HTTPSuccess then
      response
    when Net::HTTPRedirection then
      location = response['location']
      warn "redirected to #{location}"
      fetch(location, limit - 1)
    else
      response.value
    end
  end

end
