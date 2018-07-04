require "./spec_helper"
require "../../src/models/deposit.cr"

describe Deposit do
  Spec.before_each do
    Repo.delete_all(Deposit)
  end
end
