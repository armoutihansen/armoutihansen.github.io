import { defineConfig } from "astro/config";
import { profileLink } from "./src/data/profile.ts";

export default defineConfig({
  site: profileLink("website").href,
  output: "static",
  publicDir: "./static",
  build: {
    assets: "_assets"
  }
});
