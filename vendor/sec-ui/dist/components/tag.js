import { SecElement, sheet } from "../base-element.js";
const css = sheet(`
  :host { display: inline-block; }
  span {
    display: inline-flex;
    align-items: center;
    font-family: var(--sec-font-mono);
    font-size: var(--sec-fs-xs);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 3px 9px;
    border-radius: var(--sec-radius-sm);
    border: 1px solid var(--sec-line);
    color: var(--sec-text-secondary);
    background: rgba(255, 255, 255, 0.03);
    white-space: nowrap;
  }
  :host([variant="accent"]) span { color: var(--sec-accent); border-color: var(--sec-accent-line); background: var(--sec-accent-subtle); }
  :host([variant="success"]) span { color: var(--sec-success); border-color: rgba(61, 220, 132, 0.35); background: rgba(61, 220, 132, 0.1); }
  :host([variant="warning"]) span { color: var(--sec-warning); border-color: rgba(241, 194, 27, 0.35); background: rgba(241, 194, 27, 0.1); }
  :host([variant="danger"]) span { color: var(--sec-danger); border-color: rgba(250, 77, 86, 0.35); background: rgba(250, 77, 86, 0.1); }
  :host([variant="purple"]) span { color: var(--sec-purple); border-color: rgba(165, 110, 255, 0.35); background: rgba(165, 110, 255, 0.1); }
`);
/** `<sec-tag variant="neutral|accent|success|warning|danger|purple">Label</sec-tag>` */
export class SecTag extends SecElement {
    static { this.observedAttributes = ["variant"]; }
    render() {
        this.adopt(css);
        this.root.innerHTML = `<span part="tag"><slot></slot></span>`;
    }
}
customElements.define("sec-tag", SecTag);
//# sourceMappingURL=tag.js.map