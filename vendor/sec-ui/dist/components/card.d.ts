import { SecElement } from "../base-element.js";
/** `<sec-card interactive href="" view=""><span slot="icon">…</span><h3 slot="title">…</h3>body</sec-card>`
 *
 *  `view="/path"` needs no extra wiring: the host element itself carries the attribute, and the
 *  app's global delegated `[view]` click handler already matches on the (shadow-retargeted) host.
 *  `href="https://…"` is for whole-card external links, handled locally since it's a full navigation. */
export declare class SecCard extends SecElement {
    static observedAttributes: string[];
    render(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "sec-card": SecCard;
    }
}
