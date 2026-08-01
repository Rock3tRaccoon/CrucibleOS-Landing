import { SecElement } from "../base-element.js";
/** `<sec-forge-seam>` — a thin glowing "molten seam" line: a bright hotspot drifts back and
 *  forth along an accent-colored base line. Drop-in replacement for a plain accent-line div in
 *  section headers/dividers, giving every section break the same forge-heated texture instead
 *  of a static bar. Sizing (width/height) is left entirely to the consumer's own layout CSS on
 *  the host element, same as the plain div it replaces. */
export declare class SecForgeSeam extends SecElement {
    render(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "sec-forge-seam": SecForgeSeam;
    }
}
