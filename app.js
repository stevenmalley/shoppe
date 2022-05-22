const express = require("express");
const app = express();

const Pool = require('pg').Pool;
const shoppePool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'shoppe',
  password: 'password',
  port: 5432,
});

const session = require("express-session");
app.use(
  session({
    secret: "fdjf73443HUDJuwe",
    cookie: {maxAge: 1000*60*5}, // 5 minutes
    resave: false, // if true, would force a session to be saved even when no data is modified
    saveUninitialized: false // if true, stores every new session
  })
);

const userDB = require("./userDB.js");

const PORT = 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.get("/",
    (req,res,next) => {
        res.status(200).send("Welcome to Shoppe");
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


app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const newUser = userDB.createUser({ username, password }, res);
});
app.get("/login",
  (req,res,next) => {res.redirect("product");});
app.post("/login",
  passport.authenticate("local", {failureRedirect: "/login"}),
  (req, res) => {res.redirect("product");});
app.get("/logout", (req, res) => {
  req.logout(null,()=>{}); // added by Passport
  res.redirect("/");
});

function authenticate(req,res,next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

function authenticateAdmin(req,res,next) {
  if (req.isAuthenticated() && req.user.username == 'admin') return next();
  res.redirect("/login");
}


// receive a product object: {name,description,quantity,price} and create a new product record UNLESS name, description and price match a pre-existing product.
app.post("/addProduct",
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
app.put("/amendProduct",
  authenticateAdmin,
  (req,res,next) => {
    let {id,name,description,quantity,price} = req.body;
    if (!isNaN(id)) {
      shoppePool.query(`SELECT * FROM product WHERE id = ${id}`, (error, result) => {
        if (error) throw error;

        if (result.rows.length === 0) {
          res.status(400).send(`product ID ${id} not found`);
        } else {
          name = name || result.rows[0].name;
          description = description || result.rows[0].description;
          quantity = quantity || result.rows[0].quantity;
          price = price || result.rows[0].price;
          shoppePool.query(`UPDATE product SET name = '${name}', description = '${description}', quantity = ${quantity}, price = '${price}' WHERE id = ${id}`, (error, result) => {
            if (error) throw error;

            res.status(200).send(`product amended`);
          });
        }
      });
    } else {
      res.status(400).send("no product ID given");
    }
  }
);

app.delete("/deleteProduct",
  authenticateAdmin,
  (req,res,next) => {
    const id = req.body.id;
    if (!isNaN(id)) {
      shoppePool.query(`DELETE FROM product WHERE id = ${id}`, (error, result) => {
        if (error) throw error;

        res.status(300).send('product deleted');
      });
    } else {
      res.status(400).send("no product ID given");
    }
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
            
            res.status(200).send(result.rows);
        });
    }
);

app.post("/purchase",
    authenticate,
    (req,res,next) => {
        /*
            {"customer_id",
             "sales":[
                {"product_id",
                 "quantity"}
             ]
            }
        */
        console.log(req.body);

        // get new purchase ID
        shoppePool.query("SELECT CASE WHEN MAX(id) IS NULL THEN 1 WHEN MAX(id) IS NOT NULL THEN MAX(id)+1 END FROM purchase", (error,result) => {
            if (error) throw error;

            const newPurchaseID = result.rows[0].case;
            const dateString = new Date().toISOString().slice(0, 19).replace('T', ' ');

            // create purchase object
            shoppePool.query(`INSERT INTO purchase VALUES ((${newPurchaseID}),${req.body.customer_id},'${dateString}')`, (error,result) => {
                if (error) throw error;

                for (const sale of req.body.sales) {

                    // check sufficient stock quantity
                    shoppePool.query(`SELECT quantity FROM product WHERE id = ${sale.product_id}`, (error,result) => {
                        if (error) throw error;
                        
                        stockQuantity = result.rows[0].quantity;
                        if (stockQuantity >= sale.quantity) {

                            // reduce stock quantity
                            shoppePool.query(`UPDATE product SET quantity = quantity-${sale.quantity} WHERE id = ${sale.product_id}`, (error,result) => {
                                if (error) throw error;

                                // add sale record
                                const newSaleIDquery = "SELECT CASE WHEN MAX(id) IS NULL THEN 1 WHEN MAX(id) IS NOT NULL THEN MAX(id)+1 END FROM sale";
                                shoppePool.query(`INSERT INTO sale VALUES((${newSaleIDquery}), ${sale.quantity}, ${newPurchaseID}, ${sale.product_id})`);
                            });
                        }
                    });
                }
            });

            res.status(201).send("purchase accepted");
        });
    }
);

app.listen(PORT, () => console.log("Shoppe running on http://localhost:"+PORT));