import { createComputed, createSignal, untrack } from "solid-js";
import "./ConfigEditorComponent.css";
import { socket } from "~/utilities/socket";
import { random_string } from "@depict-ai/utilishared";
import { get_config_signal } from "~/utilities/config";

export default function ConfigEditorComponent() {
  let textarea: HTMLTextAreaElement;
  let button: HTMLButtonElement;
  const [get_config, set_config] = get_config_signal();

  return (
    <div class="config-editor">
      <textarea
        ref={(el) => {
          textarea = el;
          createComputed(() => (el.value = get_config()));
        }}
      ></textarea>
      <br />
      <button
        class="save-button"
        ref={button!}
        onClick={async () => {
          const success = await set_config(textarea.value);
          button.animate([{ backgroundColor: success ? "green" : "red" }], {
            // chrome bug: this doesn't work when no initial background is set via css
            duration: 500,
          });
        }}
      >
        Save
      </button>
    </div>
  );
}
