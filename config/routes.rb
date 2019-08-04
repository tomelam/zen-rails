ZenRails::Application.routes.draw do
  # The priority is based upon order of creation:
  # first created -> highest priority.

  get "web/:url" => 'proxy#open', :constraints => { :url => /[\/:.-_a-zA-Z0-9]*/ }

  # See how all your routes lay out with "rake routes"
end
