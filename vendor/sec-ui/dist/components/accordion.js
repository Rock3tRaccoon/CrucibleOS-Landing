import { SecElement, sheet } from "../base-element.js";
import { icons } from "../icons.js";
const itemCss = sheet(`
  :host { display: block; border-bottom: 1px solid var(--sec-line); }
  button.head {
    all: unset;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sec-space-4);
    width: 100%;
    padding: var(--sec-space-4) var(--sec-space-2);
    cursor: pointer;
    font-family: var(--sec-font-sans);
    font-size: var(--sec-fs-body-lg);
    font-weight: 500;
    color: var(--sec-text);
  }
  button.head:hover { color: var(--sec-accent); }
  .chev { color: var(--sec-text-muted); transition: transform var(--sec-transition-med); flex: none; }
  :host([open]) .chev { transform: rotate(180deg); color: var(--sec-accent); }
  .panel {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows var(--sec-transition-med);
  }
  :host([open]) .panel { grid-template-rows: 1fr; }
  .panel-inner { overflow: hidden; }
  .body {
    padding: 0 var(--sec-space-2) var(--sec-space-4);
    color: var(--sec-text-secondary);
    line-height: var(--sec-lh-body);
  }
`);
/** `<sec-accordion-item heading="…" open>body</sec-accordion-item>` */
export class SecAccordionItem extends SecElement {
    static { this.observedAttributes = ["heading", "open"]; }
    render() {
        this.adopt(itemCss);
        const heading = this.getAttribute("heading") ?? "";
        const open = this.hasAttribute("open");
        this.root.innerHTML = `
      <button class="head" part="head" aria-expanded="${open}">
        <span>${heading}</span>
        <span class="chev">${icons.chevronDown}</span>
      </button>
      <div class="panel"><div class="panel-inner"><div class="body"><slot></slot></div></div></div>
    `;
        this.$("button.head").addEventListener("click", () => {
            this.toggleAttribute("open");
            this.emit("sec-toggle", { open: this.hasAttribute("open") });
        });
    }
}
const groupCss = sheet(`
  :host { display: block; border-top: 1px solid var(--sec-line); }
`);
/** `<sec-accordion>` — container; children are `<sec-accordion-item>`s (closes siblings on open if `single`). */
export class SecAccordion extends SecElement {
    static { this.observedAttributes = ["single"]; }
    render() {
        this.adopt(groupCss);
        this.root.innerHTML = `<slot></slot>`;
        if (this.hasAttribute("single")) {
            this.addEventListener("sec-toggle", ((e) => {
                const opened = e.target;
                if (!e.detail?.open)
                    return;
                this.querySelectorAll("sec-accordion-item").forEach((item) => {
                    if (item !== opened)
                        item.removeAttribute("open");
                });
            }));
        }
    }
}
customElements.define("sec-accordion-item", SecAccordionItem);
customElements.define("sec-accordion", SecAccordion);
//# sourceMappingURL=accordion.js.map