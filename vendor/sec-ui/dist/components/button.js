import { SecElement, sheet } from "../base-element.js";
const css = sheet(`
  :host { display: inline-block; }
  a, button {
    all: unset;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--sec-space-2);
    font-family: var(--sec-font-sans);
    font-size: var(--sec-fs-sm);
    font-weight: 500;
    letter-spacing: 0.01em;
    padding: 11px 22px;
    border-radius: var(--sec-radius-sm);
    border: 1px solid transparent;
    cursor: pointer;
    white-space: nowrap;
    transition: background var(--sec-transition-fast), border-color var(--sec-transition-fast),
      color var(--sec-transition-fast), box-shadow var(--sec-transition-fast), transform var(--sec-transition-fast);
  }
  a:active, button:active { transform: translateY(1px); }
  :host([size="sm"]) a, :host([size="sm"]) button { padding: 8px 16px; font-size: var(--sec-fs-xs); }

  /* diagonal shine sweep on hover */
  a::after, button::after {
    content: "";
    position: absolute;
    inset: 0 auto 0 -60%;
    width: 40%;
    background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.35), transparent);
    transform: skewX(-20deg);
    transition: left 0.5s var(--sec-ease);
    pointer-events: none;
  }
  a:hover::after, button:hover::after { left: 120%; }
  @media (prefers-reduced-motion: reduce) {
    a::after, button::after { display: none; }
  }

  .primary {
    background: var(--sec-accent);
    color: var(--sec-text-inverse);
  }
  .primary:hover { background: var(--sec-accent-hover); }
  .primary:active { background: var(--sec-accent-press); }

  .secondary {
    background: transparent;
    border-color: var(--sec-line-strong);
    color: var(--sec-text);
  }
  .secondary:hover { border-color: var(--sec-accent-line); color: var(--sec-accent); }

  .ghost {
    background: transparent;
    color: var(--sec-text-secondary);
  }
  .ghost:hover { color: var(--sec-text); background: rgba(255, 255, 255, 0.04); }

  .danger {
    background: transparent;
    border-color: rgba(250, 77, 86, 0.4);
    color: var(--sec-danger);
  }
  .danger:hover { background: rgba(250, 77, 86, 0.1); }

  :host([disabled]) a, :host([disabled]) button {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }

  .icon { display: inline-flex; }
  ::slotted(*) { pointer-events: none; }
`);
/** `<sec-button variant="primary|secondary|ghost|danger" size="md|sm" href="" view="" disabled type="button|submit">` */
export class SecButton extends SecElement {
    static { this.observedAttributes = ["variant", "size", "disabled", "href", "view", "type"]; }
    connectedCallback() {
        super.connectedCallback();
    }
    render() {
        this.adopt(css);
        const variant = this.getAttribute("variant") || "secondary";
        const href = this.getAttribute("href");
        const view = this.getAttribute("view");
        const disabled = this.hasAttribute("disabled");
        const type = this.getAttribute("type") || "button";
        if (href || view) {
            this.root.innerHTML = `<a class="${variant}" part="control" href="${href ?? view}" ${view ? `view="${view}"` : ""}><slot></slot></a>`;
        }
        else {
            this.root.innerHTML = `<button class="${variant}" part="control" type="${type}" ${disabled ? "disabled" : ""}><slot></slot></button>`;
        }
    }
}
customElements.define("sec-button", SecButton);
//# sourceMappingURL=button.js.map