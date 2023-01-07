import { Title } from "solid-start";
import {
  createMemo,
  createSignal,
  For,
  getOwner,
  onCleanup,
  runWithOwner,
  Show,
  untrack,
} from "solid-js";
import { socket } from "~/utilities/socket";
import { random_string } from "@depict-ai/utilishared";
import { is_client } from "~/utilities/is_client";

type GPIOObj = {
  inputs: { [p: string]: 0 | 1 };
  outputs: { [p: string]: 0 | 1 };
};

export default function GPIO() {
  const inputs = get_inputs();
  const keys_l1 = createMemo(() => Object.keys(inputs()));

  return (
    <main>
      <Title>GPIO</Title>
      <h1>GPIO</h1>
      <div class="gpio">
        <For each={keys_l1() as any}>
          {(key: "inputs" | "outputs") => {
            const things = createMemo(() => inputs()[key]);
            const keys = createMemo(() => Object.keys(things()));
            const is_outputs = key === "outputs";

            return (
              <div class="io_section" classList={{ [key]: true }}>
                <table>
                  <tbody>
                    <tr>
                      <th>Key</th>
                      <th>Value</th>
                    </tr>
                    <For each={keys()}>
                      {(io_key) => {
                        const value = createMemo(() => things()[io_key]);
                        const owner = getOwner()!;

                        return (
                          <tr>
                            <td>{io_key}</td>
                            <td
                              onClick={async () => {
                                if (!is_outputs) {
                                  return;
                                }
                                const target_value =
                                  untrack(value) === 0 ? 1 : 0;

                                const [result, result_json] =
                                  (await socket?.ensure_sent({
                                    id: random_string(),
                                    command: "write-gpio",
                                    value: {
                                      output: io_key,
                                      new_state: target_value,
                                    },
                                  })) as any;

                                console.log("set gpio result", result);

                                const { show_toast } = await import(
                                  "@depict-ai/ui"
                                );
                                const status = result?.status;

                                runWithOwner(owner, () => {
                                  const { close_toast_ } = show_toast({
                                    children: [
                                      <div class="statement">
                                        {status === "ok"
                                          ? "Successfully set " +
                                            io_key +
                                            " to " +
                                            target_value
                                          : result_json}
                                      </div>,
                                      <div class="buttons">
                                        <button
                                          onClick={() => close_toast_()}
                                          class="ok major"
                                        >
                                          OK
                                        </button>
                                      </div>,
                                    ],
                                    close_after_: 5000,
                                  });
                                });
                              }}
                            >
                              {value()}
                            </td>
                          </tr>
                        );
                      }}
                    </For>
                  </tbody>
                </table>
                <Show when={is_outputs}>
                  <span class="hint">Click value to toggle</span>
                </Show>
                <h2>{key}</h2>
              </div>
            );
          }}
        </For>
      </div>
    </main>
  );
}

function get_inputs() {
  const [inputs, set_inputs] = createSignal<GPIOObj>({
    inputs: {},
    outputs: {},
  });

  if (!is_client) {
    return inputs;
  }

  (async () => {
    const message_handler = ({ data }: MessageEvent) => {
      const decoded = JSON.parse(data);
      if (decoded.type === "gpio-change") {
        set_inputs(decoded.value);
      }
    };
    socket?.addEventListener("message", message_handler as any);
    onCleanup(() =>
      socket?.removeEventListener("message", message_handler as any)
    );
    const [response, response_json] = (await socket?.ensure_sent({
      id: random_string(),
      command: "read-gpio",
    })) as [
      {
        id: string;
        status: "ok" | "not-ok";
        value: any;
      },
      string
    ];
    if (response.status === "ok") {
      set_inputs(response.value);
    } else {
      alert("Error getting gpio:" + response_json);
      console.error(response);
    }
  })();

  return inputs;
}
