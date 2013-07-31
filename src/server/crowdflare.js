/*
 * crowdflare
 * https://github.com/codemariner/crowdflare
 *
 * Copyright (c) 2013 Scott Sayles
 * Licensed under the MIT license.
 */

'use strict';

var express = require("express");
var app = express();
var clients = {};
 
var wave = require(__dirname + '/../../patterns/wave.json');

var patterns = {
    wave: wave
};



app.configure(function() {
    console.log(process.env.PORT);
    app.set('port', process.env.PORT || 3000);
    app.use(express.static(__dirname + '/../../public'));
});

app.get("/", function(req, res){
        res.send("It works!");
});
 
app.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});


var io = require('socket.io').listen(3001);
io.sockets.on('connection', function (socket) {
    socket.emit('connect', { connected: true });
    socket.on('register', function (data) {
        console.log(data);
        clients[data.position] = socket;

        var message = {};
        message.registered = true;
        message.message = "Registered at position " + data.position;

        io.sockets.emit('registered', message);
    });
    socket.on('load', function (data) {
        var pattern = patterns[data.pattern];
        for (var x=0;x<pattern.length;x++) {
            var row = pattern[x];
            for (var y=0;y<row.length;y++) {
                var clientIdx = x + "" + y + "";
                // need to figure out which socket we have
                socket.emit('load', {pattern: data.pattern, data: row[y]});
            }
        }
    });
});




