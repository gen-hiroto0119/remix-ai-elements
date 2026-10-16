import { Context } from "remix-ai-elements/context";
import { catalogStyles } from "../../shared/catalog-preview.js";

export function ContextPreview() {
  return () => (
    <>
      <p mix={catalogStyles.muted}>
        Hover, click, or focus and press Enter to inspect usage.
      </p>
      <div>
        <Context input={8420} output={1260} reasoning={980} limit={128000} />
      </div>
      <div>
        <Context input={119000} output={7000} reasoning={1000} limit={128000} />
      </div>
      <div>
        <Context input={0} output={0} limit={0} />
      </div>
    </>
  );
}
