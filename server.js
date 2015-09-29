var express = require("express");
var app = express();
var secret = 'Lonestar1';
//***************************Authentication Use****************
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
//**************************************************************
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var dburl = process.env.MONGOLAB_URI;
var blogcollection = ['wpblogs'];
//var db = mongojs(dburl,blogcollection);

app.use('/api',expressJwt({secret:secret}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post('/authenticate',function(req,res){
    if(!(req.body.username==='john.doe'&&req.body.password==='foobar')){
        res.send(401,'Wrong user or password');
        return;
    }

    var profile = {
        first_name: 'John',
        last_name:'Doe',
        email:'john@doe.com',
        id: 123
    };

    var token = jwt.sign(profile,secret,{expiresInMinutes:60*5});
    res.json({token:token});
});

app.get('/api/restricted',function(req,res){
    console.log('user ' + req.user.email + ' is calling /api/restricted');
    res.json({
        name:'foo'
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