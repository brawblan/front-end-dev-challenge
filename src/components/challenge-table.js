import { LitElement, html, css } from "lit";
import { map } from "lit/directives/map.js";
import { when } from "lit/directives/when.js";

export class ChallengeTable extends LitElement {
  static styles = [
    css`
      h1 {
        text-transform: capitalize;
      }

      table {
        border-collapse: collapse;
        border: 2px solid rgb(140 140 140);
        font-family: sans-serif;
        font-size: 0.8rem;
        letter-spacing: 1px;
      }

      thead {
        background-color: rgb(228 240 245);
      }

      th,
      td {
        border: 1px solid rgb(160 160 160);
        padding: 8px 10px;
      }

      tbody > tr:nth-of-type(even) {
        background-color: rgb(237 238 242);
      }
    `,
  ];

  static get properties() {
    return {
      data: { type: Object },
    };
  }

  constructor() {
    super();
    this.data = { name: "", coords: [] };
  }

  render() {
    return html`
      <h1>${this.data.name}, length: ${this.data.coords.length}</h1>
      <table>
        <thead>
          <tr>
            <th>x coordinate</th>
            <th>y coordinate</th>
          </tr>
        </thead>
        <tbody>
          ${when(this.data, () =>
      map(
        this.data.coords,
        ([x, y]) => html`
                <tr>
                  <td>${x}</td>
                  <td>${y}</td>
                </tr>
              `
      )
    )}
        </tbody>
      </table>
    `;
  }
}
window.customElements.define("challenge-table", ChallengeTable);
