//Require Deps
var express = require("express");
var app = express();
var morgan = require("morgan");
var mongoose = require("mongoose");
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongojs = require('mongojs');
var config = require('./config');
var User = require('./models/user');
var Blog = require('./models/blog');

// =======================
// configuration =========
// =======================
var port = Number(process.env.PORT || 3000);
mongoose.connect(config.database);
app.set('superSecret',config.secret);

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// basic route
// route middleware to verify a token
app.use('/waiting',function(req,res,next){
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
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

app.get('/setup',function(req,res){

    var blog = new Blog({
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
            posttime:Date.now(),
            author:'Jack Wang'
    });
    blog.save(function(err){
        if(err){
            console.log(err);
            throw err;
        }
        console.log('Blog saved successfully');
        res.json({success: true});
    });
});

app.post('/authenticate',function(req,res){
    User.findOne({
        name:req.body.name
    },function(err,user){
        if(err) throw err;
        if(!user){
            res.json(404,'Authentication failed. User not found');
        }else if(user){
            if(user.password != req.body.password){
                res.json(404,'Authentication failed. Wrong password.');
            }else{
                var token = jwt.sign(user,app.get('superSecret'),{
                    expireInMinutes:1440 //expires in 24 hours
                });

                res.json(
                    200,{token:token,user:user}
                );
            }
        }
    });
});

app.delete('/admin/deleteblog/:id',function(req,res){
    var id = req.params.id;
    var objectId = mongoose.Types.ObjectId(id);
    console.log('deleteblog request');
    Blog.find({_id:objectId}).remove(function(err,model){
        if(err){
            res.json('unable to remove');
        }else{
            res.json(model);
        }
    });
});
app.post('/admin/postblog',function(req,res){
    var reqBody=req.body;
    var blog = new Blog({
            title:reqBody.title,
            body:reqBody.body,
            pictures:reqBody.pictures,
            reviews:[
            ],
            posttime:Date.now(),
            author:reqBody.author
    });
    blog.save(function(err){
        if(err){
            console.log(err);
            throw err;
        }
        console.log('Blog saved successfully');
        res.json({success: true});
    });

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
    Blog.find({},function(err,blogs){
        console.log(blogs);
        res.json(blogs);
    });
});
app.get('/retrieveblogs/:title', function(req, res){
    var title = req.params.title;
    console.log('single blog get request');
    Blog.findOne({title:title},function(err,blog){
        res.json(blog);
    });
});

app.use(express.static(__dirname + "/public"));
app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('/public/index.html', { root: __dirname });
});

/*
// setup cors
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
*/
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