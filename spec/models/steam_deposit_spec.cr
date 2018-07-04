require "./spec_helper"
require "../../src/models/steam_deposit.cr"

describe SteamDeposit do
  Spec.before_each do
    Repo.delete_all(SteamDeposit)
  end
end
