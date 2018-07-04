class BonCode < Crecto::Model
  schema "bon_codes" do
    field :name, String
    field :uses, Int32
    field :vaule, Int32
  end
end
