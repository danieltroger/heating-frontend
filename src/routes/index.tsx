import { Title } from "solid-start";
import ConfigEditor from "~/components/ConfigEditorComponent";
import { DepictAPIWS } from "@depict-ai/utilishared";
import { createSignal } from "solid-js";

export default function Home() {
  return (
    <main>
      <Title>Heating controls</Title>
      <h1>Heating controls</h1>
      <ol>
        <li>
          <a href="/config-editor">Config editor</a>
        </li>
      </ol>
    </main>
  );
}
