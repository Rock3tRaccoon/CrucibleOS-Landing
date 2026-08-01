import { SecElement } from "../base-element.js";
/** `<sec-blueprint-field density="1">` — a fixed technical/schematic backdrop: a fine
 *  drafting grid with sparse structural connection nodes linked by orthogonal (not
 *  diagonal) lines, gently pulsing. Nodes stay put — this is a blueprint, not a network
 *  diagram — which is the point of contrast with sec-network-field's organic drift.
 *  Pauses off-screen and renders a single static frame under reduced-motion. */
export declare class SecBlueprintField extends SecElement {
    #private;
    static observedAttributes: string[];
    render(): void;
    disconnectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "sec-blueprint-field": SecBlueprintField;
    }
}
