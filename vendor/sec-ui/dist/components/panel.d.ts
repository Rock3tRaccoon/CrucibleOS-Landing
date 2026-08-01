import { SecElement } from "../base-element.js";
/** `<sec-panel interactive href="" view=""><span slot="icon">…</span><h3 slot="title">…</h3>body</sec-panel>`
 *  A flat, solid "bolted steel plate" card — no glass blur, no glow, no cursor spotlight.
 *  For institutional/industrial brand contexts where sec-card's glass-and-neon look is wrong. */
export declare class SecPanel extends SecElement {
    static observedAttributes: string[];
    render(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "sec-panel": SecPanel;
    }
}
