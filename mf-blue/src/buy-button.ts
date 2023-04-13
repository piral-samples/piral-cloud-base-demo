import "./buy-button.css";

const defaultPrice = "0,00 €";
const prices = {
  porsche: "66,00 €",
  fendt: "54,00 €",
  eicher: "58,00 €",
};

function renderPrice(price) {
  return `buy for ${price}`;
}

export class BuyButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const sku = this.getAttribute("sku") || "porsche";
    const price = prices[sku] || defaultPrice;

    this.innerHTML = `
<form method="POST">
  <button>
    ${renderPrice(price)}
  </button>
</form>
    `;

    this.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.submitCurrentItem();
      return false;
    });
  }

  static get observedAttributes() {
    return ["sku"];
  }

  submitCurrentItem() {
    const sku = this.getAttribute("sku") || "porsche";
    const price = prices[sku] || defaultPrice;
    window.dispatchEvent(new CustomEvent("add-item", { detail: price }));
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    const bt = this.querySelector("button");

    if (this.isConnected && bt && name === "sku" && oldValue !== newValue) {
      const price = prices[newValue] || defaultPrice;
      bt.textContent = renderPrice(price);
    }
  }
}
