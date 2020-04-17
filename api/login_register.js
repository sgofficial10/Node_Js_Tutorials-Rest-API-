const express = require('express')
const config = require('config')
const body_parser = require('body-parser');
const password = require('../utils/password_bcrypt');
const mongojs_db_connection = require('../database/database.config.js');
const jwt = require('jsonwebtoken');
const route = express.Router();






route.post('/login', async(req, res, next) => {
    try {
        fetch_object = {'email_address' : req.body.email_address, 'is_delete' : 0};
        get_user_details(fetch_object).then((result) => {
            if(result && result.email_address) {
                password.check_password(req.body.password, result.password).then((compare_password_status) => {
                    if (compare_password_status !== false) {
                        const token = jwt.sign({email:result.email_address, _id:result._id}, config.get('jwt_private_key'));
                        res.status(200).send({
                            'success' : true,
                            'message' : 'login sucessfully done.',
                            'token' : token
                        });
                        return;
                    } else {
                        res.status(400).send({
                            'success' : false,
                            'message' : 'password is wrong'
                        });
                        return;
                    }
                }).catch((compare_password_error) => {
                    res.status(400).send({
                        'success' : false,
                        'message' : compare_password_error
                    });
                    return;
                });
            } else {
                res.status(400).send({
                    'success' : false,
                    'message' : 'user not found.'
                });
                return;
            }
        }).catch((error) => {
            res.status(400).send({
                'success' : false,
                'message' : error.message
            });
            return;
        });

    } catch(e) {
        res.status(400).send({
            'success' : false,
            'message' : e.message
        });
        return;
    }
});



async function get_user_details(fetch_object) {
    return new Promise((reslove, reject) => {
        try {
            mongojs_db_connection.db.users.findOne(fetch_object, (error, result) => {
                if(!error) {
                    reslove(result);
                } else {
                    reject(error);
                }
            });
        } catch(e) {
            reject(e);
        }
    });
}










module.exports = route;