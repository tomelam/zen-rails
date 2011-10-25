class ProxyController < ActionController::Base
  protect_from_forgery

  def open
    #FIXME: How can I get the page parameter to include '.com'?
    result = Net::HTTP.get params[:page] + '.' + params[:format], '/'
    #render error if result. ...
    render :inline => result + '/* Zen was here! */'
  end
end


