import { createController } from "remix/router";
import { assets } from "../assets.ts";
import { routes } from "../routes.ts";
import { Document } from "./document.tsx";
import { Playground } from "./public/playground.tsx";

export default createController(routes, {
  actions: {
    async assets(context) {
      return (
        (await assets.fetch(context.request)) ??
        new Response("Not Found", { status: 404 })
      );
    },
    home(context) {
      return context.render(
        <Document>
          <Playground localReference={process.env.NODE_ENV === "development"} />
        </Document>,
      );
    },
    health() {
      return new Response("ok", { headers: { "Cache-Control": "no-store" } });
    },
  },
});
