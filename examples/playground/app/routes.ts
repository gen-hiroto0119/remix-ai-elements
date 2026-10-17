import { get, post, route } from "remix/routes";

export const routes = route({
  assets: get("/assets/*path"),
  home: get("/"),
  health: get("/health"),
  chat: post("/api/chat"),
});
