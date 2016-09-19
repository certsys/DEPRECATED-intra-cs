// Módulos
//==========================================================================================================
var express = require('express');
var mongoose = require('mongoose');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');

// Settings do sistema
//==========================================================================================================

// Conecta com o Mongo
mongoose.connect('mongodb://localhost/intra-cs');

// Inicializa express
var app = express();
    
// view engine setup
app.set('views', path.join(__dirname));
app.set('view engine', 'ejs');

// Favicon da intranet
app.use(favicon('./img/favicon.ico'));

// Logger
app.use(logger('dev'));

// Tamanho do arquivo que pode ser enviado pelas rotas
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({limit: '500mb'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname)));


// Roteamento
//==========================================================================================================


// Início
app.use('/', routes.api.home);

// Authentication
app.use('/login', routes.api.authentication.login);

// Intranet
app.use('/controldesk', routes.api.intranet.controldesk);
app.use('/mailbox/inbox', routes.api.intranet.inbox);
app.use('/kb', routes.api.intranet.kb);
app.use('/posts', routes.api.intranet.posts);
app.use('/contacts', routes.api.intranet.contacts);
app.use('/institucional', routes.api.intranet.institucional);
app.use('/cursos', routes.api.intranet.cursos);

// Maintenance
app.use('/users', routes.api.maintenance.users);
app.use('/groups', routes.api.maintenance.groups);


// Acessa a rota para reprogramar todos os emails agendados, no caso de ter ocorrido alguma falha
//==========================================================================================================
var reschuduleMails = {
    host: 'localhost',
    port: '3000',
    path: '/posts/reschedule'
};
http.get(reschuduleMails);

// 404 Handler
//==========================================================================================================
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handlers
//==========================================================================================================

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