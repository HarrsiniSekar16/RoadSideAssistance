let express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'), //created model loading here
    bodyParser = require('body-parser'),
    bearerToken = require('express-bearer-token');
    

// mongoose instance connection url connection
mongoose.connect('mongodb+srv://admin:admin@cluster1-wuqee.mongodb.net/userDB?retryWrites=true&w=majority', {});
mongoose.Promise = global.Promise;


//Enabling CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});


//Adding body parser for handling request and response objects.
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bearerToken());


// //Initialize app
let initApp = require('./app/app');
initApp(app);

// const routeApp = require('./app/routes/index');
// routes(app);

app.listen(port);
console.log('Road Side Assistance RESTful API server started on: ' + port);