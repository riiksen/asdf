class SteamDeposit < Crecto::Model
  schema "steam_deposits" do
    belongs_to :deposit, Deposit
    # belongs_to :user, User
  end
end
