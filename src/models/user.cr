require "crypto/bcrypt/password"

class User < Crecto::Model
  schema "users" do
    field :email, String
    field :username, String
    field :steam_id, String
    field :coins, Int32
    field :hashed_password, String
    field :password, String, virtual: true
    field :password_confirmation, String, virtual: true
    field :locked, Bool, default: false
    field :verified, Bool, default: false
    field :is_admin, Bool, default: false
    field :used_refferal, String

    has_many :deposits, Deposit
    has_many :withdraws, Withdraw
    # has_many :steam_deposits, SteamDeposit
    # has_many :steam_withdraws, SteamWithdraw
    has_one :ref_code, RefCode, dependent: :destroy
  end

  # validate_required [:username]
  unique_constraint [:steam_id, :username, :email]

  validate "Passwords must match", ->(user : User) do
    user.password == user.password_confirmation
  end

  def password=(password)
    @new_password = password
    @hashed_password = Crypto::Bcrypt::Password.create(password, cost: 10).to_s
  end

  def password
    (hash = hashed_password) ? Crypto::Bcrypt::Password.new(hash) : nil
  end

  def password_changed?
    new_password ? true : false
  end

  def valid_password_size?
    new_password ? pass.size >= 8 : false
  end

  def authenticate(password : String)
    self.password ? self.password == password : false
  end

  private getter new_password : String?
end
