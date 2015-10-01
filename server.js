//Require Deps
var express = require("express");
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongojs = require('mongojs');
var LocalStrategy = require('passport-local').Strategy;
var fs = require('fs');

//Database

var dbFile = './user.json';
if (fs.existsSync(__dirname + '/user.local.json')) {
  dbFile = './user.local.json';
}
var user = require(dbFile);
var userPassword = user.password;
delete user.password;



var dburl = process.env.MONGOLAB_URI;
var blogcollection = ['wpblogs'];
//var db = mongojs(dburl,blogcollection);

//setup server
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//setup jwt
var jwtSuperSecretCode = 'lonestar1';
var validateJwt = expressJwt({secret:jwtSuperSecretCode});
app.use('/',function(req,res,next){
    if(req.originalUrl === '/login'){
        next();
    }else{
        validateJwt(req,res,next);
    }
});


// setup cors
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


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


//setup routes
app.post('/login',function(req,res,next){
    passport.authenticate('local',function(err,user,info){
        if(err){
            return next(err);
        }if(!user){
            return res.json(404,'No user found...');
        }
        req.logIn(user,function(err){
            if(err){
                return next(err);
            }
            var token =jwt.sign({
                username:user.username
            },jwtSuperSecretCode);
            return res.json(200,{token:token,user:user});
        });
    })(req,res,next);
});

app.get('/logout', function(req, res) {
  req.logout();
  res.json(200, { success: true });
});

app.get('/users/me', function(req, res) {
  if (req.user) {
    res.json(user);
  } else {
    res.json(403, { message: 'Not authorized' });
  }
});


function article(title,body,pictures,reviews,posttime,author){
    this.title = title;
    this.body = body;
    this.pictures = pictures;
    this.reviews = reviews;
    this.posttime = posttime;
    this.author = author;
}

app.get('/retrieveblogs', function(req, res){
	console.log('blog get request');

	db.wpblogs.find(function(err,docs){
		if(err){
			console.log(err);
		}else{
			res.json(docs);
		}
	});

	/*
	var articles= [       
        {
            title:'Welcome to Westlake Pioneers',
            body:'Hello, I\'m building this website as fast as I can. \n I will be blogging things happening around me and the new technologies I am learning.',  
            pictures:[
                {style:'width:100px;height:100px;',path:'images/welcome.jpg',name:'welcome'}
            ],
            reviews:[
                {
                    author:'Jack Wang',posttime:'',
                    body:'I will keep track of your blog!',
                    replies:[
                        {author:'Tom',posttime:'',body:'Glad to hear that!'},
                        {author:'Cindy',posttime:'',body:'I want to join!'}
                    ]
                },
                {
                    author:'James Lemon',posttime:'',
                    body:'Come on!',
                    replies:[
                        {author:'Jack Wang',posttime:'',body:'I will!'}
                    ]
                }
            ],
            posttime:'',
            author:'Jack Wang'
        },
        {
            title:'Welcome to Westlake Pioneers',
            body:'Hello, I\'m building this website as fast as I can. \n I will be blogging things happening around me and the new technologies I am learning.',  
            reviews:[
                {
                    author:'Jack Wang',posttime:'',
                    body:'I will keep track of your blog!',
                    replies:[
                        {author:'Tom',posttime:'',body:'Glad to hear that!'}

                    ]
                }
            ],
            posttime:'',
            author:'Jack Wang'
        }      
    ];
    res.json(articles);*/
});


app.use(express.static(__dirname + "/public"));
//app.use('/js', express.static(__dirname + '/public/js'));
//app.use('/dist', express.static(__dirname + '/../dist'));
//app.use('/css', express.static(__dirname + '/public/css'));
//app.use('/partials', express.static(__dirname + '/public/partials'));
app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('/public/index.html', { root: __dirname });
});

var port = Number(process.env.PORT || 3000);
app.listen(port);
//console.log("Server running on port 3000");
//3461fc09-9243-41d9-a2c0-6bff4e00a266