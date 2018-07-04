class RefCode < Crecto::Model
  schema "ref_codes" do
    field :name, String

    belongs_to :user, User
  end
end
