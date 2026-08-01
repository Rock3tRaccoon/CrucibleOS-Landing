import { SecElement } from "../base-element.js";
/** `<sec-accordion-item heading="…" open>body</sec-accordion-item>` */
export declare class SecAccordionItem extends SecElement {
    static observedAttributes: string[];
    render(): void;
}
/** `<sec-accordion>` — container; children are `<sec-accordion-item>`s (closes siblings on open if `single`). */
export declare class SecAccordion extends SecElement {
    static observedAttributes: string[];
    render(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "sec-accordion-item": SecAccordionItem;
        "sec-accordion": SecAccordion;
    }
}
