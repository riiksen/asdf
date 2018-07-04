-- +micrate Up
CREATE TABLE ref_codes (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR,

  user_id INTEGER references users(id),

  created_at TIMESTAMP,
  updated_at TIMESTAMP
);


-- +micrate Down
DROP TABLE IF EXISTS ref_codes;
