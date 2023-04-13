import { events } from "./events";
import { ComponentRegistry } from "./types";

const componentNames = new Map<CustomElementConstructor, string>();
const componentRegistry: ComponentRegistry = {};

export function registerComponent(
  name: string,
  component: CustomElementConstructor
) {
  const components = componentRegistry[name] || [];

  if (!componentNames.has(component)) {
    const suffix = Math.random().toString(26).substring(2);
    const cn = `mf-component-${suffix}`;
    componentNames.set(component, cn);
    customElements.define(cn, component);
  }

  components.push(componentNames.get(component));
  componentRegistry[name] = components;
  events.emit("component-changed", { name, components });
}

export function unregisterComponent(
  name: string,
  component: CustomElementConstructor
) {
  const components = componentRegistry[name] || [];
  const cn = componentNames.get(component);

  if (cn) {
    const index = components.indexOf(cn);

    if (index !== -1) {
      components.splice(index, 1);
      events.emit("component-changed", { name, components });
    }
  }
}

class MfComponent extends HTMLElement {
  _data: Record<string, any> = {};

  constructor() {
    super();
    this.data = this.getAttribute("data");
  }

  handler = ({ name, components }) => {
    if (name === this.getAttribute("name")) {
      this.render(components);
    }
  };

  get data() {
    return this._data;
  }

  set data(value: null | string | Record<string, any>) {
    if (typeof value === "string") {
      value = decodeURIComponent(value)
        .split("&")
        .reduce((obj, item) => {
          const [name, ...rest] = item.split("=");
          obj[name] = rest.join("=");
          return obj;
        }, {});
    }

    if (typeof value === "object") {
      this._data = value || {};
    }

    this.render();
  }

  static get observedAttributes() {
    return ["name", "data"];
  }

  render(components: Array<string> = []) {
    const newComponents = components.slice(this.children.length);

    newComponents.forEach((componentName) => {
      const element = document.createElement(componentName);
      this.appendChild(element);
    });

    Array.from(this.children).forEach((child) => {
      Object.entries(this._data).forEach(([name, value]) => {
        child.setAttribute(name, value);
      });
    });
  }

  connectedCallback() {
    const name = this.getAttribute("name");

    if (name) {
      const components = componentRegistry[name] || [];
      this.render(components);
    }

    events.on("component-changed", this.handler);
  }

  disconnectedCallback() {
    this.innerHTML = "";
    events.off("component-changed", this.handler);
  }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    if (oldVal !== newVal) {
      if (name === "name") {
        this.disconnectedCallback();
        this.connectedCallback();
      } else if (name === "data") {
        this.data = newVal;
      }
    }
  }
}

customElements.define("mf-component", MfComponent);
