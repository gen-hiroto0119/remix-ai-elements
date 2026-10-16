import { InlineCitation } from "remix-ai-elements/inline-citation";
import { sources } from "../../shared/catalog-data.tsx";
import { catalogStyles } from "../../shared/catalog-preview.tsx";

export function InlineCitationPreview() {
  return () => (
    <>
      <p>
        Remix builds UI from components and native browser events.{" "}
        <InlineCitation source={sources[0]!} />
      </p>
      <p>
        The AI transport can deliver incremental events over HTTP.{" "}
        <InlineCitation source={sources[1]!} />
      </p>
      <p mix={catalogStyles.muted}>
        Source cards are available on hover, click, and keyboard. Links open in
        a new tab.
      </p>
    </>
  );
}
