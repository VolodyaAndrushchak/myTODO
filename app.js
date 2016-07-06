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



app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/static', express.static('public'));
app.engine('hbs', templating.handlebars);
app.set('view engine', 'hbs');
app.set('views', __dirname);

/*app.use(session({keys : ['secret']}));
app.use(passport.initialize());
app.use(passport.session());*/

var config = require('./config');
var pool = mysql.createPool(config);

var taskModel = require('./model')(pool);
var view = require('./view')
var controller = require('./controller')(taskModel, view);
//var del = require('./view');

app.get('/', function(req, res){
	res.render('index');
});

app.get('/editAdd', controller.editAdd);
app.get('/mainList', controller.mainList);
app.get('/delete', controller.deleteList);

app.listen(8080);
console.log('Listening 8080...');

