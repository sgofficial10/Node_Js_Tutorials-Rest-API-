const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next) {
    const token = req.header('token');
    if (!token) return res.status(401).send({'success' : false, 'message': 'token is required.'})

    try {
        const decode = jwt.verify(token, config.get('jwt_private_key'));
        req.user = decode;
        next();
    } catch(Error) {
        return res.status(400).send({'success' : false, 'message': 'Invalid token'})
    }
    
}



module.exports = auth;