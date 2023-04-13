import type { PiletApi } from "my-app";
import { BasketInfo } from "./basket-info";
import { BuyButton } from "./buy-button";

export function setup(api: PiletApi) {
  api.registerComponent("basket", BasketInfo);
  api.registerComponent("buy", BuyButton);
}

export function teardown(api: PiletApi) {
  api.unregisterComponent("basket", BasketInfo);
  api.unregisterComponent("buy", BuyButton);
}
