import { css, type Handle, type RemixNode } from "remix/component";
import { ImportMap } from "remix/component/server";
import { scriptEntry } from "../assets.ts";

export function Document(handle: Handle<{ children?: RemixNode }>) {
  return () => (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Remix AI Elements</title>
        <link
          rel="icon"
          type="image/svg+xml"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%2318181b'/%3E%3Cpath d='M9 24V8h8a5 5 0 0 1 1 10l5 6h-5l-5-6v6zm4-10h4a1 1 0 0 0 0-2h-4z' fill='white'/%3E%3C/svg%3E"
        />
        <ImportMap value={scriptEntry.importMap} />
        {scriptEntry.preloads.map((href) => (
          <link key={href} rel="modulepreload" href={href} />
        ))}
        <script type="module" src={scriptEntry.href}></script>
      </head>
      <body mix={css({ margin: 0, background: "#fff" })}>
        {handle.props.children}
      </body>
    </html>
  );
}
