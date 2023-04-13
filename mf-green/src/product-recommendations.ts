import "./recommendations.css";

const loadImage = require.context("./images", true, /.jpg$/, "sync");

const allRecommendations = {
  porsche: ["3", "5", "6"],
  fendt: ["3", "6", "4"],
  eicher: ["1", "8", "7"],
};

export class ProductRecommendations extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const sku = this.getAttribute("sku") || "porsche";
    this.render(sku);
  }

  static get observedAttributes() {
    return ["sku"];
  }

  render(sku) {
    const recommendations =
      allRecommendations[sku] || allRecommendations.porsche;

    this.innerHTML = `
<h3>Related Products</h3>
${recommendations
  .map(
    (id) =>
      `<img src="${loadImage(`./reco_${id}.jpg`)}" alt="Recommendation ${id}">`
  )
  .join("")}
  `;
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (this.isConnected && name === "sku" && oldValue !== newValue) {
      this.render(newValue);
    }
  }
}
