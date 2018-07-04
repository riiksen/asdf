class Deposit < Crecto::Model
  schema "deposits" do
    
    has_one :steam_deposit, SteamDeposit
    belongs_to :user, User
  end
end
