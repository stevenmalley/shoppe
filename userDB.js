const Pool = require('pg').Pool;
const userPool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'shoppeUsers',
  password: 'password',
  port: 5432,
});


// userDB.createUser({ username, password });
module.exports.createUser = function(userData, res) {
    const {username, password} = userData;
    if (username && password) {
        userPool.query(`SELECT * FROM users WHERE username = '${username}'`, (error,results) => {
            if (error) throw error;

            if (results.rows.length === 0) {
                userPool.query(`INSERT INTO users (username,password) VALUES ('${username}', '${password}')`, (error,results) => {
                    if (error) throw error;

                    res.status(201).send("User created");
                });
            } else {
                res.send("Username taken");
            }
        });
    } else {
        res.send("Credentials not provided");
    }
}

/*
findByUsername(username, (err, user) => { // Look up user in the db
    if(err) return done(err); // If there's an error in db lookup, return err callback function
    if(!user) return done(null, false); // If user not found, return null and false in callback
    if(user.password != password) return done(null, false); // If user found, but password not valid, return err and false in callback
    return done(null, user); // If user found and password valid, return the user object in callback
  });
})
*/
module.exports.findByUsername = function(username, cb) {
    userPool.query(`SELECT * FROM users WHERE username = '${username}'`, (error,results) => {
        cb(error,results.rows[0]);
    });
}

/*
userDB.findById(id, function (err, user) { // Look up user id in database
    if (err) return done(err);
    done(null, user);
  });
*/
module.exports.findById = function(id, cb) {
    userPool.query(`SELECT * FROM users WHERE id = ${id}`, (error,results) => {
        cb(error,results.rows[0]);
    });

}