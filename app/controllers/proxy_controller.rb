class ProxyController < ActionController::Base
  protect_from_forgery

  def open
    #FIXME: How can I get the page parameter to include '.com'?
    result = Net::HTTP.get params[:page] + '.' + params[:format], '/'
    #render error if result. ...
    render :inline => result + '/* Zen was here! */'
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


