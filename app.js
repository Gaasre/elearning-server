const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const ProtectedRoutes = express.Router();
const routes = require('./routes');
const login = require('./routes/login.route');
const signup = require('./routes/signup.route');


// Set up mongoose connection
const mongoose = require('mongoose');
let dev_db_url = 'mongodb://localhost:27017/elearning';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Static files
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/favicon.ico'));

app.use(express.static(__dirname + '/memer'));
app.use(express.static(__dirname + '/memer/favicon.ico'));

ProtectedRoutes.use(require('./middlewares/token.middleware'))
app.use('/api', ProtectedRoutes);
ProtectedRoutes.use(routes);
app.use('/login', login);
app.use('/signup', signup);
app.use('/categories', require('./routes/categories.route'));
app.get('/courses/', require('./controllers/course.controller').getAll);
app.get('/courses/:id', require('./controllers/course.controller').getOne);
app.post('/test/:course', require('./controllers/course.controller').addQuestion);
app.put('/test/:course/question/:question', require('./controllers/course.controller').updateQuestion);
app.delete('/test/:course/question/:question', require('./controllers/course.controller').deleteQuestion);

app.use('/assets', express.static(__dirname + '/public/assets'));
app.use('/memer', express.static(__dirname + '/memer'));
app.use('*', express.static(__dirname + '/public'));

let port = 1234;
app.listen(port, () => {
    console.log('Server is up and running on port ' + port);
});