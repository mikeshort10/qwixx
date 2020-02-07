require("dotenv").config();
const WS = require("ws");
const express = require("express");

const port = process.env.PORT || 4000;
const app = express();
const server = require("http").createServer(app);
const wss = new WS.Server({ server });

const send = (wss, others: any[]) => (incSelf: boolean) => {
  return (data: string) => {
    others.forEach((other, i) => {
      (incSelf || other !== wss) && other.send(data);
    });
  };
};

const newLocked = () => ({
  red: false,
  yellow: false,
  blue: false,
  green: false
});

const game = { locked: newLocked() };

const wsReducer = (wss: any, others: any[]) => {
  const communicate = send(wss, others);
  const communicateAll = communicate(true);
  const communicateOthers = communicate(false);
  return (data: string): void => {
    const { type, message } = JSON.parse(data);
    switch (type) {
      case "roll":
        return communicateOthers(data);
      case "closeRow":
        game.locked[message] = true;
        return communicateOthers(
          JSON.stringify({
            type,
            message: { locked: game.locked, color: message }
          })
        );
      case "leftGame":
        console.log("player has left the game");
        break;
      case "newGame":
        console.log("received request for new game");
        game.locked = newLocked();
        return communicateAll(
          (console.log(game.locked),
          JSON.stringify({ type: "newGame", message: game.locked }))
        );
      default:
        break;
    }
  };
};

wss.on("connection", ws => {
  console.log("connected");
  const messageReducer = wsReducer(ws, wss.clients);
  ws.on("message", messageReducer);
});

wss.on("close", () => {
  console.log("closed");
});

app.get("/", (req: Request, res: Response) => {
  console.log("NO! This is http. I am not a Krusty Krab.");
});

server.listen(port, "localhost", () => {
  console.log(`Listening on port ${port}`);
});
