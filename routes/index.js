var express = require('express');
var router = express.Router();
var appRoot = require('app-root-path');
var fs = require('fs');
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

router.get('/save',function(req,res,next){
   res.sendFile(appRoot+'/views/form.html'); 
});
router.post('/save' ,function(req,res,next){
    
    if(req.body){
        if(!req.body.consumer_key) return;
        if(!req.body.consumer_secret) return;
        if(!req.body.access_token_key) return;
        if(!req.body.access_token_secret) return;
        
        fs.writeFile(appRoot + '/data.json',JSON.stringify(req.body),function(error,result){
            if(error) return res.sendStatus(502);
            
            res.send('WelDone');
        });
    }
});
// router.get('/twitter', test.feeds);
module.exports = router;