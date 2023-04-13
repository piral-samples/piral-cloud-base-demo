declare module "piral-base/lib/types/runtime" {
  interface PiletApi {
    registerComponent(
      name: string,
      CustomElement: CustomElementConstructor
    ): void;
    unregisterComponent(
      name: string,
      CustomElement: CustomElementConstructor
    ): void;
  }
}

export type ComponentRegistry = Record<string, Array<string>>;
