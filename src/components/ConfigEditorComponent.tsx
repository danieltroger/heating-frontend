import { Accessor, createComputed, createSignal, untrack } from "solid-js";
import "./ConfigEditorComponent.css";
import { socket } from "~/utilities/socket";
import { random_string } from "@depict-ai/utilishared";
import { get_config_signal } from "~/utilities/config";
import { is_client } from "~/utilities/is_client";

export default function ConfigEditorComponent() {
  let textarea: HTMLTextAreaElement;
  let button: HTMLButtonElement;
  let get_config: Accessor<string> | undefined;
  let set_config: ((new_config: string) => Promise<boolean>) | undefined;
  if (is_client) {
    [get_config, set_config] = get_config_signal();
  }

  return (
    <div class="config-editor">
      <textarea
        ref={(el) => {
          textarea = el;
          createComputed(() => (el.value = get_config?.() || ""));
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
