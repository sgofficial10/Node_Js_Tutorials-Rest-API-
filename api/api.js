const express = require('express')
const body_parser = require('body-parser');
const mongojs_db_connection = require('../database/database.config.js');
const Joi = require('joi');
const formidable = require('formidable');
const router = express()
const path = require('path');

router.use(body_parser.urlencoded({extended: true}))
router.use(body_parser.json())



router.get('/', (req, res) => {
    res.json({
        "message" : "server is listening"
    });
});


router.post('/insert', (req, res) => {
    try {
        const schema = {
            user_name: Joi.string().required(),
            email_address: Joi.string().required()
        }
        

        const input_validate = Joi.validate(req.body, schema);
        if(input_validate.error) {
            res.status(400).send({
                'success' : false,
                'message' : input_validate.error.details[0].message
            });
            return;
        } else {
            mongojs_db_connection.db.users.insert({'user_name' : req.body.username, 'email_address' : req.body.email, is_delete: 0}, function(err, docs){
                if(err) {
                    res.status(400).send({
                        'success' : false,
                        'message' : 'somethings went wrong.'
                    });
                    return;
                } else {
                    res.status(200).send({
                        'success' : true,
                        'message' : 'user created successfully done.'
                    });
                    return;
                }

            });
        }
    } catch(e){
        console.log(e);
    }
    
});




router.get('/list', (req, res) => {
    try {
        mongojs_db_connection.db.users.find({is_delete:0}).toArray(function(err, docs){
            if(err) {
                res.status(400).send({
                    'success' : false,
                    'message' : 'somethings went wrong.'
                });
                return;
            } else {
                res.status(200).send({
                    'success' : true,
                    'message' : 'fetch sucessfully done.',
                    'details' : docs
                });
                return;
            }
        });
    } catch(e){
        console.log(e);
    }
});




router.get('/fetch_details/:user_id', function(req, res){
    try {
        if(!req.params.user_id || req.params.user_id === '') {
            res.status(400).send({
                'success' : false,
                'message' : 'user id is required.'
            });
            return;
        } else {
            objcet_id = mongojs_db_connection.mongojs.ObjectId(req.params.user_id)
            mongojs_db_connection.db.users.findOne({_id:objcet_id}, function(err, docs){
                if(err) {
                    res.status(400).send({
                        'success' : false,
                        'message' : 'something went wrong.'
                    });
                    return;
                } else {
                    res.status(200).send({
                        'success' : true,
                        'message' : 'fetch sucessfully done.',
                        'details' : docs
                    });
                    return;
                }
            });
        }
    } catch(e) {
        console.log(e);
    }
});



router.post('/update', function(req, res){
    try{
        const schema = {
            user_id : Joi.string().required(),
            user_name: Joi.string().required(),
            email_address: Joi.string().required()
        }
        const input_validate = Joi.validate(req.body, schema);
        if(input_validate.error) {
            res.status(400).send({
                'success' : false,
                'message' : input_validate.error.details[0].message
            });
            return;
        } else {
            mongojs_db_connection.db.users.update({_id :  mongojs_db_connection.mongojs.ObjectId(req.body.user_id)},{$set:{email_address:req.body.email_address, user_name:req.body.user_name}}, function(err, doc){
                if(!err) {
                    res.status(200).send({
                        'success' : true,
                        'message' : 'Update successfully done.'
                    });
                    return;
                } else {
                    res.status(200).send({
                        'success' : false,
                        'message' : 'SOmethings went wrong.'
                    });
                    return;
                }
            });
        }
    } catch(e){
        console.log(e);
    }
});




router.get('/delete/:user_id', function(req, res){
    try {
        object_id = mongojs_db_connection.mongojs.ObjectId(req.params.user_id);
        mongojs_db_connection.db.users.update({_id :  object_id},{$set:{is_delete:1}}, function(err, doc){
            if(!err) {
                res.status(200).send({
                    'success' : true,
                    'message' : 'User deleted successfully done.'
                });
                return;
            } else {
                res.status(200).send({
                    'success' : false,
                    'message' : 'Somethings went wrong.'
                });
                return;
            }
        });
    } catch(e) {
        console.log(e);
    }
});



// router.post('/file_upload', function(req, res){
//     let form = new formidable.IncomingForm();
//     form.parse(req);
// });






module.exports = router;