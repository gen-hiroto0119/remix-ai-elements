import type { Handle } from "remix/component";

export type IconName =
  | "arrow-up"
  | "arrow-down"
  | "chevron"
  | "copy"
  | "check"
  | "stop"
  | "plus"
  | "code"
  | "terminal"
  | "globe"
  | "sun"
  | "moon"
  | "sparkle"
  | "alert"
  | "clock"
  | "message"
  | "file";
const paths: Record<IconName, string> = {
  "arrow-up": "M12 19V5m-6 6 6-6 6 6",
  "arrow-down": "M12 5v14m-6-6 6 6 6-6",
  chevron: "m9 5 7 7-7 7",
  copy: "M9 9h11v11H9zM15 5V3H3v12h2",
  check: "m5 12 4 4L19 6",
  stop: "M6 6h12v12H6z",
  plus: "M12 5v14M5 12h14",
  code: "m8 5-7 7 7 7m8-14 7 7-7 7M14 3l-4 18",
  terminal: "m4 5 6 6-6 6m8 0h8",
  globe: "M3 12h18M12 3c-6 5-6 13 0 18m0-18c6 5 6 13 0 18",
  sun: "M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2",
  moon: "M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z",
  sparkle: "m12 3 3 6 6 3-6 3-3 6-3-6-6-3 6-3Z",
  alert: "m12 3 10 18H2Zm0 5v5m0 3v1",
  clock: "M12 6v6l4 2",
  message: "M4 3h16v14H9l-5 4Z",
  file: "M5 2h9l5 5v15H5Zm9 0v6h5M8 12h8m-8 4h6",
};

export function Icon(handle: Handle<{ name: IconName; size?: number }>) {
  return () => {
    const { name, size = 16 } = handle.props;
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d={paths[name]} />
        {name === "globe" || name === "clock" ? (
          <circle cx="12" cy="12" r="9" />
        ) : null}
        {name === "sun" ? <circle cx="12" cy="12" r="4" /> : null}
      </svg>
    );
  };
}
