class ErrorController < Amber::Controller::Error
  LAYOUT = "application.slang"

  def forbidden
    render("forbidden.slang")
  end

  def not_found
    render("not_found.slang")
  end

  def internal_server_error
    render("internal_server_error.slang")
  end
end
