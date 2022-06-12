let pool;

module.exports.initialisePool = function(aPool) {
    pool = aPool;
}


// userDB.createUser({ username, password });
module.exports.createUser = function(userData, cb) {
    const {name, email, username, password_hash} = userData;
    if (name && email && username && password_hash) {
        pool.query(`SELECT * FROM customer WHERE username = '${username}' OR email = '${email}'`, (error,result) => {
            if (error) throw error;

            if (result.rows.length === 0) {
                pool.query(`INSERT INTO customer (name,email,username,password_hash) VALUES ('${name}', '${email}', '${username}', '${password_hash}')`, (error,result) => {
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

module.exports.updateUser = async function(username, newUserData, cb) {

    let usernameTaken = false;
    
    if (newUserData.username && newUserData.username !== username) { // check that a new username is not already in use
        await pool.query(`SELECT * FROM customer WHERE username = '${newUserData.username}'`, (error, result) => {
            if (error) throw error;

            if (result.rows.length > 0) { // if requested username is already in use, remove the request
                delete newUserData.username;
                usernameTaken = true;
            }
        });
    }

    pool.query(`SELECT * FROM customer WHERE username = '${username}'`, (error,result) => {
        if (error) throw error;

        const oldUserData = result.rows[0];

        const id = oldUserData.id;
        const newName = newUserData.name || oldUserData.name;
        const newEmail = newUserData.email || oldUserData.email;
        const newUsername = newUserData.username || oldUserData.username;
        const newPassword = newUserData.password_hash || oldUserData.password_hash;
        pool.query(`UPDATE customer SET name = '${newName}', email = '${newEmail}', username = '${newUsername}', password_hash = '${newPassword}' WHERE id = ${id}`, (error,result) => {
            if (error) throw error;

            let changeMessage = "none updated";
            const changed = ["name","email","username","password_hash"].filter(k => newUserData[k] && newUserData[k] !== oldUserData[k]);
            console.log(newUserData.password_hash,oldUserData.password_hash);
            if (changed.length > 0) changeMessage = changed.map(k => k === "password_hash" ? "password" : k).join(", ")+" updated";
            if (usernameTaken) changeMessage += ", username already taken";
            cb(changeMessage);
        });
    });
}



module.exports.deleteUser = function(username, cb) {
    pool.query(`DELETE FROM customer WHERE username = '${username}'`, (error,result) => {
        if (error) throw error;

        cb();
    });
}