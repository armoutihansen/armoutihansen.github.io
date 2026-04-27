import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://armoutihansen.xyz",
  output: "static",
  publicDir: "./static",
  build: {
    assets: "_assets"
  }
});
