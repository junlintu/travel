var express = require('express');
var app = express();
//设置handlebars视图引擎
var handlebars = require('express3-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

var fortune = require('./lib/fortune.js');

app.set('port', process.env.PORT || 3000);
app.use(express.static('../' + 'public'));

app.use(function(req, res, next){
	res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
	next();
})
app.get('/', function(req, res){
	// res.type('text/plain');
	// res.send('Technology Travel');
	res.render('home');
});
app.get('/about', function(req, res){
	// res.type('text/plain');
	// res.send('About Technology Travel');
	res.render('about', {fortune: fortune.getFortune()});
});
//404
app.use(function(req, res){
	res.type('text/plain');
	res.status(404);
	res.send('404 - Not Found');
});
//500
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.type('text/plain');
	res.status(500);
	res.send('500 - Server Error');
});

app.listen(app.get('port'),function(){
	console.log( 'Express started on http://localhost:' + app.get('port') + ';press Ctrl-C to terminame.');
});