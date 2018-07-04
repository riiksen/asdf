-- +micrate Up
CREATE TABLE withdraws (
  id BIGSERIAL PRIMARY KEY,
  state INTEGER,
  value INTEGER,
  user_id INTEGER references users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);


-- +micrate Down
DROP TABLE IF EXISTS withdraws;
