/* @ts-self-types="./forge_core.d.ts" */

export class EmberSim {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EmberSimFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_embersim_free(ptr, 0);
    }
    /**
     * @param {number} seed
     * @param {number} w
     * @param {number} h
     * @param {number} density
     */
    constructor(seed, w, h, density) {
        const ret = wasm.embersim_new(seed, w, h, density);
        this.__wbg_ptr = ret;
        EmberSimFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} w
     * @param {number} h
     * @param {number} density
     */
    resize(w, h, density) {
        wasm.embersim_resize(this.__wbg_ptr, w, h, density);
    }
    /**
     * `t` is elapsed seconds (pass `0` for a stable single frame under reduced-motion).
     * @param {number} t
     * @returns {any}
     */
    tick(t) {
        const ret = wasm.embersim_tick(this.__wbg_ptr, t);
        return ret;
    }
}
if (Symbol.dispose) EmberSim.prototype[Symbol.dispose] = EmberSim.prototype.free;

export class MagmaSim {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MagmaSimFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_magmasim_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    grid_height() {
        const ret = wasm.magmasim_grid_height(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Dimensions of the flat grid `tick` returns — the host sizes its canvas backing buffer to
     * exactly this, so the two never drift out of sync.
     * @returns {number}
     */
    grid_width() {
        const ret = wasm.magmasim_grid_width(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} seed
     * @param {number} w
     * @param {number} h
     * @param {number} count
     */
    constructor(seed, w, h, count) {
        const ret = wasm.magmasim_new(seed, w, h, count);
        this.__wbg_ptr = ret;
        MagmaSimFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} w
     * @param {number} h
     * @param {number} count
     */
    resize(w, h, count) {
        wasm.magmasim_resize(this.__wbg_ptr, w, h, count);
    }
    /**
     * Reported once per animation frame from the host page's pointermove listener — nearby
     * feature points heat up (see `tick`). Never called under reduced-motion, so there's no
     * unbounded-motion accessibility concern.
     * @param {number} x
     * @param {number} y
     */
    set_pointer(x, y) {
        wasm.magmasim_set_pointer(this.__wbg_ptr, x, y);
    }
    /**
     * `t` is elapsed seconds (pass `0` for a stable single frame under reduced-motion). Returns
     * ready-to-blit RGBA bytes, `grid_width() * grid_height() * 4` long. No distance search
     * happens here — see `seed` — so cost is O(points + cells), not O(points * cells).
     * @param {number} t
     * @returns {Uint8Array}
     */
    tick(t) {
        const ret = wasm.magmasim_tick(this.__wbg_ptr, t);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
}
if (Symbol.dispose) MagmaSim.prototype[Symbol.dispose] = MagmaSim.prototype.free;

export class SiegeSim {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SiegeSimFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_siegesim_free(ptr, 0);
    }
    /**
     * @param {number} seed
     * @param {number} w
     * @param {number} h
     */
    constructor(seed, w, h) {
        const ret = wasm.siegesim_new(seed, w, h);
        this.__wbg_ptr = ret;
        SiegeSimFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} w
     * @param {number} h
     */
    resize(w, h) {
        wasm.siegesim_resize(this.__wbg_ptr, w, h);
    }
    /**
     * @param {number} dt
     * @returns {any}
     */
    tick(dt) {
        const ret = wasm.siegesim_tick(this.__wbg_ptr, dt);
        return ret;
    }
}
if (Symbol.dispose) SiegeSim.prototype[Symbol.dispose] = SiegeSim.prototype.free;
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg___wbindgen_throw_344f42d3211c4765: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg_new_32b398fb48b6d94a: function() {
            const ret = new Array();
            return ret;
        },
        __wbg_new_da52cf8fe3429cb2: function() {
            const ret = new Object();
            return ret;
        },
        __wbg_set_6be42768c690e380: function(arg0, arg1, arg2) {
            arg0[arg1] = arg2;
        },
        __wbg_set_8a16b38e4805b298: function(arg0, arg1, arg2) {
            arg0[arg1 >>> 0] = arg2;
        },
        __wbindgen_cast_0000000000000001: function(arg0) {
            // Cast intrinsic for `F64 -> Externref`.
            const ret = arg0;
            return ret;
        },
        __wbindgen_cast_0000000000000002: function(arg0, arg1) {
            // Cast intrinsic for `Ref(String) -> Externref`.
            const ret = getStringFromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        },
    };
    return {
        __proto__: null,
        "./forge_core_bg.js": import0,
    };
}

const EmberSimFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_embersim_free(ptr, 1));
const MagmaSimFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_magmasim_free(ptr, 1));
const SiegeSimFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_siegesim_free(ptr, 1));

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function getStringFromWasm0(ptr, len) {
    return decodeText(ptr >>> 0, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

let wasmModule, wasmInstance, wasm;
function __wbg_finalize_init(instance, module) {
    wasmInstance = instance;
    wasm = instance.exports;
    wasmModule = module;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('forge_core_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
