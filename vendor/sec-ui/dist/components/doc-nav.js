import { SecElement, sheet } from "../base-element.js";
const css = sheet(`
  :host { display: block; }
  nav {
    position: sticky;
    top: calc(var(--sec-header-h) + var(--sec-space-5));
    display: flex;
    flex-direction: column;
    gap: 2px;
    border-left: 1px solid var(--sec-line);
    padding-left: var(--sec-space-4);
  }
  ::slotted(a) {
    position: relative;
    display: block;
    padding: var(--sec-space-1) 0;
    color: var(--sec-text-secondary);
    text-decoration: none;
    font-size: var(--sec-fs-sm);
    transition: color var(--sec-transition-fast);
  }
  ::slotted(a:hover) { color: var(--sec-text); }
  ::slotted(a[aria-current="true"]) { color: var(--sec-accent); font-weight: 500; }
`);
/** `<sec-doc-nav>` wraps light-DOM `<a href="#section-id">Label</a>` links — tracks which linked
 *  section is currently in view (via IntersectionObserver on those ids in the host document) and
 *  marks the active link `aria-current="true"`. A reusable sticky table-of-contents primitive
 *  for any docs page, not tied to CrucibleOS specifically. */
export class SecDocNav extends SecElement {
    #io;
    render() {
        this.adopt(css);
        this.root.innerHTML = `<nav part="nav"><slot></slot></nav>`;
        this.#observe();
    }
    disconnectedCallback() {
        this.#io?.disconnect();
    }
    #observe() {
        this.#io?.disconnect();
        const links = Array.from(this.querySelectorAll("a[href^='#']"));
        const targets = links
            .map((a) => {
            const id = a.getAttribute("href").slice(1);
            const el = document.getElementById(id);
            return el ? { a, el } : null;
        })
            .filter((v) => v !== null);
        if (targets.length === 0)
            return;
        this.#io = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting)
                    continue;
                const hit = targets.find((t) => t.el === entry.target);
                if (hit) {
                    links.forEach((a) => a.removeAttribute("aria-current"));
                    hit.a.setAttribute("aria-current", "true");
                }
            }
        }, { rootMargin: "-15% 0px -70% 0px", threshold: 0 });
        targets.forEach((t) => this.#io.observe(t.el));
    }
}
customElements.define("sec-doc-nav", SecDocNav);
//# sourceMappingURL=doc-nav.js.map