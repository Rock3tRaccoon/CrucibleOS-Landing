import { SecElement } from "../base-element.js";
/** `<sec-reveal-text text="Infrastructure Incubator Holding Company"></sec-reveal-text>` — each
 *  word wipes into view left-to-right, staggered, like a plotter/shutter opening. The
 *  professional/industrial counterpart to sec-decode-text's matrix scramble — same idea (an
 *  animated headline reveal), different register: precise and mechanical, not "hacker terminal". */
export declare class SecRevealText extends SecElement {
    static observedAttributes: string[];
    render(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "sec-reveal-text": SecRevealText;
    }
}
