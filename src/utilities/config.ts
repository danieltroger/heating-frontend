import { socket } from "~/utilities/socket";
import { random_string } from "@depict-ai/utilishared";
import { createSignal, onCleanup } from "solid-js";

export function get_config_signal() {
  const [read_config_signal, write_config_signal] = createSignal("Loading…");
  (async () => {
    const [response, response_json] = (await socket?.ensure_sent({
      id: random_string(),
      command: "read-config",
    })) as [
      {
        id: string;
        status: "ok" | "not-ok";
        value: { [key: string]: any };
      },
      string
    ];
    if (response.status !== "ok") {
      write_config_signal("Error getting config\n" + response_json);
    } else {
      write_config_signal(JSON.stringify(response.value, null, 2));
    }
  })();

  const message_handler = ({ data }: MessageEvent) => {
    const decoded = JSON.parse(data);
    if (decoded.type === "config-change") {
      write_config_signal(JSON.stringify(decoded.value, null, 2));
    }
  };
  socket?.addEventListener("message", message_handler as any);
  onCleanup(() =>
    socket?.removeEventListener("message", message_handler as any)
  );

  return [
    read_config_signal,
    async (new_config: string) => {
      write_config_signal(new_config); // So that diffing works once we receive the actual value from the server
      try {
        const parsed_config = JSON.parse(new_config);
        const [response] = (await socket?.ensure_sent({
          id: random_string(),
          command: "write-config",
          value: parsed_config,
        })) as [
          {
            id: string;
            status: "ok" | "not-ok";
            message?: string;
          },
          string
        ];
        if (response.status === "ok") {
          return true;
        }
        throw response.message;
      } catch (e) {
        alert("Can't save config: " + e);
        return false;
      }
    },
  ] as const;
}
