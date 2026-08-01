import { SecElement } from "../base-element.js";
/** `<sec-nav>` app header shell — brand/links/cta named slots hold real light-DOM `<a view="…">`
 *  elements so the app's router keeps intercepting clicks normally; this just supplies layout,
 *  the sticky glass bar, and a mobile off-canvas drawer for the links slot. */
export declare class SecNav extends SecElement {
    #private;
    static observedAttributes: string[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "sec-nav": SecNav;
    }
}
