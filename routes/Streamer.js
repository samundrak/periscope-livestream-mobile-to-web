var Stream = require('user-stream');
var getUrl = require('get-urls');
var url = require('url');
var request = require('request');
var fs = require('fs');
var appRoot = require('app-root-path');
var StreamModel = require('../model/Stream.js')();

module.exports = function stream(socket) {

    var fsdata = JSON.parse(fs.readFileSync(appRoot + '/data.json', 'utf8'));

    var stream = new Stream({
        consumer_key: /*fsdata.consumer_key ||*/ '4ID46TjrWrA7jEaNgpnymHn6u',
        consumer_secret: /*fsdata.consumer_secret ||*/ 'eECTQ9Iv7eNMeuLRGguyWIOfPBTWBO0bS2lJ20q4px1A0IeBVh',
        access_token_key: /*fsdata.access_token_key ||*/ '1322975444-6biTKZfNxzfnERxLdymtDOmT6InsoYgRRgAUj1v',
        access_token_secret: /*fsdata.access_token_secret ||*/ 'SJd0ISk06YFWU3dJYu6IUkmXjLYeLUA1Vh974CVKnFsaZ'
    });

    // * - data
    // * - garbage
    // * - close
    // * - error
    // * - connected
    // * - heartbeat

    //create stream
    stream.stream();
    socket.of('/stream').on('connection', function(client) {

        client.on('start', function(data) {
            console.log(data);
            StreamModel.find(function(err, result) {
                if (err) return;

                try {
                    var token = result[0].token;
                    var apiurl = 'https://api.periscope.tv/api/v2/getAccessPublic?token=' + token;

                    request(apiurl, function(error, response, body) {
                        if (error) return;

                        var data = response.request.uri;
                        if (body.hasOwnProperty('hls_url')) {
                            client.broadcast.emit('new', {
                                stream: true,
                                url: body.hls_url
                            });

                        } else {
                            client.broadcast.emit('new', {
                                stream: false,
                            });
                        }
                    });
                } catch (err) {
                    console.warn('errrrrrr');
                }
            }).limit(1).sort({
                id: -1
            });
        });

        //stream JSON data
        stream.on('data', function(data) {
            console.log(data);
            if (data.source != '<a href="https://periscope.tv" rel="nofollow">Periscope</a>') return;
            var urls = getUrl(data.text);
            var uri = undefined;
            urls.forEach(function(post, index) {
                if (url.parse(post).hostname === 't.co') {
                    uri = post;
                    return;
                }
            });

            request(uri, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var data = response.request.uri;
                    var host = data.host;
                    var path = data.path;
                    var token = path.split('/');
                    token = token[token.length - 1];
                    if (host != 'www.periscope.tv') return;
                    var apiurl = 'https://api.periscope.tv/api/v2/getAccessPublic?token=';
                    apiurl += token;
                    console.log(apiurl);

                    request(apiurl, function(error, response, body) {
                        if (error && response.statusCode != 200) return;
                        body = JSON.parse(body);
                        console.log(body);
                        var streamUrl = body.hasOwnProperty('hls_url') ? body.hls_url : body.replay_url;
                        StreamModel.find(function(err, result) {
                            if (err) {
                                console.log(err);
                                return;
                            }

                            if (!result) {
                                new StreamModel({
                                    url: streamUrl,
                                    token: token
                                }).save(console.log);
                            } else {
                                StreamModel.update({}, {
                                    url: streamUrl,
                                    token: token
                                }, function(err, result) {
                                    if (err) {
                                        console.log(err);
                                        return;
                                    }
                                });

                            }
                        });
                        client.broadcast.emit('newStream', {
                            url: streamUrl
                        });
                        console.log(streamUrl);
                    });
                    // Show the HTML for the Google homepage. 
                    // require('fs').writeFile('file.json',JSON.stringify(response),console.log);
                    // console.log(body) // Show the HTML for the Google homepage. 
                }
            });
        });

        //incorrect json strings (can't parse to json)
        stream.on('garbage', function(data) {
            // console.log('Can\'t be formatted:');
            //  console.log(data);
        });

        //heartbeats
        stream.on('heartbeat', function() {
            // console.log('Heartbeat');
        });

        //connected
        stream.on('connected', function() {
            // console.log('Stream created');
        });

        //connection errors (request || response)
        stream.on('error', function(error) {
            // console.log('Connection error:');
            // console.log(error);
        });

        //stream close event
        stream.on('close', function(error) {
            // console.log('Stream closed');
            // console.log(error);
        });
    });
}