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
var mongojs = require('mongojs');
var config = require('./config');
var User = require('./models/user');
var Blog = require('./models/blog');
var Member = require('./models/member');
var ToolGoogleMapUser = require('./models/toolGoogleMapUser.js');
var nodemailer = require('nodemailer');

// =======================
// configuration =========
// =======================
var port = Number(process.env.PORT || 3000);
mongoose.connect(config.database);
app.set('superSecret',config.secret);
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
//app.use(multer({dest:'./public/images/'}));
// use morgan to log requests to the console
app.use(morgan('dev'));


//Making AJAX applications crawlable
app.use(require('prerender-node').set('prerenderToken', 'JnRlGTVr2vqIe9LleEWv'));

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


//USER
// --------------------------------------------------------
app.post('/admin/postuser',function(req,res){
    var reqBody=req.body;
    var user = new User({
            email:reqBody.email,
            password:'Password',
            admin:reqBody.admin,
            company:reqBody.company,
            createddate:Date.now(),
            createdby:reqBody.createdby,
            isactive:true
    });
    user.save(function(err){
        if(err){
            console.log(err);
            throw err;
        }
        console.log('User saved successfully');
        res.json({success: true});
    });
});
app.delete('/admin/deleteuser/:id',function(req,res){
    var id = req.params.id;
    var objectId = mongoose.Types.ObjectId(id);
    console.log('deleteuser request');
    User.find({_id:objectId}).remove(function(err,model){
        if(err){
            res.json('unable to remove');
        }else{
            res.json(model);
        }
    });
});
app.put('/admin/updateuser/:id',function(req,res){
    var id = req.params.id;
    var objectId = mongoose.Types.ObjectId(id);
    console.log('updateuser request');
    var blogbody = req.body.body;
    var blogtags=req.body.tags;
    Blog.findOneAndUpdate(
        {_id:objectId},
        {
            body:blogbody,
            tags:blogtags
        },function(err,article){
            if(err)throw err;
        });
});
app.get('/admin/retrieveusers', function(req, res){
    console.log('users get request');
    User.find({},function(err,users){
        console.log(users);
        res.json(users);
    });
});
app.post('/authenticate',function(req,res){
    console.log('login post request!');
    User.findOne({
        email:req.body.email
    },function(err,user){
        console.log(user);
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
                    {token:token,user:user}
                );
            }
        }
    });
});

//TEAM
// --------------------------------------------------------
app.post('/admin/postmember',function(req,res){
    var reqBody=req.body;
    var member = new Member({
            title:reqBody.title,
            bio:reqBody.bio,
            photo:reqBody.photo,
            name:reqBody.name,
            email:reqBody.email,
            DateJoined:reqBody.DateJoined,
            linkedin:reqBody.linkedin,
            blog:reqBody.blog,
            facebook:reqBody.facebook
    });
    member.save(function(err){
        if(err){
            console.log(err);
            throw err;
        }
        console.log('Member saved successfully');
        res.json({success: true});
    });
});
app.delete('/admin/deletemember/:id',function(req,res){
    var id = req.params.id;
    var objectId = mongoose.Types.ObjectId(id);
    console.log('deletemember request');
    Member.find({_id:objectId}).remove(function(err,model){
        if(err){
            res.json('unable to remove');
        }else{
            res.json(model);
        }
    });
});
app.put('/admin/updatemember/:id',function(req,res){
    var id = req.params.id;
    var objectId = mongoose.Types.ObjectId(id);
    console.log('updateuser request');
    var memberbody = req.body.body;
    var blogtags=req.body.tags;
    Member.findOneAndUpdate(
        {_id:objectId},
        {
            body:blogbody,
            tags:blogtags
        },function(err,article){
            if(err)throw err;
        });
});
app.get('/admin/retrievemembers', function(req, res){
    console.log('members get request');
    Members.find({},function(err,members){
        console.log(members);
        res.json(members);
    });
});


//BLOG
// --------------------------------------------------------
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
app.put('/admin/updateblog/:id',function(req,res){
    var id = req.params.id;
    var objectId = mongoose.Types.ObjectId(id);
    console.log('updateblog request');
    var blogbody = req.body.body;
    var blogtags=req.body.tags;
    Blog.findOneAndUpdate(
        {_id:objectId},
        {
            body:blogbody,
            tags:blogtags
        },function(err,article){
            if(err)throw err;
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


//CONTACT US
// --------------------------------------------------------
app.post('/contact',function(req,res){

    console.log(req.body);
    console.log('received email request');
    /*
    var generator = require('xoauth2').createXOAuth2Generator({
        user: 'zxw120230@gmail.com',
        clientId: '360476010879-jv4o487i67cshjh383ehc24q8m7hpfga.apps.googleusercontent.com',
        clientSecret: 'LLgqxMTeiwd9ChEgHZRrUy3u',
        refreshToken: '{refresh-token}',
        accessToken: '{cached access token}' // optional
    });*/
    var mailOpts,smtpTrans;

    //Setup Nodemailer transport, I chose gmail. Create an application-specific password to avoid problems.
    smtpTrans = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user:'zxw120230@gmail.com',
            pass:'SuperSecurity@888'
        }   
    });

    //Mail options //Fred Foo ✔ <foo@blurdybloop.com>
    mailOpts = {
        from : req.body.name + ' ✔ <' + req.body.email + '>',
        to: 'sf.jackwang@gmail.com',
        subject: 'Westlake Pioneers ✔',
        text: req.body.message+' ✔',
        html: '<b>'+req.body.message+' ✔</b>' // html body
    };

    smtpTrans.sendMail(mailOpts, function (error, response) {

        if (error) {
            console.log(error);
            res.send('Something must be wrong, please try again...');

        }else{
            console.log('Success');
            res.send('Thank you for contacting us. We received your email!');
        }

    });
});

//

// Google Map START

// GET Routes
// --------------------------------------------------------
// Retrieve records for all toolgooglemapusers in the db
app.get('/toolgooglemapusers',function(req,res){
    console.log('toolgooglemapusers get request');
    var query = ToolGoogleMapUser.find({});
    query.exec(function(err,toolgooglemapusers){
        if(err)
            res.send(err);
        res.json(toolgooglemapusers);
    });
});

// POST Routes
// --------------------------------------------------------
// Provides method for saving new users in the db

app.post('/toolgooglemapusers',function(req,res){
    console.log('toolgooglemapusers post request');
    var newtoolgooglemapuser = new ToolGoogleMapUser(req.body);
    newtoolgooglemapuser.save(function(err){
        if(err)
            res.send(err);
        res.json(req.body);
    });

});

// Google Map END


app.use(express.static(__dirname + "/public"));
app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('/public/index.html', { root: __dirname });
});


// setup cors
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
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