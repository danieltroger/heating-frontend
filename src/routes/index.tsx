import "../fake_document";
import { Title } from "solid-start";
import Counter from "~/components/Counter";
import { DepictAPIWS } from "@depict-ai/utilishared";

let socket: DepictAPIWS;

export default function Home() {
  if (
    !socket &&
    typeof window !== "undefined" &&
    !(window as unknown as { is_fake: boolean }).is_fake
  ) {
    try {
      debugger;
      socket = new DepictAPIWS("http://localhost:9321");
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <main>
      <Title>Hello World</Title>
      <h1>Hello world!</h1>
      <Counter />
      <p>
        Visit{" "}
        <a href="https://start.solidjs.com" target="_blank">
          start.solidjs.com
        </a>{" "}
        to learn how to build SolidStart apps.
      </p>
    </main>
  );
}
