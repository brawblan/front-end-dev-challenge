import { LitElement, html, css } from 'lit';

export class ChallengeHeader extends LitElement {
  static styles = [
    css`
      slot {
        font-size: 1.5rem;
        font-weight: bold;
      }
    `
  ];

  render() {
    return html`
      <header>
        <slot></slot>
      </header>
    `;
  }
}
window.customElements.define("challenge-header", ChallengeHeader);