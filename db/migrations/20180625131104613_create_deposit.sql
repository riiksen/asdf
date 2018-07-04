-- +micrate Up
CREATE TABLE deposits (
  id BIGSERIAL PRIMARY KEY,

  user_id INTEGER references users(id),

  created_at TIMESTAMP,
  updated_at TIMESTAMP
);


-- +micrate Down
DROP TABLE IF EXISTS deposits;
