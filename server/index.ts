require("dotenv").config();
const WS = require("ws");
const express = require("express");

const port = process.env.PORT || 4000;
const app = express();
const server = require("http").createServer(app);
const wss = new WS.Server({ server });

const sendOthers = (ws, id: number, others: any[]) => {
  return (data: string) => {
    others.forEach((ws, i) => {
      if (i !== id) {
        ws.send(data);
      }
    });
  };
};

const locked = { red: false, yellow: false, blue: false, green: false };
const sockets: any[] = [];

const wsReducer = (ws: any, id: number, others: any[]) => {
  const communicate = sendOthers(ws, id, others);
  return (data: string) => {
    const { type, message } = JSON.parse(data);
    switch (type) {
      case "roll":
        return communicate(data);
      case "closeRow":
        locked[message] = true;
        return communicate(JSON.stringify({ type, message: locked }));
      case "leftGame":
        console.log("player as left the game");
        break;
      default:
        break;
    }
  };
};

wss.on("connection", ws => {
  const id = sockets.length;
  sockets.push(ws);
  const messageReducer = wsReducer(ws, id, sockets);
  ws.on("message", messageReducer);
});

wss.on("close", () => {
  console.log("closed");
});

app.get("/", (req: Request, res: Response) => {
  console.log("NO! This is http. I am not a Krusty Krab.");
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
