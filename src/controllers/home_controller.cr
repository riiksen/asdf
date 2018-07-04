class HomeController < ApplicationController
  def index
    render("index.slang")
  end

  def login
    render("login.slang")
  end
end
