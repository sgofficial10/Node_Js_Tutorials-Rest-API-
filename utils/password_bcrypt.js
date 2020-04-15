const bcrypt = require('bcrypt')



async function password_hashing(password){
    const hashed_password = await new Promise((reslove, reject) => {
        bcrypt.hash(password, 10, function(err, hash){
            if (err) reject(err)
            reslove(hash);
        });
    });
    return hashed_password;
}



module.exports = password_hashing;