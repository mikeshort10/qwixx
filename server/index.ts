require("dotenv").config();
const WS = require("ws");
const express = require("express");

const port = process.env.PORT || 4000;
const app = express();
const server = require("http").createServer(app);
const wss = new WS.Server({ port });

const sendOthers = (wss, others: any[]) => {
  return (data: string) => {
    others.forEach((other, i) => {
      other !== wss && wss.send(data);
    });
  };
};

const locked = { red: false, yellow: false, blue: false, green: false };

const wsReducer = (wss: any, others: any[]) => {
  const communicate = sendOthers(wss, others);
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
  const messageReducer = wsReducer(ws, wss.clients);
  ws.on("message", messageReducer);
});

wss.on("close", () => {
  console.log("closed");
});

app.get("/", (req: Request, res: Response) => {
  console.log("NO! This is http. I am not a Krusty Krab.");
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Listening on port ${port}`);
});
