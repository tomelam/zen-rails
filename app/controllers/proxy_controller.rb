class ProxyController < ActionController::Base
  protect_from_forgery

  def open
    url = params[:url]
    response = fetch('http://' + params[:url])
    
    page = response.body

    if response.content_type === 'text/html'
      host = URI.parse('http://' + url).host
      port = URI.parse('http://' + url).port
      page.gsub!(/(<a[^>]*href=\"(?!http))/, '\1/web/' + host + ':' + port.to_s + '/')
      page.gsub!(/(<img[^>]*src=\"(?!http))/, '\1/web/' + host + ':' + port.to_s  + '/')
      page.gsub!(/(<link[^>]*href=\"(?!http))/, '\1/web/' + host + ':' + port.to_s  + '/')
      page.gsub!(/(<script[^>]*src=\"(?!http))/, '\1/web/' + host + ':' + port.to_s  + '/')
      page.gsub!(/(@import[^>]*url\(\"(?!http))/, '\1/web/' + host + ':' + port.to_s  + '/')
      render :inline => page
    else
      send_data page, :filename => 'x.png', :type => response.content_type, :disposition => 'inline'
    end
  end

  def fetch(uri_str, limit = 10)
    # You should choose a better exception.
    raise ArgumentError, 'HTTP redirect too deep' if limit == 0
    
    response = Net::HTTP.get_response(URI.parse(uri_str))
    case response
    when Net::HTTPSuccess     then response
    when Net::HTTPRedirection then fetch(response['location'], limit - 1)
    else
      response.error!
    end
  end

  def cfg
    #url = URI.parse(params[:config])
    #url = URI.parse('localhost:3000/config/' + params[:config])
    #require 'net/http'
    #require 'uri'

    url = URI.parse('http://localhost:5984/zen/toolbox')
    result = Net::HTTP.start(url.host, url.port) {|http|
      http.get('/zen/toolbox')
    }
    render :inline => result.body
    #render :inline => "<html><head><title>Zen Configuration</title></head><body>Configuration will go here</body></html>"
  end
end


