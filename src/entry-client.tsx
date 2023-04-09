import { mount, StartClient } from "solid-start/entry-client";
import { javascript_media_query } from "@depict-ai/utilishared";

import lightmode_css from "./root_lightmode.scss?inline";
import darkmode_css from "./root_darkmode.scss?inline";

const style_tag = document.createElement("style");

javascript_media_query("(prefers-color-scheme: dark)", async ({ matches }) =>
  style_tag.replaceChildren(matches ? darkmode_css : lightmode_css)
);

document.head.append(style_tag);

mount(() => <StartClient />, document);
