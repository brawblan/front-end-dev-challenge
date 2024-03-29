import { LitElement, html, css } from "lit";
import { map } from "lit/directives/map.js";

export class ChallengeSelect extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
        background: white;
      }
      label,
      select {
        font-size: 2rem;
        font-weight: bold;
      }
      select {
        cursor: pointer;
        border: none;
        border-bottom: 2px solid black;
      }
      :host(:not([size="stream"])) .input-btn-container {
        display: none;
      }

      select,
      .streaming-button {
        text-transform: capitalize;
      }
    `,
  ];

  static get properties() {
    return {
      value: { type: String },
    };
  }

  constructor() {
    super();
    this.value = "small";
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("size", this.value);
  }

  handleInput(e) {
    this.value = e.target.value;
    this.setAttribute("size", this.value);
  }

  handleButton(streamType) {
    const options = {
      bubbles: true,
      detail: {
        rate: this.shadowRoot.getElementById("streaming-rate"),
      },
    };
    this.dispatchEvent(new CustomEvent(`stream-${streamType}`, options));
  }

  render() {
    return html`
      <label for="choose-size">Choose data size:</label>
      <select name="size" id="choose-size" @input=${this.handleInput}>
        ${this.sizeOptionsTemplate()}
      </select>
      <div class="input-btn-container">
        <label for="streaming-rate">Streaming rate:</label>
        <input type="number" name="rate" id="streaming-rate" value="4" />
        ${this.streamingButtonsTemplate()}
      </div>
    `;
  }

  sizeOptionsTemplate() {
    return map(
      ["small", "medium", "large", "stream"],
      (text) => html` <option value=${text}>${text}</option> `
    );
  }

  streamingButtonsTemplate() {
    return map(
      ["start", "stop", "reset"],
      (text) => html`
        <button
          class="streaming-button"
          @click=${() => this.handleButton(text)}
        >
          ${text}
        </button>
      `
    );
  }
}
window.customElements.define("challenge-select", ChallengeSelect);
