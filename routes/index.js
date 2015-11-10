var express = require('express');
var router = express.Router();
var appRoot = require('app-root-path');
// var test =  require('./test');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});
router.get('/video', function(req, res, next) {
    res.sendFile(appRoot+'/views/video.html')
});
router.get('/demo', function(req, res, next) {
    res.sendFile(appRoot+'/views/index.html')
});

// router.get('/twitter', test.feeds);
module.exports = router;