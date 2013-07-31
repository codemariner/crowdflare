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
var grid = [];
 
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
        var row = grid[data.x] 
        if (typeof row === 'undefined') {
            row = grid[data.x] = [];
        }
        var column = row[data.y];
        if (typeof column === 'undefined') {
            column = row[data.y] = [];
        }
        column[data.y] = socket;

        socket.emit('registered', {message: 'registered: ' + data.x + ',' + data.y});
    });
});




