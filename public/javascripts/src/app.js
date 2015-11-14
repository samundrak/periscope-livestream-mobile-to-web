var port = (!window.location.port) ? "" : ":" + window.location.port;
/*global io*/
var socket = io(window.location.hostname + port + '/stream');
var streamer = [];

socket.emit('start',{});
socket.on('newStream', function(data) {
    console.log(data);
    if (streamer.indexOf(data.url) === 0) return;
    $("#frames").html('');
    var frm = '<iframe   src="video?search=' + data.url + '" width="700px" height="530px"></iframe>';
    $("#frames").html(frm);
    streamer.push(data.url);
});


socket.on('new', function(data) {
    console.log(data);
})