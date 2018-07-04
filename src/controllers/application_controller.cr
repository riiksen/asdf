require "jasper_helpers"

class ApplicationController < Amber::Controller::Base
  include JasperHelpers
  LAYOUT = "application.slang"

  def current_user
    context.current_user
  end

  def signed_in?
    current_user ? true : false
  end

  private def redirect_signed_out_user
    unless signed_in?
      redirect_to(
        controller: HomeController,
        action: :index,
        status: 200
      )
    end
  end
end
