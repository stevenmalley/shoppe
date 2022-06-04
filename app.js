const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config(); // sets process.env with constants from .env

const cors = require("cors");
app.use(cors());

const Pool = require('pg').Pool;
const shoppePool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DATABASE_PORT
});

const session = require("express-session");
app.use(
  session({
    secret: process.env.EXPRESS_SECRET,
    cookie: {maxAge: 1000*60*5}, // 5 minutes
    resave: false, // if true, would force a session to be saved even when no data is modified
    saveUninitialized: false // if true, stores every new session
  })
);

const userDB = require("./userDB.js");
userDB.initialisePool(shoppePool);

const PORT = process.env.SERVER_PORT;

const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.get("/",
    (req,res,next) => {
        res.status(200).send({message:"Welcome to Shoppe"});
    }
);

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(
  function(username, password, done) {
    userDB.findByUsername(username, (err, user) => { // Look up user in the db
      if(err) return done(err); // If there's an error in db lookup, return err callback function
      if(!user) return done(null, false); // If user not found, return null and false in callback
      if(user.password != password) return done(null, false); // If user found, but password not valid, return err and false in callback
      return done(null, user); // If user found and password valid, return the user object in callback
    });
  })
);
passport.serializeUser((user,done) => {
  done(null,user.id); // sets the id as the user's browser cookie and stores it in req.session.passport.user.id
});
passport.deserializeUser((id, done) => {
  userDB.findById(id, function (err, user) { // Look up user id in database
    if (err) return done(err);
    done(null, user);
  });
});


function authenticate(req,res,next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}
function authenticateAdmin(req,res,next) {
  if (req.isAuthenticated() && req.user.username == 'admin') return next();
  res.status(400).send("only admin can perform this function!");
}


app.post("/register", (req, res) => {
  const { name, email, username, password } = req.body;
  const newUser = userDB.createUser({ name, email, username, password }, (status,msg) => {
    req.logout(null,()=>{});
    res.status(status).send(msg);});
});
app.get("/login",
  (req,res,next) => {res.send("login here");});
app.post("/login",
  passport.authenticate("local", {failureRedirect: "/login"}),
  (req, res) => {res.redirect("/user");});
app.get("/logout", (req, res) => {
  req.logout(null,()=>{});
  res.redirect("/");
});

app.get("/user",
  authenticate,
  (req,res,next) => {
    res.status(200).send(req.user.username);
  }
);
app.get("/user/:username",
  authenticate,
  (req,res,next) => { // only allows a user to view their own profile
    if (req.user.username === req.params.username) return next();
    res.redirect("/product");
  },
  (req,res,next) => {
    res.status(200).send(req.user);
  }
);
app.put("/user/:username",
  authenticate,
  (req,res,next) => { // only allows a user to change their own user details
    if (req.user.username === req.params.username) return next();
    res.redirect("/product");
  },
  (req,res,next) => {
    userDB.updateUser(req.params.username,req.body,()=>{
      req.logout(null,()=>{});
      res.redirect("/");});
  }
);
app.delete("/user/:username",
  authenticate,
  (req,res,next) => { // only allows a user to delete their own user account
    if (req.user.username === req.params.username && req.user.password === req.body.password) return next();
    res.redirect("/product");
  },
  (req,res,next) => {
    userDB.deleteUser(req.params.username,()=>{
      req.logout(null,()=>{});
      res.redirect("/");});
  }
);


// receive a product object: {name,description,quantity,price} and create a new product record UNLESS name, description and price match a pre-existing product.
app.post("/admin",
  authenticateAdmin,
  (req,res,next) => {
    const {name,description,quantity,price} = req.body;
    shoppePool.query(`SELECT * FROM product WHERE name = '${name}' AND description = '${description}' AND price = '${price}'`, (error, result) => {
      if (error) throw error;
      
      if (result.rows.length === 0) {
        shoppePool.query("SELECT CASE WHEN MAX(id) IS NULL THEN 1 WHEN MAX(id) IS NOT NULL THEN MAX(id)+1 END FROM product", (error,result) => {
          if (error) throw error;

          const newProductID = result.rows[0].case;
          shoppePool.query(`INSERT INTO product VALUES (${newProductID}, '${name}', '${description}', ${quantity}, '${price}')`, (error,result) => {
            if (error) throw error;

            res.status(200).send("product added");
          });
        });
      } else {
        res.status(400).send("product already exists");
      }
    });
  }
);

// if id matches a record in the db, amend any attributes (name, description, quantity, price)
app.put("/admin/:id",
  authenticateAdmin,
  (req,res,next) => {
    let {name,description,quantity,price} = req.body;
    shoppePool.query(`SELECT * FROM product WHERE id = ${req.params.id}`, (error, result) => {
      if (error) throw error;

      if (result.rows.length === 0) {
        res.status(400).send(`product ID ${req.params.id} not found`);
      } else {
        name = name || result.rows[0].name;
        description = description || result.rows[0].description;
        quantity = quantity || result.rows[0].quantity;
        price = price || result.rows[0].price;
        shoppePool.query(`UPDATE product SET name = '${name}', description = '${description}', quantity = ${quantity}, price = '${price}' WHERE id = ${req.params.id}`, (error, result) => {
          if (error) throw error;

          res.status(200).send(`product amended`);
        });
      }
    });
  }
);

app.delete("/admin/:id",
  authenticateAdmin,
  (req,res,next) => {
    const id = req.params.id;
    shoppePool.query(`DELETE FROM product WHERE id = ${id}`, (error, result) => {
      if (error) throw error;

      res.status(300).send('product deleted');
    });
  }
);


app.get("/product/:id",
  (req,res,next) => {
    shoppePool.query(`SELECT * FROM product WHERE id = ${req.params.id}`, (error, result) => {
      if (error) throw error;
      
      res.status(200).send(result.rows);
    });
  }
);
app.get("/product",
  (req,res,next) => {
    shoppePool.query('SELECT * FROM product', (error, result) => {
      if (error) throw error;
      console.log("beep");
      res.status(200).send(result.rows);
    });
  }
);

app.use("/cart",authenticate);
app.get("/cart",
  (req,res,next) => {
    shoppePool.query(`SELECT * FROM cart WHERE customer_id = ${req.user.id}`, (error, result) => {
      if (error) throw error;

      res.status(200).send(result.rows);
    });
  }
);
app.post("/cart", // add item to cart
  (req,res,next) => {
    if (!isNaN(req.body.productID) && !isNaN(req.body.quantity) && req.body.quantity > 0) {
      shoppePool.query(`SELECT quantity FROM product WHERE id = ${req.body.productID}`, (error, result) => {
        if (error) throw error;

        if (result.rows[0].quantity >= req.body.quantity) {
          shoppePool.query(`INSERT INTO cart VALUES (${req.user.id}, ${req.body.productID}, ${req.body.quantity})`, (error, result) => {
            if (error) throw error;
    
            res.redirect("/cart");
          });
        } else res.status(400).send("insufficient quantity in stock");
      });
    } else res.status(400).send("invalid productID or quantity");
  }
);
app.put("/cart", // modify item quantity
  (req,res,next) => {
    if (!isNaN(req.body.productID) && !isNaN(req.body.quantity) && req.body.quantity > 0) {
      shoppePool.query(`SELECT quantity FROM product WHERE id = ${req.body.productID}`, (error, result) => {
        if (error) throw error;

        if (result.rows[0].quantity >= req.body.quantity) {
          shoppePool.query(`UPDATE cart SET quantity = ${req.body.quantity} WHERE customer_id = ${req.user.id} AND product_id = ${req.body.productID}`, (error, result) => {
            if (error) throw error;

            res.redirect("/cart");
          });
        } else res.status(400).send("insufficient quantity in stock");
      });
    } else res.status(400).send("invalid productID or quantity");
  }
);
app.delete("/cart", // remove item from cart
  (req,res,next) => {
    shoppePool.query(`DELETE FROM cart WHERE customer_id = ${req.user.id} AND product_id = ${req.body.productID}`, (error, result) => {
      if (error) throw error;

      res.redirect("/cart");
    });
  }
);
app.get("/cart/checkout", // buy contents of cart
  authenticate,
  (req,res,next) => {
    shoppePool.query(`SELECT * FROM cart WHERE customer_id = ${req.user.id}`, (error, result) => {
      if (error) throw error;

      const customerID = result.rows[0].customer_id;
      const sales = result.rows;
      const completion = [];

      // get new purchase ID
      shoppePool.query("SELECT CASE WHEN MAX(id) IS NULL THEN 1 WHEN MAX(id) IS NOT NULL THEN MAX(id)+1 END FROM purchase", (error,result) => {
        if (error) throw error;

        const newPurchaseID = result.rows[0].case;
        const dateString = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // create purchase object
        shoppePool.query(`INSERT INTO purchase VALUES ((${newPurchaseID}),${customerID},'${dateString}')`, (error,result) => {
          if (error) throw error;

          for (const sale of sales) {
            // check sufficient stock quantity
            shoppePool.query(`SELECT quantity FROM product WHERE id = ${sale.product_id}`, (error,result) => {
              if (error) throw error;
              
              stockQuantity = result.rows[0].quantity;
              if (stockQuantity >= sale.quantity) {
                // delete cart record
                shoppePool.query(`DELETE FROM cart WHERE customer_id = ${customerID} AND product_id = ${sale.product_id}`, (error, result) => {
                  if (error) throw error;

                  // reduce stock quantity
                  shoppePool.query(`UPDATE product SET quantity = quantity-${sale.quantity} WHERE id = ${sale.product_id}`, (error,result) => {
                    if (error) throw error;

                    // add sale record
                    const newSaleIDquery = "SELECT CASE WHEN MAX(id) IS NULL THEN 1 WHEN MAX(id) IS NOT NULL THEN MAX(id)+1 END FROM sale";
                    shoppePool.query(`INSERT INTO sale VALUES((${newSaleIDquery}), ${sale.quantity}, ${newPurchaseID}, ${sale.product_id})`, (error,result) => {
                      if (error) throw error;

                      completion.push(true);
                      if (completion.length === sales.length) {
                        if (completion.every(c => c)) res.status(201).send("purchase accepted");
                        else res.status(201).send("some purchases failed");
                      }
                    });
                  });
                });
              } else completion.push(false);
            });
          }
        });
      });
    });
  }
);

app.use("/orders",authenticate);
app.get("/orders",
  (req,res,next) => {
    shoppePool.query(`SELECT id,date FROM purchase WHERE customer_id = ${req.user.id}`, (error, result) => {
      if (error) throw error;

      res.status(200).send(result.rows);
    });
  }
);
app.get("/orders/:orderID",
  (req,res,next) => {
    shoppePool.query(`SELECT * FROM purchase WHERE id = ${req.params.orderID} AND customer_id = ${req.user.id}`, (error, result) => {
      if (error) throw error;

      if (result.rows.length > 0) {
        shoppePool.query(`SELECT * FROM sale WHERE purchase_id = ${req.params.orderID}`, (error, result) => {
          if (error) throw error;

          res.status(200).send(result.rows);
        });
      } else res.status(400).send("order not made by customer "+req.user.name);
    });
  }
);

app.listen(PORT, () => console.log("Shoppe running on http://localhost:"+PORT));