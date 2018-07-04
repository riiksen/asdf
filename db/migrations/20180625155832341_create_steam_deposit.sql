-- +micrate Up
CREATE TABLE steam_deposits (
  id BIGSERIAL PRIMARY KEY,

  deposit_id INTEGER references deposits(id),

  created_at TIMESTAMP,
  updated_at TIMESTAMP
);


-- +micrate Down
DROP TABLE IF EXISTS steam_deposits;
