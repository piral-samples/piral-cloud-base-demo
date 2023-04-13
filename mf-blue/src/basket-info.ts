import "./basket-info.css";

const items = [];

window.addEventListener("add-item", () => {
  items.push("...");
  window.dispatchEvent(new CustomEvent("added-item", { detail: items }));
});

export class BasketInfo extends HTMLElement {
  private handleAdded: () => void;

  constructor() {
    super();
    this.handleAdded = this.render.bind(this);
  }

  static get observedAttributes() {
    return ["sku"];
  }

  render() {
    const count = items.length;

    this.innerHTML = `
<div class="${count === 0 ? "empty" : "filled"}">basket: ${count} item(s)</div>
    `;
  }

  connectedCallback() {
    this.render();
    window.addEventListener("added-item", this.handleAdded);
  }

  disconnectedCallback() {
    window.removeEventListener("added-item", this.handleAdded);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (this.isConnected && name === "sku" && oldValue !== newValue) {
      this.render();
    }
  }
}
