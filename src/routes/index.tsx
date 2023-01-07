import { A, Title } from "solid-start";
import { socket } from "~/utilities/socket";
import { random_string } from "@depict-ai/utilishared";

export default function Home() {
  let input_el: HTMLInputElement;
  return (
    <main>
      <Title>Heating controls</Title>
      <h1>Heating controls</h1>
      <ol>
        <li>
          <A href="/config-editor">Config editor</A>
        </li>
        <li>
          <A href="/temperatures">Temperatures</A>
        </li>
        <li>
          <A href="/gpio">GPIO</A>
        </li>
      </ol>
      <input
        type="range"
        min="15"
        max="85"
        value="50"
        step="0.25"
        ref={input_el!}
        onInput={() => {
          socket?.ensure_sent({
            id: random_string(),
            command: "write-simulated-temperature",
            value: input_el.value,
          });
        }}
      />
    </main>
  );
}
