"use strict";
require("dotenv").config();
var WS = require("ws");
var express = require("express");
var port = process.env.PORT || 4000;
var app = express();
var server = require("http").createServer(app);
var wss = new WS.Server({ server: server });
var sendOthers = function (ws, id, others) {
    return function (data) {
        others.forEach(function (ws, i) {
            if (i !== id) {
                ws.send(data);
            }
        });
    };
};
var locked = { red: false, yellow: false, blue: false, green: false };
var sockets = [];
var wsReducer = function (ws, id, others) {
    var communicate = sendOthers(ws, id, others);
    return function (data) {
        var _a = JSON.parse(data), type = _a.type, message = _a.message;
        switch (type) {
            case "roll":
                return communicate(data);
            case "closeRow":
                locked[message] = true;
                return communicate(JSON.stringify({ type: type, message: locked }));
            case "leftGame":
                console.log("player as left the game");
                break;
            default:
                break;
        }
    };
};
wss.on("connection", function (ws) {
    var id = sockets.length;
    sockets.push(ws);
    var messageReducer = wsReducer(ws, id, sockets);
    ws.on("message", messageReducer);
});
wss.on("close", function () {
    console.log("closed");
});
app.get("/", function (req, res) {
    console.log("NO! This is http. I am not a Krusty Krab.");
});
server.listen(port, function () {
    console.log("Listening on port " + port);
});