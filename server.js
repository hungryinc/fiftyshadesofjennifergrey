'use strict';

var argv = require('yargs').argv;
var express = require('express');
var app = express();

app.set('views', __dirname + '/app/release/');
app.engine('html', require('ejs').renderFile);
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.static(__dirname + '/app/release/'));
app.use(app.router);

if (argv.development) {
    var gulp = require('child_process').spawn('gulp', [], {stdio:'inherit'});

    process.on('SIGINT', function() {
        gulp.kill('SIGINT');
        process.kill('SIGINT')
    });

    app.use(require('connect-livereload')({
        port: 35729
    }));
}

/**
 * Index Route
 */
app.get('*', function(req, res) {
    res.render('html/views/index.html');
});

//you may also need an error handler too (below), to serve a 404 perhaps?
app.use(function(err, req, res, next) {
    if ( ! err) {
        return next();
    }

    console.log('error: ' + err.stack);
    res.send('error!!!');
});

/**
 * Start server
 */
app.listen(80, function() {
    console.log('Server started on port %d', 80);
});