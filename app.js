const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
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

ProtectedRoutes.use(require('./middlewares/token.middleware'))
app.use('/elearning/api', ProtectedRoutes);
ProtectedRoutes.use(routes);
app.use('/elearning/login', login);
app.use('/elearning/signup', signup);
app.use('/elearning/categories', require('./routes/categories.route'));
app.get('/elearning/courses/', require('./controllers/course.controller').getAll);
app.get('/elearning/courses/:id', require('./controllers/course.controller').getOne);
app.post('/elearning/test/:course', require('./controllers/course.controller').addQuestion);
app.put('/elearning/test/:course/question/:question', require('./controllers/course.controller').updateQuestion);
app.delete('/elearning/test/:course/question/:question', require('./controllers/course.controller').deleteQuestion);

// Serve only the static files form the dist directory
app.use("/", express.static(__dirname + "/public"));
// Home page route.
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

let port = 8082;
app.listen(port, () => {
    console.log('Server is up and running on port ' + port);
});