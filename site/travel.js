var http = require('http'),
	https = require('https'),
	express = require('express'),
	fortune = require('./lib/fortune.js'),
	formidable = require('formidable'),
	common = require('./lib/common'),
	fs = require('fs'),
	vhost = require('vhost'),
	Q = require('q'),
	Article = require('./models/article.js');
	markdown = require( "markdown" ).markdown;

var app = express();
var credentials = require('./credentials.js');
//设置handlebars视图引擎
var handlebars = require('express3-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

var fortune = require('./lib/fortune.js');

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
app.use(require('body-parser')());

// database configuration
var mongoose = require('mongoose');
var options = {
    server: {
       socketOptions: { keepAlive: 1 } 
    }
};
switch(app.get('env')){
    case 'development':
        mongoose.connect(credentials.mongo.development.connectionString, options);
        break;
    case 'production':
        mongoose.connect(credentials.mongo.production.connectionString, options);
        break;
    default:
        throw new Error('Unknown execution environment: ' + app.get('env'));
}
// initialize articles
Article.find(function(err, articles){
    if(articles.length) return;

    new Article({
        title: 'javascript高级程序设计',
        date: '2016-09-19 18:04',
        description: 'javascript高级程序设计——笔记基本概念 基本数据类型包括Undefined/Null/Boolean/Number和String 无须指定函数的返回值，实际上，未指定返回值的函数返回的是一个特殊的undefined值 变量、作用域和内存问题 基本类型值在内存中占据固定大小的空间，因此保存在栈内存中 引用类型的值是对象，保存在堆内存中 确定一个值是哪种基本类型用typeof，确定一个值是哪种...',
        href: 'https://github.com/junlintu/junlintu.github.io/blob/master/javascript.md',
        tags: ['javascript'],
        view: 670,
        available: true,
    }).save();

    new Article({
        title: 'Node.js笔记',
        date: '2016-09-19 16:26',
        description: 'Node.js模块和包管理Node.js框架使用模块和包来组织管理，参照CommonJS标准。 核心模块 最底层是Google V8 JavaScript引擎，之上是基于C/C++语言实现的核心模块、并提供向上的接口，在最上层用JavaScript语言对这些接口进行封装、再向外提供给用户使用这些核心模块。在Node.js框架安装好后，这些核心模块以编译好的二进制形式作为框架原生的组合部分存在，req...',
        href: 'https://github.com/junlintu/junlintu.github.io/blob/master/node.md',
        tags: ['node','javascript'],
        view: 670,
        available: true,
    }).save();

    
});
app.use(function(req, res, next){
	res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
	next();
});
app.get('/', function(req, res){
	// res.type('text/plain');
	// res.send('Technology Travel');
	Article.find({available:true}, function(err, articles){
		var context = {
			articles:articles.map(function(article){
				return {
					title:article.title,
					date:article.date,
					description:article.description,
					href:article.href,
					tags:article.tags,
					view:article.view,
				}
			})
		};
		res.render('home', context);
	});
	
});
app.get('/mdeditor', function(req, res){
	res.render('write', null);
});
app.post('/publish', function(req, res){
	Article.find(function(err, articles){
		console.log(req);
		var articleId = new Date().getTime();
	    new Article({
	    	articleId: articleId,
	        title: req.body.title,
	        date: common.dateFormat(new Date(),'yyyy-MM-dd hh:mm'),
	        description: req.body.mdeditor.substr(0,100),
	        href: req.headers['hose'] + '/' + articleId,
	        tags: [''],
	        view: 0,
	        available: true,
	        content: req.body.mdeditor,
	    }).save();

	});
	res.redirect(303, '/');
});
app.get('/article/*', function(req, res){
	Article.find({articleId:req.path.match(/\/(\d+)\/?$/)[1]}, function(err, articles){
		var context = {
					title:articles[0].title,
					date:articles[0].date,
					description:articles[0].description,
					href:articles[0].href,
					tags:articles[0].tags,
					view:articles[0].view,
					content:markdown.toHTML(articles[0].content),
			
		};
		console.log(context.content);
		res.render('article', context);
	});
});
app.get('/about', function(req, res){
	// res.type('text/plain');
	// res.send('About Technology Travel');
	res.render('about', {fortune: fortune.getFortune(),pageTestScript:'/qa/tests-about.js'});
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