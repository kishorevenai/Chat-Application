"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const EntryType = "JOIN";
const MessageType = "MESSAGE";
const wss = new ws_1.WebSocketServer({ port: 5000 });
const rooms = {};
wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        var _a;
        const parsedMessage = JSON.parse(message);
        const roomId = parsedMessage.roomId;
        const userId = parsedMessage.userId;
        const messageContent = parsedMessage.message;
        if (parsedMessage.type === EntryType) {
            if (!rooms[roomId]) {
                rooms[roomId] = [
                    {
                        ws,
                        userId,
                    },
                ];
                console.log("ROOM CREATED");
            }
            else {
                rooms[roomId].push({
                    ws,
                    userId,
                });
            }
        }
        if (parsedMessage.type === MessageType) {
            (_a = rooms[roomId]) === null || _a === void 0 ? void 0 : _a.map(({ ws }) => ws.send(JSON.stringify(messageContent)));
        }
        ws.on("close", () => {
            rooms[roomId] = rooms[roomId].filter(({ userId }) => userId !== userId);
            if (rooms[roomId].length === 0) {
                delete rooms[roomId];
            }
        });
    });
});
