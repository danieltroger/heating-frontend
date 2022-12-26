import { DepictAPIWS } from "@depict-ai/utilishared";

export let socket: DepictAPIWS | undefined;

if (!socket && typeof window !== "undefined" && !(window as any).is_fake) {
  try {
    socket = new DepictAPIWS("ws://localhost:9321");
    socket.addEventListener("message", (msg) => {
      console.log("Got message", (msg as any).data);
    });
  } catch (e) {
    console.log(e);
  }
}
