var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var path = require('path');
var templating = require('consolidate');
var request = require('request');
var urlutils = require('url');
var cheerio = require('cheerio');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var passport = require('passport');
var request = require('request');
var utils = require('./utils');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


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
//app.use(passport.authenticate('remember-me'));


var config = require('./config');
var pool = mysql.createPool(config);

var taskModel = require('./model')(pool);
var view = require('./view')
var controller = require('./controller')(taskModel, view, request);
var userController = require('./userController')(taskModel, nodemailer, smtpTransport);
//var del = require('./view');


var LocalStrategy = require('passport-local').Strategy;
	passport.use(new LocalStrategy(
		
		function(username, password, done){
			taskModel.checkUser(username, function(err, ansQuery){
				if (ansQuery.length != 0){
					if (password != ansQuery[0].pass)
						return done(null, false, {message: 'Неправильний пароль'});
					return done(null, {username: username});
				}
				return done(null, false, {message: 'Неправильний логін'});
			});
		}
	));

var RememberMeStrategy  = require('passport-remember-me').Strategy;
passport.use(new RememberMeStrategy(
  function(token, done) {
    consumeRememberMeToken(token, function(err, uid) {
      if (err) { return done(err); }
      if (!uid) { return done(null, false); }
      
      taskModel.findUserById(uid, function(err, user){
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user);
      });
    });
  },
  issueToken
));

function issueToken(user, done) {
  var token = utils.randomString(64);
  saveRememberMeToken(token, user.id, function(err) {
    if (err) { return done(err); }
    return done(null, token);
  });
}

passport.serializeUser(function(user, done){
	done(null, user.username);
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
	console.log('What');
	res.render('registration');
});

app.get('/', mustBeAuthenticated);
app.get('/', function(req, res){
	res.render('index');
});

app.post('/login', auth,  function(req, res, next) {
    // issue a remember me cookie if the option was checked
    if (!req.body.remember_me) { return next(); }

    var token = utils.generateToken(64);
    Token.save(token, { userId: req.user.id }, function(err) {
      if (err) { return done(err); }
      res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 }); // 7 days
      return next();
    });
  });

app.get('/logout', function(req, res){
	req.logout();
	//res.clearCookie('remember_me');
	res.redirect('/login');
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
app.post('/tasks/editAdd', controller.add);
app.put('/tasks/editAdd', controller.edit);
app.put('/tasks/donetask', controller.doneTask);
app.delete('/tasks/delete', controller.deleteList);


app.listen(8080);
console.log('Listening 8080...');

function consumeRememberMeToken(token, callback){
	taskModel.findUserByToken(token, callback);
}
function saveRememberMeToken(token, userId, callback){
	taskModel.setUserToken(token, userId, callback);
}