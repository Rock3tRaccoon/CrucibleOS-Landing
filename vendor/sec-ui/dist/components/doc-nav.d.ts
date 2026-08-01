import { SecElement } from "../base-element.js";
/** `<sec-doc-nav>` wraps light-DOM `<a href="#section-id">Label</a>` links — tracks which linked
 *  section is currently in view (via IntersectionObserver on those ids in the host document) and
 *  marks the active link `aria-current="true"`. A reusable sticky table-of-contents primitive
 *  for any docs page, not tied to CrucibleOS specifically. */
export declare class SecDocNav extends SecElement {
    #private;
    render(): void;
    disconnectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "sec-doc-nav": SecDocNav;
    }
}
