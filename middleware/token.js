const jwt = require('jsonwebtoken');
const config = require('config');


function get_token(user_details){
    const token = jwt.sign({email:user_details.email_address, _id:user_details._id}, config.get('jwt_private_key'));
    return token;
}




module.exports = get_token;