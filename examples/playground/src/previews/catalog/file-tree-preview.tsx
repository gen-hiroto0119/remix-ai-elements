import { css, type Handle } from "remix/component";
import { FileTree } from "remix-ai-elements/file-tree";
import { files } from "../../shared/catalog-data.js";
import { catalogStyles } from "../../shared/catalog-preview.js";

export function FileTreePreview(handle: Handle) {
  let selectedFile = "components/ui/button.tsx";
  const update = () => {
    void handle.update();
  };

  return () => (
    <>
      <FileTree
        nodes={files}
        value={selectedFile}
        onSelect={(path) => {
          selectedFile = path;
          update();
        }}
      />
      <p
        role="status"
        mix={[catalogStyles.muted, css({ overflowWrap: "anywhere" })]}
      >
        Selected: {selectedFile}
      </p>
    </>
  );
}
