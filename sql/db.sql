CREATE TABLE customer (
  id SERIAL PRIMARY KEY,
  name TEXT,
  username TEXT,
  email TEXT,
  password_hash TEXT,
  google_account boolean,
  client_secret TEXT
);

CREATE TABLE product (
  id INTEGER UNIQUE,
  name TEXT,
  description TEXT,
  quantity INTEGER,
  price money,
  author TEXT,
  image TEXT
);

CREATE TABLE purchase (
  id INTEGER UNIQUE,
  customer_id INTEGER REFERENCES customer(id),
  datetime DATE
);

CREATE TABLE sale (
  id INTEGER,
  quantity INTEGER,
  purchase_id INTEGER REFERENCES purchase(id),
  product_id INTEGER REFERENCES product(id)
);

CREATE TABLE cart (
  customer_id INTEGER REFERENCES customer(id),
  product_id INTEGER REFERENCES product(id),
  quantity INTEGER
);
