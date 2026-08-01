import { SecElement } from "../base-element.js";
/** `<sec-impact-text text="…">` — a heavier headline reveal than sec-reveal-text's wipe or
 *  sec-decode-text's scramble: words punch in from a blurred, scaled-up, flash-lit state and
 *  settle, all in a tight stagger — meant to feel like a single heavy impact, not a delicate
 *  animation. Built for CrucibleOS's "frontline of the cyber war" register. */
export declare class SecImpactText extends SecElement {
    static observedAttributes: string[];
    render(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "sec-impact-text": SecImpactText;
    }
}
