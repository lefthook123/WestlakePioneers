var express = require("express");
var app = express();
var mongojs = require('mongojs');
var dburl = process.env.MONGOLAB_URI;
var blogcollection = ['wpblogs'];
var db = mongojs(dburl,blogcollection);

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