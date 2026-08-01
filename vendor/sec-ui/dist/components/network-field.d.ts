import { SecElement } from "../base-element.js";
/** `<sec-network-field density="1">` — an animated node/edge "telemetry network" backdrop.
 *  Nodes drift and gently part around the cursor; pauses off-screen and renders a single
 *  static frame under reduced-motion. Meant to sit behind real content in stacking order —
 *  it only intercepts clicks in the empty space it actually covers. */
export declare class SecNetworkField extends SecElement {
    #private;
    static observedAttributes: string[];
    render(): void;
    disconnectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "sec-network-field": SecNetworkField;
    }
}
