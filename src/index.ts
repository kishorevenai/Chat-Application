import { WebSocketServer, WebSocket } from "ws";
interface RecieveType {
  type: string;
  roomId: number;
  userId: number;
  message: string;
}

interface RoomContainerType {
  ws: WebSocket;
  userId: number;
}
const EntryType = "JOIN";
const MessageType = "MESSAGE";

const wss = new WebSocketServer({ port: 5000 });

const rooms: { [roomId: string]: RoomContainerType[] } = {};

wss.on("connection", (ws) => {
  ws.on("message", (message: string) => {
    const parsedMessage: RecieveType = JSON.parse(message);

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
      } else {
        rooms[roomId].push({
          ws,
          userId,
        });
      }
    }

    if (parsedMessage.type === MessageType) {
      rooms[roomId]?.map(({ ws }) => ws.send(JSON.stringify(messageContent)));
    }

    ws.on("close", () => {
      rooms[roomId] = rooms[roomId].filter(
        ({ userId }) => (userId as number) !== (userId as number)
      );

      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      }
    });
  });
});
