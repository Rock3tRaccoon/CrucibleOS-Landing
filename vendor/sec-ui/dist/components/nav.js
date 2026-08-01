import { SecElement, sheet } from "../base-element.js";
import { icons } from "../icons.js";
const css = sheet(`
  :host {
    display: block;
    position: sticky;
    top: 0;
    z-index: 40;
    height: var(--sec-header-h);
  }
  .bar {
    height: var(--sec-header-h);
    display: flex;
    align-items: center;
    background: rgba(5, 7, 10, 0.92);
    border-bottom: 1px solid var(--sec-line);
    box-shadow: 0 0 0 rgba(0, 0, 0, 0);
    transition: box-shadow var(--sec-transition-med), border-color var(--sec-transition-med);
  }
  :host([scrolled]) .bar {
    border-color: var(--sec-line-strong);
    box-shadow: 0 12px 24px -12px rgba(0, 0, 0, 0.6);
  }
  /* backdrop-filter creates a containing block for fixed-position descendants, which would
     hijack the mobile drawer's (position: fixed) coordinate space — so only blur on desktop,
     where nav.links is laid out inline rather than fixed. */
  @media (min-width: 861px) {
    .bar {
      background: rgba(5, 7, 10, 0.72);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }
  }
  .inner {
    width: 100%;
    box-sizing: border-box;
    padding: 0 var(--sec-space-8);
    display: flex;
    align-items: center;
    gap: var(--sec-space-6);
  }
  .brand {
    display: flex;
    align-items: center;
    margin-right: auto;
  }
  ::slotted([slot="brand"]) {
    display: flex !important;
    align-items: center;
    gap: var(--sec-space-3);
    color: var(--sec-text);
    text-decoration: none;
    font-family: var(--sec-font-sans);
    font-weight: 600;
    font-size: 1.375rem;
    letter-spacing: 0.01em;
    white-space: nowrap;
  }
  nav.links {
    display: flex;
    align-items: center;
    gap: var(--sec-space-6);
  }
  ::slotted([slot="links"]) {
    color: var(--sec-text-secondary);
    text-decoration: none;
    font-size: var(--sec-fs-body);
    font-weight: 500;
    letter-spacing: 0.01em;
    white-space: nowrap;
    transition: color var(--sec-transition-fast);
  }
  ::slotted([slot="links"]:hover) { color: var(--sec-text); }
  ::slotted([slot="links"][aria-current="page"]) { color: var(--sec-accent); }
  .cta { display: flex; align-items: center; }
  .burger {
    all: unset;
    display: none;
    color: var(--sec-text);
    cursor: pointer;
    padding: var(--sec-space-2);
  }
  .scrim {
    display: none;
    position: fixed;
    inset: var(--sec-header-h) 0 0 0;
    background: var(--sec-overlay);
    z-index: 39;
  }

  @media (max-width: 860px) {
    .inner { padding: 0 var(--sec-space-4); }
    .burger { display: inline-flex; }
    .cta { display: none; }
    nav.links {
      position: fixed;
      top: var(--sec-header-h);
      right: 0;
      bottom: 0;
      width: min(78vw, 320px);
      background: var(--sec-bg-1);
      border-left: 1px solid var(--sec-line);
      flex-direction: column;
      align-items: flex-start;
      gap: 0;
      padding: var(--sec-space-4);
      transform: translateX(100%);
      transition: transform var(--sec-transition-med);
      z-index: 40;
    }
    :host([menu-open]) nav.links { transform: translateX(0); }
    :host([menu-open]) .scrim { display: block; }
    ::slotted([slot="links"]) {
      width: 100%;
      padding: var(--sec-space-3) var(--sec-space-2);
      border-bottom: 1px solid var(--sec-line-soft);
    }
  }
`);
/** `<sec-nav>` app header shell — brand/links/cta named slots hold real light-DOM `<a view="…">`
 *  elements so the app's router keeps intercepting clicks normally; this just supplies layout,
 *  the sticky glass bar, and a mobile off-canvas drawer for the links slot. */
export class SecNav extends SecElement {
    static { this.observedAttributes = ["menu-open"]; }
    #onScroll = (e) => {
        const t = e.target;
        const top = t === document ? (document.scrollingElement?.scrollTop ?? 0) : t.scrollTop;
        this.toggleAttribute("scrolled", top > 8);
    };
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener("scroll", this.#onScroll, true);
    }
    disconnectedCallback() {
        document.removeEventListener("scroll", this.#onScroll, true);
    }
    render() {
        this.adopt(css);
        this.root.innerHTML = `
      <div class="bar" part="bar">
        <div class="inner">
          <div class="brand"><slot name="brand"></slot></div>
          <nav class="links" part="links"><slot name="links"></slot></nav>
          <div class="cta"><slot name="cta"></slot></div>
          <button class="burger" part="burger" aria-label="Toggle menu">${icons.menu}</button>
        </div>
      </div>
      <div class="scrim" part="scrim"></div>
    `;
        const close = () => this.removeAttribute("menu-open");
        this.$(".burger").addEventListener("click", () => this.toggleAttribute("menu-open"));
        this.$(".scrim").addEventListener("click", close);
        this.$("nav.links").addEventListener("click", (e) => {
            if (e.target.closest("a"))
                close();
        });
    }
}
customElements.define("sec-nav", SecNav);
//# sourceMappingURL=nav.js.map