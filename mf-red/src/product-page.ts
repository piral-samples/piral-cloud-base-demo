import "./product-page.css";
import tractorRed from "./images/tractor-red.jpg";
import tractorRedThumb from "./images/tractor-red-thumb.jpg";
import tractorGreen from "./images/tractor-green.jpg";
import tractorGreenThumb from "./images/tractor-green-thumb.jpg";
import tractorBlue from "./images/tractor-blue.jpg";
import tractorBlueThumb from "./images/tractor-blue-thumb.jpg";

const product = {
  name: "Tractor",
  variants: [
    {
      sku: "porsche",
      color: "red",
      name: "Porsche-Diesel Master 419",
      image: tractorRed,
      thumb: tractorRedThumb,
      price: "66,00 €",
    },
    {
      sku: "fendt",
      color: "green",
      name: "Fendt F20 Dieselroß",
      image: tractorGreen,
      thumb: tractorGreenThumb,
      price: "54,00 €",
    },
    {
      sku: "eicher",
      color: "blue",
      name: "Eicher Diesel 215/16",
      image: tractorBlue,
      thumb: tractorBlueThumb,
      price: "58,00 €",
    },
  ],
};

function renderOptions(sku) {
  return product.variants
    .map(
      (variant) => `
        <button class="${
          sku === variant.sku ? "active" : ""
        }" type="button" data-sku="${variant.sku}">
          <img src="${variant.thumb}" alt="${variant.name}" />
        </button>
      `
    )
    .join("");
}

function getCurrent(sku) {
  return product.variants.find((v) => v.sku === sku) || product.variants[0];
}

function renderImage(current) {
  return `
    <div>
      <img src="${current.image}" alt="${current.name}" />
    </div>
  `;
}

function renderName(current) {
  return `
    ${product.name} <small>${current.name}</small>
  `;
}

export class ProductPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const sku = this.getAttribute("sku") || "porsche";
    const current = getCurrent(sku);

    this.innerHTML = `
<div class="product-page-grid">
  <h1 id="store">The Model Store</h1>
  <mf-component name="basket" data="sku%3D${sku}" class="blue-basket" id="basket"></mf-component>
  <div id="image">
    ${renderImage(current)}
  </div>
  <h2 id="name">
    ${renderName(current)}
  </h2>
  <div id="options">
    ${renderOptions(current.sku)}
  </div>
  <mf-component name="buy" data="sku%3D${sku}" class="blue-buy" id="buy"></mf-component>
  <mf-component name="recommendations" data="sku%3D${sku}" class="green-recos" id="reco"></mf-component>
</div>`;

    this.querySelectorAll("#options button").forEach((button) => {
      button.addEventListener("click", () => {
        //@ts-ignore
        this.setAttribute("sku", button.dataset.sku);
      });
    });
  }

  static get observedAttributes() {
    return ["sku"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.isConnected && name === "sku" && oldValue !== newValue) {
      const current = getCurrent(newValue);
      const newData = { sku: newValue };
      //@ts-ignore
      this.querySelector("#basket")!.data = newData;
      //@ts-ignore
      this.querySelector("#buy")!.data = newData;
      //@ts-ignore
      this.querySelector("#reco")!.data = newData;
      this.querySelector("#name")!.innerHTML = renderName(current);
      this.querySelector("#image")!.innerHTML = renderImage(current);
      this.querySelectorAll<HTMLElement>("#options button").forEach(
        (button) => {
          if (button.dataset.sku === newValue) {
            button.classList.add("active");
          } else {
            button.classList.remove("active");
          }
        }
      );
    }
  }
}
