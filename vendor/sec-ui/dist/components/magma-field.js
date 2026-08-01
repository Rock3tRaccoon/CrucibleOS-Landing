import { SecElement, sheet } from "../base-element.js";
import { MagmaSim } from "../wasm/forge_core.js";
import { ensureForgeWasm } from "../wasm/init.js";
const css = sheet(`
  :host {
    display: block;
    overflow: hidden;
  }
  canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
  }
`);
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
export class SecMagmaField extends SecElement {
    static { this.observedAttributes = ["points"]; }
    #canvas;
    #ctx;
    #sim = null;
    #imageData = null;
    #dpr = 1;
    #raf = 0;
    #roRaf = 0;
    #running = false;
    #ro;
    #w = 0;
    #h = 0;
    #reduced = false;
    #startTime = 0;
    #pointerX = 0;
    #pointerY = 0;
    #hasPointer = false;
    #onPointerMove = (e) => {
        this.#pointerX = e.clientX;
        this.#pointerY = e.clientY;
        this.#hasPointer = true;
    };
    #pointCount() {
        return Number(this.getAttribute("points")) || 24;
    }
    render() {
        this.adopt(css);
        this.root.innerHTML = `<canvas></canvas>`;
        this.#canvas = this.$("canvas");
        this.#ctx = this.#canvas.getContext("2d");
        this.#reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
        this.#dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.#resize();
        ensureForgeWasm().then(() => {
            if (!this.isConnected)
                return;
            this.#sim = new MagmaSim(Math.floor(Math.random() * 0xffffffff), this.#simW(), this.#simH(), this.#pointCount());
            this.#applyGrid();
            this.#draw(this.#sim.tick(this.#reduced ? 4 : 0));
            // See sec-ember-field / sec-siege-field for why this is deferred to the next animation
            // frame rather than called directly inside the RO callback.
            this.#ro = new ResizeObserver(() => {
                this.#resize();
                cancelAnimationFrame(this.#roRaf);
                this.#roRaf = requestAnimationFrame(() => {
                    if (this.#sim) {
                        this.#sim.resize(this.#simW(), this.#simH(), this.#pointCount());
                        this.#applyGrid();
                        this.#draw(this.#sim.tick(this.#reduced ? 4 : 0));
                    }
                });
            });
            this.#ro.observe(this);
            if (!this.#reduced) {
                // Listened on window, not this element — the canvas is pointer-events:none, so it
                // never receives its own pointer events. Position is only *read* once per animation
                // frame (in #start's loop), so the event's own frequency doesn't drive extra work.
                window.addEventListener("pointermove", this.#onPointerMove, { passive: true });
                this.#start();
            }
        });
    }
    disconnectedCallback() {
        this.#stop();
        cancelAnimationFrame(this.#roRaf);
        this.#ro?.disconnect();
        window.removeEventListener("pointermove", this.#onPointerMove);
        this.#sim?.free();
        this.#sim = null;
    }
    #resize() {
        const rect = this.getBoundingClientRect();
        this.#w = Math.max(1, rect.width);
        this.#h = Math.max(1, rect.height);
    }
    // The sim's internal coordinate space is device pixels, not CSS pixels — the extra factor is
    // what gets retina displays a genuinely crisp grid instead of a CSS-pixel-resolution one
    // upscaled twice.
    #simW() {
        return this.#w * this.#dpr;
    }
    #simH() {
        return this.#h * this.#dpr;
    }
    // The canvas's backing buffer is sized to the compute grid (device-pixel resolution), while
    // CSS stretches it to the viewport's CSS size — at this resolution that's a ~1:1 mapping, so
    // the small remaining blur is polish, not the load-bearing softening a coarser grid needed.
    #applyGrid() {
        if (!this.#sim)
            return;
        const gw = this.#sim.grid_width();
        const gh = this.#sim.grid_height();
        this.#canvas.width = gw;
        this.#canvas.height = gh;
        this.#imageData = this.#ctx.createImageData(gw, gh);
    }
    #start() {
        if (this.#running || !this.#sim)
            return;
        this.#running = true;
        this.#startTime = 0;
        const loop = (t) => {
            if (!this.#running || !this.#sim)
                return;
            if (!this.#startTime)
                this.#startTime = t;
            if (this.#hasPointer)
                this.#sim.set_pointer(this.#pointerX * this.#dpr, this.#pointerY * this.#dpr);
            this.#draw(this.#sim.tick((t - this.#startTime) / 1000));
            this.#raf = requestAnimationFrame(loop);
        };
        this.#raf = requestAnimationFrame(loop);
    }
    #stop() {
        this.#running = false;
        if (this.#raf)
            cancelAnimationFrame(this.#raf);
        this.#raf = 0;
    }
    #draw(rgba) {
        const img = this.#imageData;
        if (!img)
            return;
        img.data.set(rgba);
        this.#ctx.putImageData(img, 0, 0);
    }
}
customElements.define("sec-magma-field", SecMagmaField);
//# sourceMappingURL=magma-field.js.map