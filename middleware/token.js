const jwt = require('jsonwebtoken');
const config = require('config');
const redis_connection = require('../database/redis.config');


function access_token(user_details){
    const token = jwt.sign({email_address:user_details.email_address, _id:user_details._id}, config.get('jwt_private_key'), {expiresIn: '30Min'});
    return token;
}



function refresh_token(user_details, callback){
    redis_connection.hgetall('userId:'+user_details._id, (error, result) => {
        if (error) throw(error);
        if(result) {
            try {
                jwt.sign(result.refresh_token, 'refresh_token');
                callback(result.refresh_token);
            } catch(decode_error) {
                const refresh_token = jwt.sign({email_address:user_details.email_address, _id:user_details._id}, config.get('jwt_refresh_key'), {expiresIn: '30d'});
                redis_connection.hmset('userId:'+user_details._id, 'refresh_token', refresh_token, (err) => { });
                callback(refresh_token);
            }
        } else {
            const refresh_token = jwt.sign({email_address:user_details.email_address, _id:user_details._id}, config.get('jwt_refresh_key'), {expiresIn: '30d'});
            redis_connection.hmset('userId:'+user_details._id, 'refresh_token', refresh_token, (err) => { });
            callback(refresh_token);
        }
    });
    
}




module.exports = {
    access_token,
    refresh_token
} ;