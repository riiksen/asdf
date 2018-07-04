class SessionController < ApplicationController
  def new
    if params["with"]?.to_s == "google"
      flash["warning"] = "We don't support google log-in yet, sorry :("
      render "new.slang"
    elsif params["with"]?.to_s == "steam"
      flash["warning"] = "We don't support steam log-in yet, sorry :("
      render "new.slang"
    else
      user = User.new
      render("new.slang")
    end
  end

  def create
    user = Repo.get_by(User, email: params["email"].to_s)

    if user && user.authenticate(params["password"].to_s)
      session[:user_id] = user.id
      flash[:info] = "Successfully logged in"
      redirect_to "/"
    else
      flash[:danger] = "Invalid email or password"
      user = User.new
      render("new.slang")
    end
  end

  # def google_signin
  #
  # end

  # def steam_signin
  #
  # end

  def delete
    session.delete(:user_id)
    flash[:info] = "Logged out. See ya later!"
    redirect_to "/"
  end
end
