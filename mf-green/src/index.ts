import type { PiletApi } from "my-app";
import { ProductRecommendations } from "./product-recommendations";

export function setup(api: PiletApi) {
  api.registerComponent("recommendations", ProductRecommendations);
}

export function teardown(api: PiletApi) {
  api.unregisterComponent("recommendations", ProductRecommendations);
}
