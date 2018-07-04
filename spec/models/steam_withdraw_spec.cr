require "./spec_helper"
require "../../src/models/steam_withdraw.cr"

describe SteamWithdraw do
  Spec.before_each do
    Repo.delete_all(SteamWithdraw)
  end
end
