import { SecElement, sheet } from "../base-element.js";
const css = sheet(`
  :host {
    display: block;
    border-top: 1px solid var(--sec-line);
    background: var(--sec-bg-1);
  }
  .inner {
    max-width: var(--sec-content-max);
    margin: 0 auto;
    padding: var(--sec-space-8) var(--sec-space-5) var(--sec-space-6);
    display: grid;
    grid-template-columns: 1.3fr 1fr 1fr 0.9fr;
    gap: var(--sec-space-6);
  }
  ::slotted([slot="brand"]) { grid-column: 1; }
  .col-title {
    font-family: var(--sec-font-mono);
    font-size: var(--sec-fs-xs);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--sec-text-muted);
    margin: 0 0 var(--sec-space-3);
  }
  ::slotted([slot^="col-"]) {
    display: block;
    color: var(--sec-text-secondary);
    text-decoration: none;
    font-size: var(--sec-fs-sm);
    padding: var(--sec-space-1) 0;
    transition: color var(--sec-transition-fast);
  }
  ::slotted([slot^="col-"]:hover) { color: var(--sec-accent); }
  .bottom {
    max-width: var(--sec-content-max);
    margin: 0 auto;
    padding: var(--sec-space-4) var(--sec-space-5) var(--sec-space-6);
    border-top: 1px solid var(--sec-line-soft);
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--sec-text-muted);
    font-family: var(--sec-font-mono);
    font-size: var(--sec-fs-xs);
  }
  @media (max-width: 860px) {
    .inner { grid-template-columns: 1fr 1fr; }
    .bottom { flex-direction: column; align-items: flex-start; gap: var(--sec-space-2); }
  }
`);
/** `<sec-footer col-1-title="…" col-2-title="…" col-3-title="…">` with `slot="brand"` and
 *  `slot="col-1"`/`slot="col-2"`/`slot="col-3"` links, plus a default slot for the bottom-left
 *  copyright line and `slot="bottom-right"` for a trailing badge. */
export class SecFooter extends SecElement {
    static { this.observedAttributes = ["col-1-title", "col-2-title", "col-3-title"]; }
    render() {
        this.adopt(css);
        const t1 = this.getAttribute("col-1-title") ?? "";
        const t2 = this.getAttribute("col-2-title") ?? "";
        const t3 = this.getAttribute("col-3-title") ?? "";
        this.root.innerHTML = `
      <div class="inner" part="inner">
        <slot name="brand"></slot>
        <div><p class="col-title">${t1}</p><slot name="col-1"></slot></div>
        <div><p class="col-title">${t2}</p><slot name="col-2"></slot></div>
        <div><p class="col-title">${t3}</p><slot name="col-3"></slot></div>
      </div>
      <div class="bottom" part="bottom">
        <slot></slot>
        <slot name="bottom-right"></slot>
      </div>
    `;
    }
}
customElements.define("sec-footer", SecFooter);
//# sourceMappingURL=footer.js.map