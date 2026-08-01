import { SecElement } from "../base-element.js";
/** `<sec-plate-badge>Eyebrow label</sec-plate-badge>` — a stamped steel-plate tag with a
 *  bolt-head glyph and rivet corners. The industrial counterpart to sec-badge's shield-tag. */
export declare class SecPlateBadge extends SecElement {
    render(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "sec-plate-badge": SecPlateBadge;
    }
}
