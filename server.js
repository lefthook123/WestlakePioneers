(function(){
    'use strict';
}());
//Require Deps
var express = require("express");
var app = express();
var morgan = require("morgan");
var mongoose = require("mongoose");
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var methodOverride  = require('method-override');
//var multer = require('multer');
var passport = require('passport');
var config = require('./config');


// =======================
// configuration =========
// =======================
var port = Number(process.env.PORT || 3000);
var dbconnectionString = process.env.MONGOLAB_URI||config.database;
mongoose.connect(dbconnectionString);
var jwtSecret = process.env.JWTSECRET||config.secret;
app.set('superSecret',jwtSecret);

// setup cors
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
//app.use(multer({dest:'./public/images/'}));
// use morgan to log requests to the console
app.use(morgan('dev'));

//Making AJAX applications crawlable
app.use(require('prerender-node').set('prerenderToken', 'JnRlGTVr2vqIe9LleEWv'));
var blogRoutes = require('./modules/blogRoutes')(app);
var userRoutes = require('./modules/userRoutes')(app);
var userRoutes = require('./modules/teamRoutes')(app);
var userRoutes = require('./modules/contactRoutes')(app);
var ProjectGoogleMapRoutes = require('./modules/ProjectGoogleMapRoutes')(app);

// =======================
// routes ================
// =======================
// basic route
// route middleware to verify a token
app.use('/waiting/',function(req,res,next){
    // check header or url parameters or post parameters for token
    console.log('Request admin content...');
    var token = req.body.token || req.query.token || req.headers.authorization;
    console.log('token: '+token);
    if(token){
        jwt.verify(token,app.get('superSecret'),function(err,decoded){
            if(err){
                return res.json(404,'Failed to authenticate token.');                
            }else{
                req.decoded = decoded;
                next();
            }
        });
    }else{
        return res.status(403).send({
            success:false,
            message:'No token provided.'
        });
    }
});
//



app.use(express.static(__dirname + "/public"));
app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('/public/index.html', { root: __dirname });
});



/*
// setup passport
passport.use(new LocalStrategy(function(username, password, done) {
  if (username === user.username && password === userPassword) {
    return done(null, user);
  } else {
    done(null, false, { message: 'Incorrect username or password' });
  }
}));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  if (username === user.username) {
    done(null, user);
  } else {
    done('No user with username ' + username);
  }
});
*/
app.listen(port);
//console.log("Server running on port 3000");
//3461fc09-9243-41d9-a2c0-6bff4e00a266