import { css, type Handle, on } from "remix/component";
import { PreviewPopover } from "./internal/popover.js";
import { tokens as t } from "./theme.js";
export interface ModelOption {
  id: string;
  name: string;
  provider: string;
  disabled?: boolean;
}
export interface ModelSelectorProps {
  models: readonly ModelOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: string;
}
export function ModelSelector(handle: Handle<ModelSelectorProps>) {
  let selected =
    handle.props.defaultValue ??
    handle.props.models.find((model) => !model.disabled)?.id;
  return () => {
    const {
      models,
      value = selected,
      onValueChange,
      label = "Model",
    } = handle.props;
    const model = models.find((item) => item.id === value);
    const providers = [...new Set(models.map((item) => item.provider))];
    return (
      <PreviewPopover
        label={
          <>
            {model?.name ?? "Select model"} <span aria-hidden="true">⌄</span>
          </>
        }
        ariaLabel={`${label}: ${model?.name ?? "None"}`}
      >
        <span
          role="radiogroup"
          aria-label={label}
          mix={css({ display: "flex", flexDirection: "column", gap: "10px" })}
        >
          {providers.map((provider) => (
            <span
              key={provider}
              mix={css({
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              })}
            >
              <span
                mix={css({ fontSize: "11px", color: t.subtle, padding: "4px" })}
              >
                {provider}
              </span>
              {models
                .filter((item) => item.provider === provider)
                .map((item) => (
                  <label
                    key={item.id}
                    mix={css({
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "6px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      "&:hover": { background: t.muted },
                      "&:has(:disabled)": {
                        opacity: 0.5,
                        cursor: "not-allowed",
                      },
                    })}
                  >
                    <input
                      type="radio"
                      name={`model-${handle.id}`}
                      value={item.id}
                      checked={value === item.id}
                      disabled={item.disabled}
                      mix={on("change", (event) => {
                        if (!event.currentTarget.checked) return;
                        selected = item.id;
                        onValueChange?.(item.id);
                        void handle.update();
                      })}
                    />
                    {item.name}
                  </label>
                ))}
            </span>
          ))}
          {!models.length ? <span>No models available</span> : null}
        </span>
      </PreviewPopover>
    );
  };
}
