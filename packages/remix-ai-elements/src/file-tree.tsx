import { css, type Handle, on } from "remix/component";
import { Icon } from "./internal/icon.js";
import { focusRing } from "./internal/parts.js";
import { tokens as t } from "./theme.js";
export type FileNode =
  | { type: "file"; name: string; path: string }
  | {
      type: "folder";
      name: string;
      path: string;
      children: readonly FileNode[];
      defaultOpen?: boolean;
    };
export interface FileTreeProps {
  nodes: readonly FileNode[];
  value?: string;
  defaultValue?: string;
  onSelect?: (path: string) => void;
  label?: string;
}
const row = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: "8px",
  width: "100%",
  minWidth: 0,
  padding: "6px 8px",
  border: 0,
  background: "transparent",
  color: t.foreground,
  font: "inherit",
  fontSize: "13px",
  overflowWrap: "anywhere",
  textAlign: "left",
  borderRadius: "6px",
  cursor: "pointer",
  listStyle: "none",
  "&::-webkit-details-marker": { display: "none" },
  "&:hover": { background: t.muted },
  '&[aria-current="true"]': { background: t.muted },
});
function FileTreeNode(
  handle: Handle<{
    node: FileNode;
    selected?: string;
    select: (path: string) => void;
  }>,
) {
  let expanded =
    handle.props.node.type === "folder"
      ? (handle.props.node.defaultOpen ?? true)
      : false;
  return () => {
    const { node, selected, select } = handle.props;
    return (
      <li mix={css({ listStyle: "none", minWidth: 0 })}>
        {node.type === "folder" ? (
          <details
            open={expanded}
            mix={[
              css({
                "&[open] > summary > [data-chevron]": {
                  transform: "rotate(90deg)",
                },
              }),
              on("toggle", (event) => {
                expanded = event.currentTarget.open;
              }),
            ]}
          >
            <summary mix={[row, focusRing]}>
              <span data-chevron mix={css({ display: "flex", flexShrink: 0 })}>
                <Icon name="chevron" size={12} />
              </span>
              <Icon name="folder" />
              <span>{node.name}</span>
            </summary>
            <ul mix={css({ margin: "0 0 0 16px", padding: 0 })}>
              {node.children.map((child) => (
                <FileTreeNode
                  key={child.path}
                  node={child}
                  selected={selected}
                  select={select}
                />
              ))}
            </ul>
          </details>
        ) : (
          <button
            type="button"
            aria-current={selected === node.path ? "true" : undefined}
            mix={[row, focusRing, on("click", () => select(node.path))]}
          >
            <Icon name="file" />
            <span>{node.name}</span>
          </button>
        )}
      </li>
    );
  };
}
export function FileTree(handle: Handle<FileTreeProps>) {
  let selected = handle.props.defaultValue;
  return () => {
    const { nodes, value = selected, onSelect, label = "Files" } = handle.props;
    return (
      <ul
        aria-label={label}
        data-slot="file-tree"
        mix={css({ margin: 0, padding: 0, minWidth: 0 })}
      >
        {nodes.map((node) => (
          <FileTreeNode
            key={node.path}
            node={node}
            selected={value}
            select={(path) => {
              selected = path;
              onSelect?.(path);
              void handle.update();
            }}
          />
        ))}
      </ul>
    );
  };
}
