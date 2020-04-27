const express                   =   require('express')
const config                    =   require('config')
const body_parser               =   require('body-parser');
const password                  =   require('../utils/password_bcrypt');
const mongojs_db_connection     =   require('../database/database.config.js');
const jwt                       =   require('jsonwebtoken');
const token                     =   require('../middleware/token');
const auth                      =   require('../middleware/auth');
var express_validator           =   require('express-validator');
const route                     =   express.Router();
const validation_schema         =   require('../validation_schema/validation_schema.js');
const image_upload              =   require('../utils/image_upload')
const multer                    =   require('multer')
route.use(express_validator())





route.post('/login', async(req, res, next) => {
    try {
        fetch_object = {'email_address' : req.body.email_address, 'is_delete' : '0'};
        get_user_details(fetch_object).then((result) => {
            if(result && result.email_address) {
                password.check_password(req.body.password, result.password).then((compare_password_status) => {
                    if (compare_password_status !== false) {
                        const access_token = token.access_token(result);
                        token.refresh_token(result, (refresh_token) => {
                            res.status(200).send({
                                'success' : true,
                                'message' : 'login sucessfully done.',
                                'access_token' : access_token,
                                'refresh_token' : refresh_token
                            });
                            return;
                        });
                        
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






route.post('/register', async(req, res, next) => {
    try {
        req.checkBody(validation_schema.registration_schema);
        const validation_errors = req.validationErrors();
        if (validation_errors ) {
            res.status(200).send({ 'success' : false, 'message' : validation_errors }); return;
        } else {
            const check_email_exists_status = await check_email_exists(req.body.email_address);
            if(!check_email_exists_status) {
                const hashed_password = await password.password_hashing(req.body.password)
                let insert_object = {
                    'email_address' : req.body.email_address.replace( /(<([^>]+)>)/ig, '').trim(),
                    'username' : req.body.username.replace( /(<([^>]+)>)/ig, '').trim(),
                    'gender' : req.body.gender.replace( /(<([^>]+)>)/ig, '').trim(),
                    'password' : hashed_password,
                    'image_url' : "",
                    'is_delete' : '0'
                }
                const insert_status = await create_new_user(insert_object);
                    res.status(200).send({
                        'success' : true,
                        'message' : 'user created successfully done.'
                    });
                    return;
            } else {
                res.status(400).send({
                    'success' : false,
                    'message' : 'email already exists.'
                });
                return;
            }
        }
    } catch(err) {
        res.status(400).send({
            'success' : false,
            'message' : err.message
        });
        return;
    }
});


async function create_new_user(insert_object){
    return new Promise ((reslove, reject) => {
        try {
            mongojs_db_connection.db.users.insert(insert_object, (error, result) => {
                if (error) reject(error);
                reslove(result);
            });
        } catch(err) {
            reject(err);
        }
    });
}


async function check_email_exists(email_address){
    return new Promise((reslove, reject) => {
        try {
            mongojs_db_connection.db.users.findOne({'email_address' : email_address}, (error, result) => {
                if (error) reject(error);
                reslove(result);
            });
        } catch(err) {
            reject(err);
        }
    });
}




route.get('/fetch_profile', auth, async(req, res, next) => {
    try {
        user_details = await fetchUserDetails(req.user._id);
        res.status(200).send({
            'success' : true,
            'message' : 'fetch successfully done.',
            'details' : user_details
        });
        return;
    } catch(err) {
        res.status(400).send({
            'success' : false,
            'message' : err.message
        });
        return;
    }
    
});



async function fetchUserDetails(user_id) {
    return new Promise((reslove, reject) => {
        try {
            object_id = mongojs_db_connection.mongojs.ObjectId(user_id)
            mongojs_db_connection.db.users.findOne({'_id' : object_id}, {_id:0, password:0, is_delete:0}, (error, result) =>{
                if (error) reject(error)
                reslove(result)
            });
        } catch(err) {
            reject(err)
        }
    });
}


route.post('/image_upload', auth, image_upload.single('file'),  (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send({
              'success': false,
              'message' : 'Something went wrong!'
            });
        } else {
            return res.status(200).send({
                'success': true,
                'message' : 'Image uploaded successfuly done.',
                'file_name' : req.file.filename
            })
        }
    } catch(err) {
        res.status(400).send({
            'success' : false,
            'message' : err.message
        });
        return;
    }
})










module.exports = route;