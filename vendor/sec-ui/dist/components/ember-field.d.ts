import { SecElement } from "../base-element.js";
/** `<sec-ember-field density="1">` — slow-rising embers drifting up out of the dark, like
 *  debris still hanging in the air after impact. Particle motion is computed by forge-core's
 *  EmberSim (Rust, compiled to WebAssembly) — this component just ticks it and paints the
 *  result to canvas. Deliberately heavy and slow, not playful — the atmospheric counterpart to
 *  sec-blueprint-field's technical grid. Pauses off-screen and renders a single static frame
 *  under reduced-motion. */
export declare class SecEmberField extends SecElement {
    #private;
    static observedAttributes: string[];
    render(): void;
    disconnectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "sec-ember-field": SecEmberField;
    }
}
