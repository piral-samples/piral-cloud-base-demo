import type { PiletApi } from "my-app";
import { ProductPage } from "./product-page";

export function setup(api: PiletApi) {
  api.registerComponent("home", ProductPage);
}

export function teardown(api: PiletApi) {
  api.unregisterComponent("home", ProductPage);
}
