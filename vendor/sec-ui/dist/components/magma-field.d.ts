import { SecElement } from "../base-element.js";
/** `<sec-magma-field points="24">` — a page-wide cellular (Worley) noise crack texture,
 *  computed by forge-core's MagmaSim (Rust → WebAssembly): F2-F1 distance-to-feature-points
 *  gives a continuous crack-boundary field rather than a set of drawn lines, the same technique
 *  behind most procedural cracked-earth/lava textures.
 *
 *  Performance rests on one fact: the feature points never move (real cracked rock doesn't —
 *  only its heat does), so the expensive nearest/second-nearest search is *static geometry*,
 *  cached once in Rust at seed/resize time. Per-frame `tick()` is just a cheap cached lookup and
 *  a heat blend, which is what makes a genuinely high sample resolution (native device pixels,
 *  ~8px cells) affordable — cost doesn't scale with point count per frame, only once on load or
 *  resize. Color blending happens in Rust too; the host's per-frame work is a single
 *  `ImageData.data.set()` and one `putImageData` call.
 *
 *  Rendered at the compute grid's native resolution (device-pixel-scaled), with no CSS blur
 *  filter — measured to be the single largest cost in this component (a full-viewport blur
 *  convolution recomputed every frame), and no longer earning its keep once the grid stopped
 *  being deliberately blocky: the exponential crack falloff is already soft, and putImageData
 *  gives per-pixel precision at this resolution instead of upscaling a coarse grid. Feature
 *  points are fixed once seeded; a pointer-proximity boost warms nearby ground. Meant to be
 *  mounted ONCE at the app shell (e.g. root-v), positioned fixed and
 *  full-viewport with a negative z-index, so it persists across route changes rather than being
 *  recreated per page like sec-ember-field. No IntersectionObserver pause: a fixed, inset:0
 *  layer is always "on screen" by definition — reduced-motion renders one static frame with no
 *  pointer-tracking instead. */
export declare class SecMagmaField extends SecElement {
    #private;
    static observedAttributes: string[];
    render(): void;
    disconnectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "sec-magma-field": SecMagmaField;
    }
}
