require "./spec_helper"
require "../../src/models/ref_code.cr"

describe RefCode do
  Spec.before_each do
    Repo.delete_all(RefCode)
  end
end
