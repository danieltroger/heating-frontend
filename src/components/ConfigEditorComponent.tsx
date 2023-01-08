import { createComputed } from "solid-js";
import "./ConfigEditorComponent.css";
import { get_backend_synced_signal } from "~/utilities/get_backend_synced_signal";

export default function ConfigEditorComponent() {
  let textarea: HTMLTextAreaElement;
  let button: HTMLButtonElement;
  const [get_config, set_config] = get_backend_synced_signal<{
    [key: string]: any;
  }>("config");

  return (
    <div class="config-editor">
      <textarea
        ref={(el) => {
          textarea = el;
          createComputed(() => {
            const config_value = get_config();
            if (typeof config_value === "object") {
              el.value = JSON.stringify(config_value, undefined, 2);
            } else {
              el.value = "Loading…";
            }
          });
        }}
      ></textarea>
      <br />
      <button
        class="save-button"
        ref={button!}
        onClick={async () => {
          if (!set_config) {
            return;
          }
          const success = await set_config(textarea.value);
          button.animate(
            [
              { backgroundColor: success ? "green" : "red", offset: 0.2 },
              { backgroundColor: success ? "green" : "red", offset: 0.8 },
            ],
            {
              // chrome bug: this doesn't work when no initial background is set via css
              duration: 2000,
            }
          );
        }}
      >
        Save
      </button>
    </div>
  );
}
