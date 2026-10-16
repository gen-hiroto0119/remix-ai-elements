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
