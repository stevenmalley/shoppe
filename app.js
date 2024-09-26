const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config(); // sets process.env with constants from .env

const cors = require("cors");
// const whitelist = [undefined,'http://localhost:3000','http://localhost:8080','http://ye-shoppe.herokuapp.com','https://ye-shoppe.herokuapp.com','http://olde-shoppe-421300d4552b.herokuapp.com','https://olde-shoppe-421300d4552b.herokuapp.com'];
const whitelist = [undefined,'http://localhost:3000','https://olde-shoppe-421300d4552b.herokuapp.com'];
const corsOptions = {
  credentials: true, // This is important.
  origin: (origin, callback) => {
    if(whitelist.includes(origin)) return callback(null, true)

    callback(new Error('Not allowed by CORS'));
  }
}
app.use(cors(corsOptions));
//app.use(cors());

const Pool = require('pg').Pool;
const poolOptions = {connectionString: process.env.DATABASE_URL};
if (process.env.DEVELOPMENT !== "true") poolOptions.ssl = {rejectUnauthorized: false};
const shoppePool = new Pool(poolOptions);
/*const shoppePool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DATABASE_PORT
});*/

const bcrypt = require("bcrypt");
const passwordHash = async (password) => { // on user registration or password change
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt);
    return hash;
  } catch (err) {
    console.log(err);
  }
  return null;
};
const comparePasswords = async (password, hash) => { // on user login
  try {
    const matchFound = await bcrypt.compare(password, hash); // pulls salt out of hash and uses it to hash password
    return matchFound;
  } catch (err) {
    console.log(err);
  }
  return false;
};

const session = require("express-session");
app.use(
  session({
    secret: process.env.EXPRESS_SECRET,
    cookie: {maxAge: 1000*60*5, httpOnly: false, secure: false}, // 5 minutes
    resave: false, // if true, would force a session to be saved even when no data is modified
    saveUninitialized: false // if true, stores every new session
  })
);

const userDB = require("./userDB.js");
userDB.initialisePool(shoppePool);

const PORT = process.env.PORT || 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

const LocalStrategy = require("passport-local").Strategy;
passport.use(new LocalStrategy(
  function(username, password, done) {
    if (username === "SIGN IN WITH GOOGLE" && Object.keys(JSON.parse(password)).every(key => ["name","email","sub"].includes(key))) { // from googleRouter. 'password' used to hold "sign in with google" credential
      userDB.googleLoginOrRegister(JSON.parse(password), async (err, user) => {
        if(err) return done(err);
        return done(null, user);
      });
    } else {
      userDB.findByUsername(username, async (err, user) => { // Look up user in the db
        if(err) return done(err); // If there's an error in db lookup, return err callback function
        if(!user) return done(null, false); // If user not found, return null and false in callback
        if (user.google_account) return done(null, false); // If user is a google account, it will not have a local password; do not allow login locally
        const passwordCheck = await comparePasswords(password, user.password_hash);
        if(!passwordCheck) return done(null, false); // If user found, but password not valid, return err and false in callback
        return done(null, user); // If user found and password valid, return the user object in callback
      });
    }
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
  res.status(200).send({"message":"NOT AUTHENTICATED"});
}
function authenticateAdmin(req,res,next) {
  if (req.isAuthenticated() && req.user.username === 'admin') return next();
  res.status(200).send({"message":"only admin can perform this function!"});
}





app.use((req,res,next) => {
  console.log(req.method,req.path,Object.keys(req.body));
  return next();
});

app.use(express.static("shoppe-client/build"));
if (process.env.DEVELOPMENT !== "true") {
  app.get(/^((?!^\/api\/|^\/scripts\/).)*$/, // any path except those beginning with "/api/" or "/scripts/", redirect to index.html for React Router to handle
    (req, res) => {
      res.sendFile(path.join(__dirname, 'shoppe-client/build/index.html'));
    }
  );
}



app.get("/api/home",
  (req,res,next) => {
    res.status(200).send({"message":"Welcome to Shoppe"});
  }
);

app.post("/api/register", async (req, res) => {
  const { name, email, username, password } = req.body;
  const password_hash = await passwordHash(password);
  userDB.createUser({ name, email, username, password_hash }, (status,msg) => {
    req.logout(null,()=>{});
    res.status(status).send({message:msg});});
});

app.get("/api/login", // OBSOLETE ??
  (req,res,next) => {res.send({message:"login here"});});
app.post("/api/login", // receives {username,password}
  (req,res,next) => {req.logout(null,()=>{});next();}, // close a previous session
  passport.authenticate("local", {failureRedirect: "/user"}), // sets req.user
  (req,res) => {res.redirect("/user");});
app.get("/api/logout", (req, res) => {
  req.logout(null,()=>{});
  res.send({message:"logged out"});
});

app.get("/api/user", // used for checking login (NB requires cookie)
  authenticate,
  (req,res,next) => {
    res.status(200).send({"message":"AUTHENTICATED","username":req.user.username,"name":req.user.name});
  }
);
app.get("/api/user/:username",
  authenticate,
  (req,res,next) => { // only allows a user to view their own profile
    if (req.user.username === req.params.username) return next();
    res.status(400).send({"message":"DISALLOWED"});
  },
  (req,res,next) => {
    const {name,email,username} = req.user;
    res.status(200).send({name,email,username});
  }
);
app.put("/api/user/:username", // receives any of {name,email,username,password}
  authenticate,
  (req,res,next) => { // only allows a user to change their own user details
    if (req.user.username === req.params.username) return next();
    res.status(400).send({"message":"DISALLOWED"});
  },
  async (req,res,next) => {
    if (req.body.password && !comparePasswords(req.body.password,req.user.password_hash)) {
      // if sent a password that is different from the previous password, create a new hash and add it to the request body
      req.body.password_hash = await passwordHash(req.body.password);
    }
    userDB.updateUser(req.params.username,req.body,(changeMessage)=>{
      res.send({"message":changeMessage});});
  }
);
app.delete("/api/user/:username", // receives {password}
  authenticate,
  async (req,res,next) => { // only allows a user to delete their own user account
    const passwordCheck = await comparePasswords(req.body.password, req.user.password_hash);
    if (passwordCheck && req.user.username === req.params.username) return next();
    res.status(400).send({"message":"DISALLOWED"});
  },
  (req,res,next) => {
    userDB.deleteUser(req.params.username,()=>{
      req.logout(null,()=>{});
      res.redirect("/");});
  }
);


// receive a product object: {name,description,quantity,price,author} and create a new product record UNLESS name, description, price and author match a pre-existing product.
app.post("/api/admin",
  authenticateAdmin,
  (req,res,next) => {
    const {name,description,quantity,price,author} = req.body;
    shoppePool.query(`SELECT * FROM product WHERE name = '${name}' AND description = '${description}' AND price = '${price}' AND author = '${author}'`, (error, result) => {
      if (error) throw error;
      
      if (result.rows.length === 0) {
        shoppePool.query("SELECT CASE WHEN MAX(id) IS NULL THEN 1 WHEN MAX(id) IS NOT NULL THEN MAX(id)+1 END FROM product", (error,result) => {
          if (error) throw error;

          const newProductID = result.rows[0].case;
          shoppePool.query(`INSERT INTO product VALUES (${newProductID}, '${name}', '${description}', ${quantity}, '${price}', '${author}')`, (error,result) => {
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

// if id matches a record in the db, amend any attributes (name, description, quantity, price, author)
app.put("/api/admin/:id",
  authenticateAdmin,
  (req,res,next) => {
    let {name,description,quantity,price,author} = req.body;
    shoppePool.query(`SELECT * FROM product WHERE id = ${req.params.id}`, (error, result) => {
      if (error) throw error;

      if (result.rows.length === 0) {
        res.status(400).send(`product ID ${req.params.id} not found`);
      } else {
        name = name || result.rows[0].name;
        description = description || result.rows[0].description;
        quantity = quantity || result.rows[0].quantity;
        price = price || result.rows[0].price;
        author = author || result.rows[0].author;
        shoppePool.query(`UPDATE product SET name = '${name}', description = '${description}', quantity = ${quantity}, price = '${price}', author = '${author}' WHERE id = ${req.params.id}`, (error, result) => {
          if (error) throw error;

          res.status(200).send({message:"product amended"});
        });
      }
    });
  }
);

app.delete("/api/admin/:id",
  authenticateAdmin,
  (req,res,next) => {
    const id = req.params.id;
    shoppePool.query(`DELETE FROM product WHERE id = ${id}`, (error, result) => {
      if (error) throw error;

      res.status(300).send({message:"product deleted"});
    });
  }
);


app.get("/api/product/:id",
  async (req,res,next) => {
    const result = await shoppePool.query(`SELECT id,name,author,price,description,image FROM product WHERE id = ${req.params.id}`);
    res.status(200).send(result.rows[0]);
  }
);
app.get("/api/product",
  (req,res,next) => {
    shoppePool.query('SELECT id,name,price,description,image FROM product', (error, result) => {
      if (error) throw error;
      
      res.status(200).send(result.rows);
    });
  }
);

app.get("/api/productImages/:filename",
  (req,res,next) => {
    res.sendFile("/productImages/"+req.params.filename, {root:__dirname});
  }
);

app.use("/api/cart",authenticate);
app.get("/api/cart",
  async (req,res,next) => {
    //const cartData = await shoppePool.query(`SELECT * FROM carp WHERE customer_id = ${req.user.id}`);
    
    let cartData;
    try {
      cartData = await shoppePool.query(`SELECT * FROM cart WHERE customer_id = ${req.user.id}`);
    } catch (error) {
      return res.status(400).send({message:"customer not found"});
    }

    const cart = [];
    for (let product of cartData.rows) {
      let productData;
      try {
        productData = await shoppePool.query(`SELECT id,name,price FROM product WHERE id = ${product.product_id}`);
      } catch (error) {
        return res.status(400).send({message:`product ${product.product_id} not found`});
      }
      cart.push({quantity:product.quantity, ...productData.rows[0]});
    }
    res.status(200).send(cart);
  }
);
app.post("/api/cart", // add item to cart, receives {productID,quantity}
  (req,res,next) => {
    if (!isNaN(req.body.productID) && !isNaN(req.body.quantity) && req.body.quantity > 0) {
      shoppePool.query(`SELECT name,price,quantity FROM product WHERE id = ${req.body.productID}`, (error, result) => {
        if (error) throw error;

        const name = result.rows[0].name;
        const price = result.rows[0].price;
        if (result.rows[0].quantity >= req.body.quantity) {
          shoppePool.query(`INSERT INTO cart VALUES (${req.user.id}, ${req.body.productID}, ${req.body.quantity})`, (error, result) => {
            if (error) throw error;
    
            res.status(200).send({quantity:req.body.quantity,id:req.body.productID,name,price});
          });
        } else res.status(400).send({message:"insufficient quantity in stock"});
      });
    } else res.status(400).send({message:"invalid productID or quantity"});
  }
);
app.put("/api/cart", // modify item quantity, receives {productID,quantity}
  (req,res,next) => {
    if (!isNaN(req.body.productID) && !isNaN(req.body.quantity) && req.body.quantity > 0) {
      shoppePool.query(`SELECT quantity FROM product WHERE id = ${req.body.productID}`, (error, result) => {
        if (error) throw error;

        if (result.rows[0].quantity >= req.body.quantity) {
          shoppePool.query(`UPDATE cart SET quantity = ${req.body.quantity} WHERE customer_id = ${req.user.id} AND product_id = ${req.body.productID}`, (error, result) => {
            if (error) throw error;

            res.status(200).send({message:"ACCEPTED"});
          });
        } else res.status(400).send({message:"insufficient quantity in stock"});
      });
    } else res.status(400).send({message:"invalid productID or quantity"});
  }
);
app.delete("/api/cart", // remove item from cart, receives {productID}
  (req,res,next) => {
    shoppePool.query(`DELETE FROM cart WHERE customer_id = ${req.user.id} AND product_id = ${req.body.productID}`, (error, result) => {
      if (error) throw error;

      res.status(200).send({message:"ACCEPTED"});
    });
  }
);
app.get("/api/cart/checkout/:clientSecret", // buy contents of cart
  authenticate,
  async (req,res,next) => {
    const customerID = req.user.id;

    const { clientSecret } = req.params;

    const secretCheck = await shoppePool.query(`SELECT client_secret FROM customer WHERE id = ${customerID}`);
    if (!clientSecret || secretCheck.rows[0].client_secret !== clientSecret) {
      res.status(201).send({message:"transaction failed: payment details not found"});
      return;
    }
    shoppePool.query(`UPDATE customer SET client_secret = NULL WHERE id = '${customerID}'`, (error, result) => {
      if (error) throw error;
    });

    let salesResult = await shoppePool.query(`SELECT * FROM cart WHERE customer_id = ${customerID}`);

    const sales = salesResult.rows;
    let salesRemaining = sales.length; // used to track the processing of purchases

    // get new purchase ID
    let purchaseIDresult;
    purchaseIDresult = await shoppePool.query("SELECT CASE WHEN MAX(id) IS NULL THEN 1 WHEN MAX(id) IS NOT NULL THEN MAX(id)+1 END FROM purchase");

    const newPurchaseID = purchaseIDresult.rows[0].case;
    const dateString = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // create purchase
    await shoppePool.query(`INSERT INTO purchase VALUES (${newPurchaseID},${customerID},'${dateString}')`);

    for (const sale of sales) {

      // check sufficient stock quantity
      let quantityResult;
      quantityResult = await shoppePool.query(`SELECT quantity FROM product WHERE id = ${sale.product_id}`);
      
      if (quantityResult.rows[0].quantity < sale.quantity) salesRemaining--;
      else {

        // delete cart record
        await shoppePool.query(`DELETE FROM cart WHERE customer_id = ${customerID} AND product_id = ${sale.product_id}`);

        // reduce stock quantity
        await shoppePool.query(`UPDATE product SET quantity = quantity-${sale.quantity} WHERE id = ${sale.product_id}`);

        // add sale record
        const newSaleIDquery = "SELECT CASE WHEN MAX(id) IS NULL THEN 1 WHEN MAX(id) IS NOT NULL THEN MAX(id)+1 END FROM sale";
        await shoppePool.query(`INSERT INTO sale VALUES((${newSaleIDquery}), ${sale.quantity}, ${newPurchaseID}, ${sale.product_id})`);

        salesRemaining--;
        sale.sold = true;
        if (salesRemaining === 0) {
          const sold = sales.filter(s => s.sold).map(s => ({product_id:s.product_id,quantity:s.quantity}));
          const salesStatus = sold.length === sales.length ? "complete" : "partial";
          res.status(201).send({message:"transaction successful",salesStatus,products:sold});
        }
      }
    }
  }
);

app.use("/api/orders",authenticate);
app.get("/api/orders",
  (req,res,next) => {
    shoppePool.query(`SELECT id,datetime FROM purchase WHERE customer_id = ${req.user.id}`, (error, result) => {
      if (error) throw error;

      res.status(200).send(result.rows);
    });
  }
);
app.get("/api/orders/:orderID",
  (req,res,next) => {
    shoppePool.query(`SELECT * FROM purchase WHERE id = ${req.params.orderID} AND customer_id = ${req.user.id}`, (error, result) => {
      if (error) throw error;

      if (result.rows.length > 0) {
        shoppePool.query(`SELECT product_id,quantity FROM sale WHERE purchase_id = ${req.params.orderID}`, (error, result) => {
          if (error) throw error;

          res.status(200).send(result.rows);
        });
      } else res.status(400).send({message:"order not made by customer "+req.user.name});
    });
  }
);



// STRIPE

const stripe = require("stripe")(process.env.STRIPE_SECRET);

const calculateOrderAmount = (items) => {
  const amount = items.reduce((a,b) => a + (b.quantity * 100 * b.price.slice(1)), 0);
  console.log(amount);
  return amount;
};


app.post("/api/create-payment-intent/:username", async (req, res) => {
  const items = req.body.cart;

  const { username } = req.params;
  console.log(username);

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "gbp",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  if (paymentIntent.client_secret) {
    shoppePool.query(`UPDATE customer SET client_secret = '${paymentIntent.client_secret}' WHERE username = '${username}'`, (error, result) => {
      if (error) throw error;

      res.status(200).send({
        clientSecret: paymentIntent.client_secret,
      });
    });
  }
});

/*******************************************************************/



// GOOGLE OAUTH

app.get("/scripts/googleLoginScript",
  (req,res,next) => {
    res.sendFile("/scripts/googleLoginScript.js", {root:__dirname});
  }
);

const googleRouter = require("./googleRouter.js")(passport);
app.use("/googleLogin",googleRouter);


/*********************************************************************/




app.listen(PORT, () => console.log("Shoppe running on port: "+PORT));