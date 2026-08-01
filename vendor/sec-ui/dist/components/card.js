import { SecElement, sheet } from "../base-element.js";
const css = sheet(`
  :host { display: block; }
  .card {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--sec-space-3);
    height: 100%;
    padding: var(--sec-space-5);
    border-radius: var(--sec-radius-lg);
    border: 1px solid var(--sec-line);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.025), rgba(255, 255, 255, 0.008));
    box-shadow: var(--sec-shadow-card);
    transition: border-color var(--sec-transition-med), transform var(--sec-transition-med);
    box-sizing: border-box;
    overflow: hidden;
  }

  /* cursor-tracked spotlight, positioned via --mx/--my set on pointermove */
  .card::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), var(--sec-accent-subtle), transparent 70%);
    opacity: 0;
    transition: opacity var(--sec-transition-med);
    pointer-events: none;
  }
  .card:hover::before { opacity: 1; }

  /* targeting-reticle corner brackets */
  .bracket {
    position: absolute;
    width: 16px;
    height: 16px;
    border: 2px solid var(--sec-accent);
    opacity: 0;
    transition: opacity var(--sec-transition-med), transform var(--sec-transition-med);
    pointer-events: none;
  }
  .bracket.tl { top: -1px; left: -1px; border-right: none; border-bottom: none; transform: translate(4px, 4px); }
  .bracket.tr { top: -1px; right: -1px; border-left: none; border-bottom: none; transform: translate(-4px, 4px); }
  .bracket.bl { bottom: -1px; left: -1px; border-right: none; border-top: none; transform: translate(4px, -4px); }
  .bracket.br { bottom: -1px; right: -1px; border-left: none; border-top: none; transform: translate(-4px, -4px); }
  .card:hover .bracket {
    opacity: 1;
    transform: translate(0, 0);
  }

  :host([interactive]) .card { cursor: pointer; }
  .card:hover {
    border-color: var(--sec-accent-line);
    transform: translateY(-3px);
  }
  ::slotted([slot="icon"]) {
    color: var(--sec-accent);
  }
  .heading {
    display: flex;
    align-items: center;
    gap: var(--sec-space-3);
    position: relative;
  }
  ::slotted([slot="title"]) {
    font-family: var(--sec-font-sans);
    font-size: var(--sec-fs-h3);
    font-weight: 600;
    color: var(--sec-text);
    margin: 0;
  }
`);
/** `<sec-card interactive href="" view=""><span slot="icon">…</span><h3 slot="title">…</h3>body</sec-card>`
 *
 *  `view="/path"` needs no extra wiring: the host element itself carries the attribute, and the
 *  app's global delegated `[view]` click handler already matches on the (shadow-retargeted) host.
 *  `href="https://…"` is for whole-card external links, handled locally since it's a full navigation. */
export class SecCard extends SecElement {
    static { this.observedAttributes = ["href", "view"]; }
    render() {
        this.adopt(css);
        const href = this.getAttribute("href");
        const view = this.getAttribute("view");
        if ((href || view) && !this.hasAttribute("interactive"))
            this.setAttribute("interactive", "");
        this.root.innerHTML = `
      <div class="card" part="card">
        <span class="bracket tl"></span>
        <span class="bracket tr"></span>
        <span class="bracket bl"></span>
        <span class="bracket br"></span>
        <div class="heading">
          <slot name="icon"></slot>
          <slot name="title"></slot>
        </div>
        <slot></slot>
      </div>
    `;
        const card = this.$(".card");
        card.addEventListener("pointermove", (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty("--mx", `${(e.clientX - rect.left) / rect.width * 100}%`);
            card.style.setProperty("--my", `${(e.clientY - rect.top) / rect.height * 100}%`);
        });
        if (href) {
            card.addEventListener("click", (e) => {
                if (e.target.closest("a,button"))
                    return;
                window.open(href, "_blank", "noopener");
            });
        }
    }
}
customElements.define("sec-card", SecCard);
//# sourceMappingURL=card.js.map