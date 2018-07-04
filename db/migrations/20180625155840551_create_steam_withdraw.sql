-- +micrate Up
CREATE TABLE steam_withdraws (
  id BIGSERIAL PRIMARY KEY,

  withdraw_id INTEGER references withdraws(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);


-- +micrate Down
DROP TABLE IF EXISTS steam_withdraws;
