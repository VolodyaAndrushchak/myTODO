var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var path = require('path');
var templating = require('consolidate');
var request = require('request');
var urlutils = require('url');
var cheerio = require('cheerio');
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var passport = require('passport');
var request = require('request');
var utils = require('./utils');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var md5 = require('md5');

var session = require('cookie-session');
app.use(session({keys : ['secret']}));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/static', express.static('public'));
app.engine('hbs', templating.handlebars);
app.set('view engine', 'hbs');
app.set('views', __dirname);

app.use(session({keys : ['secret']}));
app.use(passport.initialize());
app.use(passport.session());

var config = require('./config');
var pool = mysql.createPool(config);
/*var pool = mysql.createPool({
	connectionLimit : 10,
	host: '127.0.0.1',
	database: "mybase",
	user: 'root',
	password: '',
	port: '3306'
	//socketPath: '/var/run/mysqld/mysqld.sock'
});*/

var taskModel = require('./model')(pool);
var view = require('./view')
var controller = require('./controller')(taskModel, view, request, cheerio);
var userController = require('./userController')(taskModel, nodemailer, smtpTransport, md5);

var LocalStrategy = require('passport-local').Strategy;
	passport.use(new LocalStrategy(
		
		function(username, password, done){
			taskModel.checkUser(username, function(err, ansQuery){
				console.log(ansQuery);
				if (ansQuery.length != 0){
					if (password != ansQuery[0].pass)
						return done(null, false, {message: 'Неправильний пароль'});
					return done(null, ansQuery[0])
				}
				return done(null, false, {message: 'Неправильний логін'});
			});
		}
	));

passport.serializeUser(function(user, done){
	done(null, user.hesh);
});

passport.deserializeUser(function(id, done){
	done(null, {username: id});
});	

var auth = passport.authenticate(
	'local', {
			successRedirect: '/',
			failureRedirect: '/login'			
	} );

var mustBeAuthenticated = function(req, res, next){
	req.isAuthenticated() ? next() : res.redirect('/login');
}

app.get('/login', function(req, res){
	res.render('registration');
});

app.get('/', mustBeAuthenticated);
app.get('/', function(req, res){
	//console.log(req.session.passport.user );
	//var cookies = cookie.parse(req.headers.cookie || '');
	res.render('index');
});

app.post('/login', auth);

app.get('/logout', function(req, res){
	req.logout();
	res.render('registration');
	//res.clearCookie('remember_me');
});
app.get('/joinTeam', function(req, res){
	res.render('joinTeam');
});

app.get('/header/*', mustBeAuthenticated);
app.get('/tasks/*', mustBeAuthenticated);


app.post('/registration', userController.createAccount);
app.post('/getPassword', userController.getPassword);
app.get('/header/wheather', controller.wheather);
app.get('/header/efficiency', controller.efficiency);
app.get('/tasks/mainList', controller.mainList);
app.get('/numberUsers', userController.getNumberUsers);
app.get('/getNewsStudway', controller.getNews);
app.get('/getNewsNULP', controller.getNews);
app.get('/getNewsTerytorija', controller.getNews);
app.get('/getNewsZaxid', controller.getNews);
app.post('/tasks/editAdd', controller.add);
app.put('/tasks/editAdd', controller.edit);
app.put('/tasks/donetask', controller.doneTask);
app.delete('/tasks/delete', controller.deleteList);


app.listen(8080);
console.log('Listening 8080...');
