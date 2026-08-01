import { SecElement, sheet } from "../base-element.js";
import { icons } from "../icons.js";
const css = sheet(`
  :host { display: block; }
  .callout {
    display: flex;
    gap: var(--sec-space-3);
    padding: var(--sec-space-4);
    border: 1px solid var(--sec-line);
    border-left: 3px solid var(--sec-text-muted);
    border-radius: var(--sec-radius-md);
    background: rgba(255, 255, 255, 0.02);
  }
  .icon { flex: none; color: var(--sec-text-muted); margin-top: 2px; }
  .content { color: var(--sec-text-secondary); line-height: var(--sec-lh-body); font-size: var(--sec-fs-sm); }
  ::slotted(p) { margin: var(--sec-space-2) 0 0; }
  ::slotted(p:first-child) { margin-top: 0; }
  .label {
    display: block;
    font-family: var(--sec-font-mono);
    font-size: var(--sec-fs-xs);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: inherit;
  }

  :host([variant="note"]) .callout { border-left-color: var(--sec-accent); }
  :host([variant="note"]) .icon, :host([variant="note"]) .label { color: var(--sec-accent); }

  :host([variant="success"]) .callout { border-left-color: var(--sec-success); }
  :host([variant="success"]) .icon, :host([variant="success"]) .label { color: var(--sec-success); }

  :host([variant="warning"]) .callout { border-left-color: var(--sec-warning); }
  :host([variant="warning"]) .icon, :host([variant="warning"]) .label { color: var(--sec-warning); }

  :host([variant="danger"]) .callout { border-left-color: var(--sec-danger); }
  :host([variant="danger"]) .icon, :host([variant="danger"]) .label { color: var(--sec-danger); }
`);
const ICON_BY_VARIANT = {
    note: icons.info,
    success: icons.check,
    warning: icons.warning,
    danger: icons.danger,
};
const LABEL_BY_VARIANT = {
    note: "Note",
    success: "Demonstrated Today",
    warning: "Caution",
    danger: "Not Yet Available",
};
/** `<sec-callout variant="note|success|warning|danger" label="Custom label">…</sec-callout>` — an
 *  admonition box for docs content. Built for CrucibleOS's docs specifically to separate what's
 *  demonstrated today from what's still roadmap, but generic enough for any docs page. */
export class SecCallout extends SecElement {
    static { this.observedAttributes = ["variant", "label"]; }
    render() {
        this.adopt(css);
        const variant = this.getAttribute("variant") ?? "note";
        const label = this.getAttribute("label") ?? LABEL_BY_VARIANT[variant] ?? "Note";
        const icon = ICON_BY_VARIANT[variant] ?? icons.info;
        this.root.innerHTML = `
      <div class="callout" part="callout">
        <span class="icon">${icon}</span>
        <div class="content">
          <span class="label">${label}</span>
          <slot></slot>
        </div>
      </div>
    `;
    }
}
customElements.define("sec-callout", SecCallout);
//# sourceMappingURL=callout.js.map