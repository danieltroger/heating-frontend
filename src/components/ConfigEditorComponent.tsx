import { createComputed } from "solid-js";
import "./ConfigEditorComponent.css";
import { get_backend_synced_signal } from "~/utilities/get_backend_synced_signal";

export default function ConfigEditorComponent() {
  let textarea: HTMLTextAreaElement;
  let button: HTMLButtonElement;
  const [get_config, set_config] = get_backend_synced_signal<string>("config");

  return (
    <div class="config-editor">
      <textarea
        ref={(el) => {
          textarea = el;
          createComputed(() => (el.value = get_config?.() || "Loading"));
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
