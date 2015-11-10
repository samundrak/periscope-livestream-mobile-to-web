var getUrl = require('get-urls');
var url = require('url');
var socket = require('socket.io');
var request = require('request');

// function Twitter(socket,stream) {
//     socket.of('/stream').on('connection', function(client) {
//         // client.on('start', function() {
//         	console.log('start')
//             stream.on('data', function(data) {
//                 if (error) return;
//                 console.log(data);
//                 // client.broadcast.emit('newStream', data);
//                 if (data.source != '<a href="https://periscope.tv" rel="nofollow">Periscope</a>') return;


//                 var urls = getUrl(data.text);
//                 var uri = undefined;
//                 urls.forEach(function(post, index) {
//                     if (url.parse(post).hostname === 't.co') {
//                         uri = post;
//                         return;
//                     }
//                 });

//                 request(uri, function(error, response, body) {
//                     if (!error && response.statusCode == 200) {
//                         var data = response.request.uri;
//                         var host = data.host;
//                         var path = data.path;
//                         var token = path.split('/');
//                         token = token[token.length - 1];
//                         if (host != 'www.periscope.tv') return;
//                         var apiurl = 'https://api.periscope.tv/api/v2/getAccessPublic?token=';
//                         apiurl += token;
//                         console.log(apiurl);

//                         request(apiurl, function(error, response, body) {
//                             if (error && response.statusCode != 200) return;
//                             body = JSON.parse(body);
//                             var streamUrl = body.hasOwnProperty('hls_url') ? body.hls_url : body.replay_url;
//                             client.broadcast.emit('newStream', {
//                                 url: streamUrl
//                             });
//                             console.log(streamUrl);
//                         });
//                         // Show the HTML for the Google homepage. 
//                         // require('fs').writeFile('file.json',JSON.stringify(response),console.log);
//                         // console.log(body) // Show the HTML for the Google homepage. 
//                     }
//                 });

//             });
//         // })
//     });
//     // });
//     // return next();
// }

// module.exports = Twitter;