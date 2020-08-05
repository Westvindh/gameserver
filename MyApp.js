var express = require('express');
var bodyParser = require('body-parser');
var todocontroler = require('./controllers/todocontroller');

var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');
app.use(express.static('./public'));

todocontroler(app);




app.get('/', function(req, res)
{
	res.sendFile(__dirname + '/page.html');
});

app.get('/ejs/:name', function(req, res)
{
	var data = {age: 'Age', job: 'Job', hobbies: ['a', 'b', 'c'] };
	res.render('profile', {person: req.params.name, data});
});

app.get('/name:id', function(req, res)
{
	res.send('page + ' + req.params.id);
});

app.get('/query', function(req, res)
{
	res.render('query', {qs: req.query});
});

app.post('/query', urlencodedParser, function(req, res)
{
	console.log(req.body);
	res.render('query-success', {data: req.body});
});

app.listen(3000);























/*var http = require('http');
var fs = require('fs');


var server = http.createServer(function(req, res)
{

if(req.url == '/home' || req.url == '/')
{
	res.writeHead(200, {'Content-Type' : 'text/html'});
	var myReadStream = fs.createReadStream(__dirname + '/page.html', 'utf8');
	myReadStream.pipe(res);
}
else
{
	res.writeHead(200, {'Content-Type' : 'application/json'});
	var myObj = {name : 'Name', job : "Job", number : 453};
	res.end(JSON.stringify(myObj));
}
});
*/
/*var server = http.createServer(function(req, res)
{

//res.writeHead(200, {'Content-Type' : 'text/html'});
//var myReadStream = fs.createReadStream(__dirname + '/page.html', 'utf8');

res.writeHead(200, {'Content-Type' : 'application/json'});
var myObj = {name : 'Name', job : "Job", number : 453};

//myReadStream.pipe(res);

res.end(JSON.stringify(myObj));
});*/

/*
server.listen(3000, '127.0.0.1');
console.log('Server Running');
*/