require "./spec_helper"
require "../../src/models/bon_code.cr"

describe BonCode do
  Spec.before_each do
    Repo.delete_all(BonCode)
  end
end
