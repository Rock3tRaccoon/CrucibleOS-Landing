/** Shared reactive base for sec-ui custom elements. Shadow DOM + adopted stylesheets
 *  for style encapsulation; design tokens still reach in because custom properties
 *  inherit through shadow boundaries. No global store — state lives on attributes/
 *  properties, communication out is plain CustomEvents. */
export declare abstract class SecElement extends HTMLElement {
    protected root: ShadowRoot;
    private didRender;
    constructor();
    connectedCallback(): void;
    attributeChangedCallback(): void;
    protected abstract render(): void;
    protected $<T extends Element = HTMLElement>(sel: string): T | null;
    protected $$<T extends Element = HTMLElement>(sel: string): T[];
    protected emit<T = unknown>(name: string, detail?: T): void;
    protected adopt(sheet: CSSStyleSheet): void;
}
/** Builds a CSSStyleSheet once per module (call at module scope) and shares it across
 *  every instance via adoptedStyleSheets, instead of paying for a fresh <style> per element. */
export declare function sheet(cssText: string): CSSStyleSheet;
export declare function esc(s: unknown): string;
