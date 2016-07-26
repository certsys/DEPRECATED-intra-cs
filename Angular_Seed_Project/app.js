var express = require('express');
var mongoose = require('mongoose');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var controldesk = require('./routes/controldesk');
var inbox = require('./routes/inbox');
var login = require('./routes/login');
var kb = require('./routes/kb');

// Rotas relacionadas ao Mongo DB
var posts = require('./routes/posts'); // Posts do Newsfeed
var contacts = require('./routes/contacts'); // Contatos dos Funcionários

//conecta com o Mongo
mongoose.connect('mongodb://localhost/intra-cs');

var app = express();

//AD setup
// var ActiveDirectory = require('activedirectory');
// var config = { url: 'ldap://dc.certsys.com.br',
//                baseDN: 'dc=Certsys,dc=local',
//                username: 'username@certsys.com.br',
//                password: 'password' }
// var ad = new ActiveDirectory(config);


// view engine setup
app.set('views', path.join(__dirname));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

// Tamanho do arquivo que pode ser enviado pelas rotas
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({limit: '500mb'}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname)));

app.use('/', routes);//try
app.use('/controldesk', controldesk);
app.use('/mailbox/inbox', inbox);
// app.use('/mailbox/login', login);
app.use('/login', login);
app.use('/kb', kb);

// Rotas para busca e inserção no Mongo DB
app.use('/posts', posts);
app.use('/contacts', contacts);


// catch 404 and forward to error handler!
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



module.exports = app;
