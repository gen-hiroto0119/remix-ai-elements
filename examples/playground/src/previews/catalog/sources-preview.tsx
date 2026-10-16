import { Sources } from "remix-ai-elements/sources";
import { sources } from "../../shared/catalog-data.js";

export function SourcesPreview() {
  return () => (
    <>
      <Sources sources={sources} defaultOpen />
      <Sources sources={[]} title="No sources attached" />
    </>
  );
}
