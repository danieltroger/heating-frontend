import { DepictAPIWS } from "@depict-ai/utilishared";
import { is_client } from "~/utilities/is_client";

export let socket: DepictAPIWS | undefined;

if (!socket && is_client) {
  try {
    socket = new DepictAPIWS("ws://localhost:9321");
    socket.addEventListener("message", (msg) => {
      console.log("Got message", (msg as any).data);
    });
  } catch (e) {
    console.log(e);
  }
}
