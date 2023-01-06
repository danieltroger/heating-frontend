import { Title } from "solid-start";
import { createComputed, createMemo, createSignal, For } from "solid-js";
import { socket } from "~/utilities/socket";

export default function Temperatures() {
  const [get_temperatures, set_temperatures] = createSignal<{
    [key: string]: {
      value: number;
      time: number;
      thermometer_device_id: string;
      label: string;
    };
  }>({
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
  const handler = (msg: Event) => {
    const decoded = JSON.parse((msg as any).data);
    if (decoded.type === "temperature-change") {
      set_temperatures(decoded.value);
    }
  };
  socket?.addEventListener("message", handler);
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
