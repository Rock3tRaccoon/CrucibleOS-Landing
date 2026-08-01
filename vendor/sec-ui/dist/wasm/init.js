import init from "./forge_core.js";
// A single, page-wide singleton. sec-siege-field and sec-ember-field both need the forge-core
// wasm module — if each kept its own "have I called init() yet" promise (as they briefly did),
// a page with both components would call init() twice, concurrently, before either resolved.
// That produces two separate WebAssembly instances, and since wasm-bindgen's generated glue
// binds the *module-level* `wasm` export table to whichever instantiation finishes last,
// objects created against the first instance end up having their methods dispatched against the
// second instance's unrelated linear memory — surfaces as "recursive use of an object detected"
// or a flat "memory access out of bounds" trap. One shared promise for the whole bundle avoids
// the race entirely.
let wasmReady = null;
export function ensureForgeWasm() {
    if (!wasmReady)
        wasmReady = init();
    return wasmReady;
}
//# sourceMappingURL=init.js.map