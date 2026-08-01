import { SecElement } from "../base-element.js";
/** `<sec-decode-text text="Pioneering Systems Security Research"></sec-decode-text>` — headline
 *  characters scramble through random glyphs before resolving left-to-right, matrix/terminal
 *  style. Real text stays in the DOM for a11y; the animated copy is `aria-hidden`. Skips
 *  straight to final text under reduced-motion. */
export declare class SecDecodeText extends SecElement {
    #private;
    static observedAttributes: string[];
    render(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "sec-decode-text": SecDecodeText;
    }
}
