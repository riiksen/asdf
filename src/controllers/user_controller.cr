class UserController < ApplicationController
  before_action do
    all { redirect_signed_out_user }
  end

  def show
    render("show.slang") if (user = current_user)
  end

  def edit
    if user = current_user
      user_changeset = User.changeset(user)
      render("edit.slang")
    else
      redirect_to "/signin"
    end
  end

  def update
    user = current_user.as(User)
    user_changeset = Repo.update(user.as(User))

    if user_changeset.valid?
      flash[:success] = "Updated Profile successfully."
      redirect_to "/profile"
    else
      flash[:danger] = "Could not update Profile!"
      render("edit.slang")
    end
  end

  private def user_params
    params.validation do
      required(:email) { |f| !f.nil? && !f.empty? }
      optional(:password) { |f| !f.nil? && !f.empty? }
    end
  end
end
