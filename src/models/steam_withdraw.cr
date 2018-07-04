class SteamWithdraw < Crecto::Model
  schema "steam_withdraws" do

    belongs_to :withdraw, Withdraw
    # belongs_to :user, User
  end
end
