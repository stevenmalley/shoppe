let pool;

module.exports.initialisePool = function(aPool) {
    pool = aPool;
}


// userDB.createUser({ username, password });
module.exports.createUser = function(userData, cb) {
    const {name, email, username, password} = userData;
    if (name && email && username && password) {
        pool.query(`SELECT * FROM customer WHERE username = '${username}' OR email = '${email}'`, (error,result) => {
            if (error) throw error;

            if (result.rows.length === 0) {
                pool.query(`INSERT INTO customer (name,email,username,password) VALUES ('${name}', '${email}', '${username}', '${password}')`, (error,result) => {
                    if (error) throw error;

                    cb(201,"User created");
                });
            } else {
                cb(400,"Username or email taken");
            }
        });
    } else {
        cb(400,"Credentials not provided");
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
    pool.query(`SELECT * FROM customer WHERE username = '${username}'`, (error,result) => {
        cb(error,result.rows[0]);
    });
}

/*
userDB.findById(id, function (err, user) { // Look up user id in database
    if (err) return done(err);
    done(null, user);
  });
*/
module.exports.findById = function(id, cb) {
    pool.query(`SELECT * FROM customer WHERE id = ${id}`, (error,result) => {
        cb(error,result.rows[0]);
    });

}

module.exports.updateUser = function(username, newUserData, cb) {
    pool.query(`SELECT * FROM customer WHERE username = '${username}'`, (error,result) => {
        if (error) throw error;

        const id = result.rows[0].id;
        const newName = newUserData.name || result.rows[0].name;
        const newEmail = newUserData.email || result.rows[0].email;
        const newUsername = newUserData.username || result.rows[0].username;
        const newPassword = newUserData.password || result.rows[0].password;
        pool.query(`UPDATE customer SET name = '${newName}', email = '${newEmail}', username = '${newUsername}', password = '${newPassword}' WHERE id = ${id}`, (error,result) => {
            if (error) throw error;

            cb();
        });
    });
}



module.exports.deleteUser = function(username, cb) {
    pool.query(`DELETE FROM customer WHERE username = '${username}'`, (error,result) => {
        if (error) throw error;

        cb();
    });
}