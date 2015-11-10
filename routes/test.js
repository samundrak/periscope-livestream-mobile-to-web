var Twitter = require('twitter-node-client').Twitter;
// var Stream = require('user-stream');

module.exports = test = {

    feeds: function(req, res, next) {
        var error = function(err, response, body) {
            console.log('ERROR [%s]', err);
        };
        var success = function(data) {
            console.log(data);
        };
        var config = {
            "consumerKey": "4ID46TjrWrA7jEaNgpnymHn6u",
            "consumerSecret": "eECTQ9Iv7eNMeuLRGguyWIOfPBTWBO0bS2lJ20q4px1A0IeBVh",
            "accessToken": "1322975444-6biTKZfNxzfnERxLdymtDOmT6InsoYgRRgAUj1v",
            "accessTokenSecret": "SJd0ISk06YFWU3dJYu6IUkmXjLYeLUA1Vh974CVKnFsaZ",
            "callBackUrl": "http://localhost.com"
        }
        var twitter = new Twitter(config);
        twitter.getHomeTimeline({ count: '1'}, error, success);
          // twitter.getTweet({ id: 'samundrak'}, error, success);
        res.sendStatus(200);
    }
}