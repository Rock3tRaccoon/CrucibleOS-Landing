import { SecElement } from "../base-element.js";
/** `<sec-callout variant="note|success|warning|danger" label="Custom label">…</sec-callout>` — an
 *  admonition box for docs content. Built for CrucibleOS's docs specifically to separate what's
 *  demonstrated today from what's still roadmap, but generic enough for any docs page. */
export declare class SecCallout extends SecElement {
    static observedAttributes: string[];
    render(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "sec-callout": SecCallout;
    }
}
