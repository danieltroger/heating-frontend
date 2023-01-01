import { Title } from "solid-start";

export default function Home() {
  return (
    <main>
      <Title>Heating controls</Title>
      <h1>Heating controls</h1>
      <ol>
        <li>
          <a href="/config-editor">Config editor</a>
        </li>
        <li>
          <a href="/temperatures">Temperatures</a>
        </li>
      </ol>
    </main>
  );
}
