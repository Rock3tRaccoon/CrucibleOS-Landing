import { SecElement } from "../base-element.js";
/** `<sec-hull-field>` — massive, dim, angular silhouettes at three depths, fogged into the
 *  background, drifting almost imperceptibly slowly. Meant to read the way a capital ship's
 *  hull reads looming out of the dark: scale and weight first, detail never. Layered ambient
 *  backdrop, not a focal graphic — pair with foreground content, not standalone. */
export declare class SecHullField extends SecElement {
    render(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "sec-hull-field": SecHullField;
    }
}
