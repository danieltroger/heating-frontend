import { Title } from "solid-start";
import { createMemo, For } from "solid-js";
import { get_backend_synced_signal } from "~/utilities/get_backend_synced_signal";

export default function Temperatures() {
  const [get_temperatures] = get_backend_synced_signal<
    {
      [key: string]: {
        value: number;
        time: number;
        thermometer_device_id: string;
        label: string;
      };
    },
    true
  >("temperatures", {
    loading: {
      value: 0,
      time: 0,
      thermometer_device_id: "",
      label: "Loading",
    },
    loading2: {
      value: 0,
      time: 0,
      thermometer_device_id: "",
      label: "Loading",
    },
    loading3: {
      value: 0,
      time: 0,
      thermometer_device_id: "",
      label: "Loading",
    },
  });
  const temperature_keys = createMemo(() => Object.keys(get_temperatures()));

  return (
    <main>
      <Title>Temperatures</Title>
      <h1>Temperatures</h1>
      <div class="temperatures">
        <For each={temperature_keys()}>
          {(key) => {
            const obj = createMemo(() => get_temperatures()[key]);
            const value = createMemo(() => obj().value);
            const time = createMemo(() =>
              new Date(obj().time).toLocaleTimeString()
            );
            const label = createMemo(() => obj().label);
            const device_id = createMemo(
              () => "Device id: " + obj().thermometer_device_id
            );
            return (
              <div class="temperature" title={device_id()}>
                <h3 class="label">{label()}</h3>
                <h4 class="value">Temperature: {value()}°C</h4>
                <span class="time">Last updated at: {time()}</span>
              </div>
            );
          }}
        </For>
      </div>
    </main>
  );
}
