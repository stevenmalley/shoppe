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
app.post("/login",
  passport.authenticate("local", {failureRedirect: "/login"}),
  (req, res) => {res.redirect("product");});
app.get("/logout", (req, res) => {
  req.logout(null,()=>{}); // added by Passport
  res.redirect("/");
});





app.get("/product",
    (req,res,next) => {
        shoppePool.query('SELECT * FROM product', (error, result) => {
            if (error) throw error;
            
            res.status(200).send(result.rows);
        });
    }
);

app.post("/purchase",
    (req,res,next) => {
        if (req.isAuthenticated()) return next();
        res.redirect("/login")},
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
        shoppePool.query("SELECT CASE WHEN MAX(id) IS NULL THEN 1 WHEN MAX(id) IS NOT NULL THEN MAX(id)+1 END FROM purchase", (error,results) => {

            const newPurchaseID = results.rows[0].case;
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