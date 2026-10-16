import * as http from "node:http";
import { createRequestListener } from "remix/node-fetch-server";
import { router } from "./app/router.ts";

const port = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

const server = http.createServer(createRequestListener(router.fetch));
server.listen(port, "0.0.0.0", () => {
  console.log(`Playground listening on port ${port}`);
});

let shuttingDown = false;
function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  server.close(() => process.exit(0));
  setTimeout(() => server.closeAllConnections(), 5000).unref();
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
