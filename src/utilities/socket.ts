import { DepictAPIWS } from "@depict-ai/utilishared";
import { is_client } from "~/utilities/is_client";

export let socket: DepictAPIWS | undefined;

if (!socket && is_client) {
  try {
    socket = new DepictAPIWS("ws://192.168.1.100:9321");
  } catch (e) {
    console.log(e);
  }
}
