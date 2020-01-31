"use strict";
require("dotenv").config();
var WS = require("ws");
var express = require("express");
var port = process.env.PORT || 4000;
var app = express();
var server = require("http").createServer(app);
var wss = new WS.Server({ server: server });
var sendOthers = function (wss, others) {
    return function (data) {
        others.forEach(function (other, i) {
            other !== wss && other.send(data);
        });
    };
};
var newLocked = function () { return ({
    red: false,
    yellow: false,
    blue: false,
    green: false
}); };
var game = { locked: newLocked() };
var wsReducer = function (wss, others) {
    var communicate = sendOthers(wss, others);
    return function (data) {
        var _a = JSON.parse(data), type = _a.type, message = _a.message;
        switch (type) {
            case "roll":
                return communicate(data);
            case "closeRow":
                game.locked[message] = true;
                return communicate(JSON.stringify({
                    type: type,
                    message: { locked: game.locked, color: message }
                }));
            case "leftGame":
                console.log("player has left the game");
                break;
            case "newGame":
                game.locked = newLocked();
                return communicate(JSON.stringify({ type: "newGame", message: game.locked }));
            default:
                break;
        }
    };
};
wss.on("connection", function (ws) {
    console.log("connected");
    var messageReducer = wsReducer(ws, wss.clients);
    ws.on("message", messageReducer);
});
wss.on("close", function () {
    console.log("closed");
});
app.get("/", function (req, res) {
    console.log("NO! This is http. I am not a Krusty Krab.");
});
server.listen(port, "localhost", function () {
    console.log("Listening on port " + port);
});