var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Stream = require('user-stream');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var socket = require('socket.io');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// production error handler
// no stacktraces leaked to user

// function ServerLog(data) {
// }
var listener = app.listen(process.env.PORT);
socket = new socket(listener);
var streamer = require('./routes/Streamer');
streamer(socket);
// var twitter = require('./routes/twitter');
// console.log('/')
// app.use(function(req,res,next){
// var stream = new Stream({
//     consumer_key: '4ID46TjrWrA7jEaNgpnymHn6u', //mine
//     consumer_secret: 'eECTQ9Iv7eNMeuLRGguyWIOfPBTWBO0bS2lJ20q4px1A0IeBVh',
//     access_token_key: '1322975444-6biTKZfNxzfnERxLdymtDOmT6InsoYgRRgAUj1v',
//     access_token_secret: 'SJd0ISk06YFWU3dJYu6IUkmXjLYeLUA1Vh974CVKnFsaZ'

// });

// var params = {};
// create stream
// stream.stream();
// twitter(socket, stream);
// });
app.use('/', routes);
app.use('/users', users);
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
// app.listen(3000);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
module.exports = app;