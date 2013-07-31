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
var grid = {x: [], y: []};
 

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
        var row = grid.x[data.x];
        if (typeof row === 'undefined') {
            row = [];
            grid.x[data.x] = row;
        }
        row[data.y] = socket.id;

        var column = grid.y[data.y];
        if (typeof column === 'undefined') {
            column = [];
            grid.y[data.y] = column;
        }
        column[data.x] = socket.id;
        socket.emit('registered', {message: 'registered: ' + data.x + ',' + data.y});
    });
    socket.on('start', function (data) {
        io.sockets.emit("start");
    });
    socket.on('stop', function (data) {
        io.sockets.emit("stop");
    });
    socket.on('loadPattern', function (data) {
        var pattern = data.pattern;
        if (pattern === 'wave') {
            for (var x=0;x<grid.x.length;x++) {
                var column = grid.x[x];
                var width = grid.x.length;
                var timeline = [];
                for (var i=0;i<width;i++) {
                    if (i === x) {
                        timeline.push(1);
                    } else {
                        timeline.push(0);
                    }
                }
                for (var n=0;n<column.length;n++) {
                    var client = io.sockets.socket(column[n]);
                    client.emit('load', {timeline: timeline, pattern: pattern});
                }
            }
        }
    });
});

