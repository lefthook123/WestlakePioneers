var express = require("express");
var app = express();

var sweetcaptcha = new require('sweetcaptcha')(appId, appKey, appSecret);

app.get('/', function(req, res){
	//get sweetcaptcha html for the contact area
	sweetcaptcha.api('get_html', function(err,html){
		//Send the guts of the captcha to your template
		res.render('main', { captcha : html });
	});
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