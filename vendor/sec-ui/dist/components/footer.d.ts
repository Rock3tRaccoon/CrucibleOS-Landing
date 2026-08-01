import { SecElement } from "../base-element.js";
/** `<sec-footer col-1-title="…" col-2-title="…" col-3-title="…">` with `slot="brand"` and
 *  `slot="col-1"`/`slot="col-2"`/`slot="col-3"` links, plus a default slot for the bottom-left
 *  copyright line and `slot="bottom-right"` for a trailing badge. */
export declare class SecFooter extends SecElement {
    static observedAttributes: string[];
    render(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "sec-footer": SecFooter;
    }
}
