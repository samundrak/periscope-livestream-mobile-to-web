var Stream = require('user-stream');
var getUrl = require('get-urls');
var url = require('url');
var request = require('request');
var fs = require('fs');
var appRoot = require('app-root-path');
// var StreamModel = require('../model/Stream.js')();

module.exports = function stream(socket) {

    var fsdata = JSON.parse(fs.readFileSync(appRoot + '/data.json', 'utf8'));

    var stream = new Stream({
        consumer_key: fsdata.consumer_key || '4ID46TjrWrA7jEaNgpnymHn6u',
        consumer_secret: fsdata.consumer_secret || 'eECTQ9Iv7eNMeuLRGguyWIOfPBTWBO0bS2lJ20q4px1A0IeBVh',
        access_token_key: fsdata.access_token_key || '1322975444-6biTKZfNxzfnERxLdymtDOmT6InsoYgRRgAUj1v',
        access_token_secret: fsdata.access_token_secret || 'SJd0ISk06YFWU3dJYu6IUkmXjLYeLUA1Vh974CVKnFsaZ'
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

        //stream JSON data
        stream.on('data', function(data) {
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
                        client.broadcast.emit('newStream', {
                            url: streamUrl
                        });
                        fs.writeFile(appRoot + '/url.json', '{"url":"' + streamUrl + '","token":"' + token + '"}');
                        console.log(streamUrl);
                    });
                    // Show the HTML for the Google homepage. 
                    // require('fs').writeFile('file.json',JSON.stringify(response),console.log);
                    // console.log(body) // Show the HTML for the Google homepage. 
                }
            });
        });
        client.on('start', function(data) {
            fs.exists(appRoot + '/url.json', function(err) {
                if (!err) return;

                try {

                    var url = JSON.parse(fs.readFileSync(appRoot + '/url.json', 'utf8'));
                } catch (err) {
                    return;
                }


                if (!url.hasOwnProperty('token')) return;
                try {
                    var token = url.token;
                    var apiurl = 'https://api.periscope.tv/api/v2/getAccessPublic?token=' + token;

                    request(apiurl, function(error, response, body) {
                        if (error) return;

                        var data = response.request.uri;
                        var body = JSON.parse(body);
                        if (body.hasOwnProperty('hls_url')) {
                            console.log(body.hls_url);
                            // client.emit('new',{});
                            client.emit('newStream', {
                                url: body.hls_url
                            });


                        } else {
                            console.log('is dead');
                            client.emit('newStream', {
                                url: body.hls_url
                            });
                        }
                    });
                } catch (err) {
                    console.warn('errrrrrr');
                }
            })

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