import { SecElement } from "../base-element.js";
/** `<sec-siege-field>` — a real Rust/WASM simulation of a capability delegation tree (the same
 *  System / Admin / Application / Sandboxed domains documented on the Security page) under
 *  continuous attack, rendered in the same forge/molten visual language as the rest of the site
 *  rather than as a generic node-link graph:
 *
 *  - Nodes are hexagonal seals (the site's own hex mark), not circles.
 *  - Edges are glowing conduits, not flat lines.
 *  - Attacks are white-hot sparks flying in from outside the tree on a glowing tail — most simply
 *    shatter into a small ember shower on arrival (deflected, nothing to escalate through). A rare
 *    few (`forge-core`'s `COMPROMISE_CHANCE`) actually connect: a stepped, jittering glitch burst
 *    marks the hit — not an expanding pulse, since this is corruption, not an impact — and the
 *    target node visibly turns: chromatic-aberration ghosting, a jittery stepped stutter in place,
 *    the odd bright scan-bar fleck, and jagged tendrils probing its graph neighbors, redrawn on the
 *    same stepped clock as the node itself so the whole thing reads as one unstable signal. Every
 *    jump is stepped, not eased — a smooth pulse reads as "alive"; this needs to read as "wrong."
 *    Nothing ever actually spreads down a tendril; it's what the node looks like while its state
 *    can no longer be trusted, not a real escalation path.
 *  - After a brief window (`COMPROMISE_DURATION`) the capability model's own integrity check catches
 *    it — a capability missing from where the derivation tree says it must be — and the *entire*
 *    admin branch that node belongs to is cut via the real recursive descendant-traversal the
 *    capability model uses to cascade-revoke, not just the one compromised node. The catch itself
 *    burns out right where the compromised node was — a hot flash and embers cooling through the
 *    same heat ramp regrowth uses, local to that exact spot, not a shockwave from the canvas center
 *    — the malicious grant being burned out, not a generic "something happened" cue. It darkens to
 *    a dead, quenched ember (with a burst of dark quench-motes selling the cut as violent, not just
 *    "faded out"), then reheats through the same charcoal → red → orange → white-hot ramp real
 *    forged metal does as it regrows — so the one event that actually matters reads as categorically
 *    different from the constant harmless sparking, exactly the distinction the capability model
 *    itself draws between "deflected" and "revoked."
 *
 *  This is not a decorative particle effect — the simulation state comes from rust/forge-core,
 *  compiled with wasm-bindgen (see scripts/build-wasm.sh). Pauses off-screen; reduced-motion
 *  renders one static frame with no attacks in flight. */
export declare class SecSiegeField extends SecElement {
    #private;
    render(): void;
    disconnectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "sec-siege-field": SecSiegeField;
    }
}
