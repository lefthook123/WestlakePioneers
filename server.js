var express = require("express");
var app = express();

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