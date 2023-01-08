import { Title } from "solid-start";
import { get_backend_synced_signal } from "~/utilities/get_backend_synced_signal";
import { createMemo, Show } from "solid-js";
import { GPIOObj } from "~/routes/gpio";

export default function Stove() {
  const [get_voltage] = get_backend_synced_signal<number>("voltage");
  const [get_pid_output] = get_backend_synced_signal<number>("pid_output");
  const [get_gpio] = get_backend_synced_signal<GPIOObj>("gpio");
  const stove_gpio_status = createMemo(() => get_gpio()?.outputs?.stove);

  return (
    <main>
      <Title>Stove</Title>
      <h1>Stove</h1>
      <div class="stove">
        <Show when={typeof stove_gpio_status() === "boolean"}>
          <div>
            Stove is {stove_gpio_status() ? "On" : "Off"}
            (see GPIO page to manually toggle)
          </div>
        </Show>
        <div>Current power: {get_voltage()! + 3}kw</div>
        <div>PID output: {get_pid_output()}</div>
      </div>
    </main>
  );
}
