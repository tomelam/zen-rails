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
    logger.debug "host is #{host}"
    logger.debug "path is #{path}"
    logger.debug "port is #{port}"
    logger.debug "new_url is #{new_url}"

    browser.goto new_url
    logger.debug "browser.url is #{browser.url}"
    #browser.text_field(:name => 'q').set("WebDriver rocks!")
    #browser.button(:name => 'btnG').click

    #page = browser.html
    #page.gsub!(/(<a[^>]*href=\"(?!http))/, '\1/web/' + host + ':' + port.to_s + '/')
    #send_data page, :filename => 'x.png', :type => response.content_type, :disposition => 'inline'

    @from_zen = browser.driver.execute_script('return allNodesToJson();')
    #@from_zen = browser.driver.execute_script('return nodeToJson(body);')

    #render :inline => '<html><head><title></title><script type="text/javascript">alert("hi");' +
    #  '</script></head><body>' + @from_zen + '</body>'

    #render :inline => '<html><head><title></title><script type="text/javascript">alert("hi"); json=dojo.fromJson(' + @from_zen + '); zen.renderTree(json, document.body);</script></head><body>hey</body>'

    #render :inline => '<html><head><title></title><script type="text/javascript">alert("hi"); zen.renderTree("[\"div\", {}, []]", document.body);</script></head><body>hey</body>'

    #remoteJson=dojo.query("#foo")[0].firstChild.textContent;
    #o=dojo.fromJson(remoteJson);
    #zen.renderTree(o,zen.zenDiv.domNode);
    render :inline => '<html><head><title></title></head><body><div style="display:none" id="remoteJson">' + @from_zen + '</div></object></body>'

    #browser.close

  end

end
