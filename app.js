

const app = require('./api/api.js')


global.__basedir = __dirname;




app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});


