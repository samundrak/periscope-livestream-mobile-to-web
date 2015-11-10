var port = (!window.location.port) ? "" : ":" + window.location.port;
var socket = io(window.location.hostname + port + '/stream');
var streamer = [];

// $(document).ready(function() {
    socket.emit('start', {});
// });
socket.on('newStream', function(data) {
    if (streamer.indexOf(data.url) === 0) return;

console.log(data);
    var frm = '<iframe style="border:0px" src="video?search=' + data.url + '" width="700px" height="530px"></iframe>';
    $("#frames").append(frm);
    streamer.push(data.url);
});


socket.on('new', function(data) {
    console.log(data);
})