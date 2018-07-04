class Withdraw < Crecto::Model
  schema "withdraws" do
    # field :type, Int32
    field :state, Int32
    field :value, Int32

    has_one :steam_withdraw, SteamWithdraw
    belongs_to :user, User
  end
end
