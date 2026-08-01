/** Shared reactive base for sec-ui custom elements. Shadow DOM + adopted stylesheets
 *  for style encapsulation; design tokens still reach in because custom properties
 *  inherit through shadow boundaries. No global store — state lives on attributes/
 *  properties, communication out is plain CustomEvents. */
export class SecElement extends HTMLElement {
    constructor() {
        super();
        this.didRender = false;
        this.root = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
        if (!this.didRender) {
            this.didRender = true;
            this.render();
        }
    }
    attributeChangedCallback() {
        if (this.didRender)
            this.render();
    }
    $(sel) {
        return this.root.querySelector(sel);
    }
    $$(sel) {
        return Array.from(this.root.querySelectorAll(sel));
    }
    emit(name, detail) {
        this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
    }
    adopt(sheet) {
        this.root.adoptedStyleSheets = [sheet];
    }
}
/** Builds a CSSStyleSheet once per module (call at module scope) and shares it across
 *  every instance via adoptedStyleSheets, instead of paying for a fresh <style> per element. */
export function sheet(cssText) {
    const s = new CSSStyleSheet();
    s.replaceSync(cssText);
    return s;
}
export function esc(s) {
    return String(s ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
//# sourceMappingURL=base-element.js.map