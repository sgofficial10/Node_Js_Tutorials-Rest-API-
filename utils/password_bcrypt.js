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


async function check_password(give_password, store_password){
    return new Promise((reslove, reject) => {
        bcrypt.compare(give_password, store_password, (err, result) => {
            if (err) reject(err);
            reslove(result);
        });
    });
}



module.exports = {
    password_hashing : password_hashing,
    check_password : check_password

}