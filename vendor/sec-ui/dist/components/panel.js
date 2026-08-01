import { SecElement, sheet } from "../base-element.js";
const css = sheet(`
  :host { display: block; }
  .panel {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--sec-space-3);
    height: 100%;
    padding: var(--sec-space-5);
    padding-top: calc(var(--sec-space-5) + 3px);
    border: 1px solid var(--sec-line-strong);
    border-top: none;
    background: var(--sec-bg-2);
    box-sizing: border-box;
    transition: border-color var(--sec-transition-med), transform var(--sec-transition-med);
  }
  .top-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--sec-accent);
    opacity: 0.7;
    transition: opacity var(--sec-transition-med);
  }
  :host([interactive]) .panel { cursor: pointer; }
  .panel:hover {
    border-color: var(--sec-line-strong);
    transform: translateY(-2px);
  }
  .panel:hover .top-bar { opacity: 1; }

  .rivet {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--sec-bg-0);
    border: 1px solid var(--sec-line-strong);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
  }
  .rivet.tl { top: 8px; left: 8px; }
  .rivet.tr { top: 8px; right: 8px; }
  .rivet.bl { bottom: 8px; left: 8px; }
  .rivet.br { bottom: 8px; right: 8px; }

  ::slotted([slot="icon"]) { color: var(--sec-accent); }
  .heading {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--sec-space-3);
  }
  ::slotted([slot="title"]) {
    font-family: var(--sec-font-sans);
    font-size: var(--sec-fs-h3);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: var(--sec-text);
    margin: 0;
  }
`);
/** `<sec-panel interactive href="" view=""><span slot="icon">…</span><h3 slot="title">…</h3>body</sec-panel>`
 *  A flat, solid "bolted steel plate" card — no glass blur, no glow, no cursor spotlight.
 *  For institutional/industrial brand contexts where sec-card's glass-and-neon look is wrong. */
export class SecPanel extends SecElement {
    static { this.observedAttributes = ["href", "view"]; }
    render() {
        this.adopt(css);
        const href = this.getAttribute("href");
        const view = this.getAttribute("view");
        if ((href || view) && !this.hasAttribute("interactive"))
            this.setAttribute("interactive", "");
        this.root.innerHTML = `
      <div class="panel" part="panel">
        <span class="top-bar"></span>
        <span class="rivet tl"></span>
        <span class="rivet tr"></span>
        <span class="rivet bl"></span>
        <span class="rivet br"></span>
        <div class="heading">
          <slot name="icon"></slot>
          <slot name="title"></slot>
        </div>
        <slot></slot>
      </div>
    `;
        if (href) {
            const panel = this.$(".panel");
            panel.addEventListener("click", (e) => {
                if (e.target.closest("a,button"))
                    return;
                window.open(href, "_blank", "noopener");
            });
        }
    }
}
customElements.define("sec-panel", SecPanel);
//# sourceMappingURL=panel.js.map