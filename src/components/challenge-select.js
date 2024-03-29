import { LitElement, html, css } from "lit";

export class ChallengeSelect extends LitElement {
  static styles = [
    css`
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

  render() {
    return html`
      <label for="choose-size">Choose data size:</label>
      <select name="size" id="choose-size" @input=${this.handleInput}>
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
        <option value="stream">Stream</option>
      </select>
    `;
  }
}
window.customElements.define("challenge-select", ChallengeSelect);
