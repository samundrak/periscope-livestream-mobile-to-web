var port = (!window.location.port) ? "" : ":" + window.location.port;
/*global io*/
var socket = io(window.location.hostname + port + '/stream');
var streamer = [];

// $(document).ready(function() {
    socket.emit('start', {});
// });
socket.on('newStream', function(data) {
    if (streamer.indexOf(data.url) === 0) return;

console.log(data);
    $("#frames").html('');
    var frm = '<iframe   src="video?search=' + data.url + '" width="700px" height="530px"></iframe>';
    $("#frames").append(frm);
    streamer.push(data.url);
});


socket.on('new', function(data) {
    console.log(data);
})