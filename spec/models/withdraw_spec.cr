require "./spec_helper"
require "../../src/models/withdraw.cr"

describe Withdraw do
  Spec.before_each do
    Repo.delete_all(Withdraw)
  end
end
