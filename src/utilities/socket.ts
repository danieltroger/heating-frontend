import { DepictAPIWS } from "@depict-ai/utilishared";
import { is_client } from "~/utilities/is_client";

export let socket: DepictAPIWS | undefined;

if (!socket && is_client) {
  try {
    const u_o = new URL("ws://192.168.1.100");
    u_o.protocol = u_o.protocol === "https:" ? "wss:" : "ws:";
    u_o.port = "9321";
    socket = new DepictAPIWS(u_o.href);
  } catch (e) {
    console.log(e);
  }
}
