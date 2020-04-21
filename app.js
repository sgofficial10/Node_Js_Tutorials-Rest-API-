const config = require('config');
const express = require('express');
const api = require('./api/api.js');
const user = require('./api/login_register');

// set enviroment variable use keyword export
// for our application we use export node_jwt_private_key
const app = express();
app.use('/', api);
app.use('/user', user)



if(!config.get('jwt_private_key')){
    console.error('private key is not define.');
    // 0 means success and 1 means error
    process.exit(1);
}

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});


