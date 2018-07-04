-- +micrate Up
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR UNIQUE,
  username VARCHAR UNIQUE,
  steam_id VARCHAR UNIQUE,
  coins INTEGER,
  hashed_password VARCHAR,
  locked BOOLEAN,
  verified BOOLEAN,
  is_admin BOOLEAN,
  used_refferal VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);


-- +micrate Down
DROP TABLE IF EXISTS users;
