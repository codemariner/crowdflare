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
var offset = 0;
var goingToStart = false;
 
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
        console.log("Setting " + socket.id + " to " + offset);

        var message = {
            registered: true,
            offset: offset
        };
        offset = (offset + 1) % 10;

        socket.emit('registered', message);

        if (!goingToStart) {
            goingToStart = true;
            setTimeout(function() {
                io.sockets.emit('start');
            }, 5000)
        }
    });
});
