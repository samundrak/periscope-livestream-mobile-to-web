var Stream = require('user-stream');
var getUrl = require('get-urls');
var url = require('url');
var request = require('request');

module.exports = function stream(socket) {

    var stream = new Stream({
        consumer_key: '',
        consumer_secret: '',
        access_token_key: '',
        access_token_secret: ''
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
        console.log('oe')
        client.on('start', console.log);
        //stream JSON data
        stream.on('data', function(data) {
            console.log('Data:');
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
            console.log('Heartbeat');
        });

        //connected
        stream.on('connected', function() {
            console.log('Stream created');
        });

        //connection errors (request || response)
        stream.on('error', function(error) {
            console.log('Connection error:');
            console.log(error);
        });

        //stream close event
        stream.on('close', function(error) {
            console.log('Stream closed');
            console.log(error);
        });
    });
}