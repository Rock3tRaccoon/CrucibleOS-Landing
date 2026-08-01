import { SecElement, sheet } from "../base-element.js";
const css = sheet(`
  :host { display: block; }
  .stat {
    position: relative;
    padding: var(--sec-space-4) var(--sec-space-5);
    border: 1px solid var(--sec-line);
    border-radius: var(--sec-radius-md);
    background:
      linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
      rgba(255, 255, 255, 0.02);
    background-size: 10px 10px, 10px 10px, 100% 100%;
    background-position: -1px -1px;
    overflow: hidden;
    transition: border-color var(--sec-transition-med), transform var(--sec-transition-med), background-color var(--sec-transition-med);
  }
  .stat::before {
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    width: 2px;
    background: var(--sec-accent);
    transform: scaleY(0);
    transform-origin: bottom;
    transition: transform var(--sec-transition-med);
  }
  .stat:hover {
    border-color: var(--sec-accent-line);
    background-color: rgba(255, 255, 255, 0.035);
    transform: translateY(-2px);
  }
  .stat:hover::before { transform: scaleY(1); }
  .tick {
    position: absolute;
    width: 7px;
    height: 7px;
    border: 1px solid var(--sec-accent-line);
    opacity: 0.7;
  }
  .tick.tl { top: 5px; left: 5px; border-right: none; border-bottom: none; }
  .tick.br { bottom: 5px; right: 5px; border-left: none; border-top: none; }
  .label {
    position: relative;
    font-family: var(--sec-font-mono);
    font-size: var(--sec-fs-xs);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--sec-text-muted);
    margin: 0 0 6px;
  }
  .value {
    position: relative;
    font-size: var(--sec-fs-h3);
    font-weight: 600;
    color: var(--sec-text);
    margin: 0;
  }
`);
/** `<sec-stat label="Domain" value="Systems Security"></sec-stat>` — a small metric tile styled
 *  like a schematic readout cell: faint grid texture, corner ticks, accent bar on hover. */
export class SecStat extends SecElement {
    static { this.observedAttributes = ["label", "value"]; }
    render() {
        this.adopt(css);
        const label = this.getAttribute("label") ?? "";
        const value = this.getAttribute("value") ?? "";
        this.root.innerHTML = `
      <div class="stat" part="stat">
        <span class="tick tl"></span>
        <span class="tick br"></span>
        <p class="label">${label}</p>
        <p class="value">${value || "<slot></slot>"}</p>
      </div>
    `;
    }
}
customElements.define("sec-stat", SecStat);
//# sourceMappingURL=stat.js.map