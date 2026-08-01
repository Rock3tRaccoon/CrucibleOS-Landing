import { SecElement } from "../base-element.js";
/** `<sec-badge icon="shield">Eyebrow label</sec-badge>` — small angular tag used above hero
 *  headings, with a glyph (shield by default, echoing the crest mark) and a slow shimmer sweep.
 *  Set `icon` to any key in `icons` (e.g. `icon="rust"`) to swap it per-instance without affecting
 *  every other badge on the site. For a site-specific raster/complex-vector brand mark that can't
 *  be expressed as a `currentColor` icon (sec-ui itself stays asset-free and site-agnostic), set
 *  `icon-src` to an image URL instead — it takes priority over `icon` when both are present. */
export declare class SecBadge extends SecElement {
    static observedAttributes: string[];
    render(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "sec-badge": SecBadge;
    }
}
