import { SecElement, sheet } from "../base-element.js";
import { EmberSim } from "../wasm/forge_core.js";
import { ensureForgeWasm } from "../wasm/init.js";
const css = sheet(`
  :host {
    display: block;
    position: relative;
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
function hexToRgbComponents(hex) {
    const trimmed = hex.trim();
    const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(trimmed);
    if (!match)
        return null;
    let h = match[1];
    if (h.length === 3)
        h = [...h].map((c) => c + c).join("");
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `${r}, ${g}, ${b}`;
}
/** `<sec-ember-field density="1">` — slow-rising embers drifting up out of the dark, like
 *  debris still hanging in the air after impact. Particle motion is computed by forge-core's
 *  EmberSim (Rust, compiled to WebAssembly) — this component just ticks it and paints the
 *  result to canvas. Deliberately heavy and slow, not playful — the atmospheric counterpart to
 *  sec-blueprint-field's technical grid. Pauses off-screen and renders a single static frame
 *  under reduced-motion. */
export class SecEmberField extends SecElement {
    static { this.observedAttributes = ["density"]; }
    #canvas;
    #ctx;
    #sim = null;
    #raf = 0;
    #roRaf = 0;
    #running = false;
    #ro;
    #io;
    #w = 0;
    #h = 0;
    #reduced = false;
    #startTime = 0;
    #accentRgb = "255, 106, 61";
    #density() {
        return Number(this.getAttribute("density")) || 1;
    }
    render() {
        this.adopt(css);
        this.root.innerHTML = `<canvas></canvas>`;
        this.#canvas = this.$("canvas");
        this.#ctx = this.#canvas.getContext("2d");
        this.#reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
        this.#accentRgb = hexToRgbComponents(getComputedStyle(this).getPropertyValue("--sec-accent")) ?? this.#accentRgb;
        this.#resize();
        ensureForgeWasm().then(() => {
            if (!this.isConnected)
                return;
            this.#sim = new EmberSim(Math.floor(Math.random() * 0xffffffff), this.#w, this.#h, this.#density());
            this.#draw(this.#sim.tick(this.#reduced ? 4 : 0));
            // See sec-siege-field for the two reasons this redraw is deferred to the next animation
            // frame rather than called directly inside the RO callback: (1) ResizeObserver fires once
            // immediately on observe(), and that resize wipes the canvas bitmap — reduced-motion never
            // starts the rAF loop, so an un-deferred wipe with no redraw would show nothing; (2) the
            // browser's resize-observation delivery can recurse synchronously within one frame, and
            // calling into wasm from inside that nesting corrupts wasm-bindgen's shared call stack
            // when another wasm class instance is touched around the same time.
            this.#ro = new ResizeObserver(() => {
                this.#resize();
                cancelAnimationFrame(this.#roRaf);
                this.#roRaf = requestAnimationFrame(() => {
                    if (this.#sim) {
                        this.#sim.resize(this.#w, this.#h, this.#density());
                        this.#draw(this.#sim.tick(this.#reduced ? 4 : 0));
                    }
                });
            });
            this.#ro.observe(this);
            if (!this.#reduced) {
                this.#io = new IntersectionObserver((entries) => {
                    if (entries[0]?.isIntersecting)
                        this.#start();
                    else
                        this.#stop();
                }, { threshold: 0 });
                this.#io.observe(this);
            }
        });
    }
    disconnectedCallback() {
        this.#stop();
        cancelAnimationFrame(this.#roRaf);
        this.#ro?.disconnect();
        this.#io?.disconnect();
        this.#sim?.free();
        this.#sim = null;
    }
    #resize() {
        const rect = this.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.#w = Math.max(1, rect.width);
        this.#h = Math.max(1, rect.height);
        this.#canvas.width = Math.round(this.#w * dpr);
        this.#canvas.height = Math.round(this.#h * dpr);
        this.#ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
    #draw(particles) {
        const ctx = this.#ctx;
        ctx.clearRect(0, 0, this.#w, this.#h);
        for (const p of particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.#accentRgb}, ${p.alpha})`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.#accentRgb}, ${p.alpha * 0.12})`;
            ctx.fill();
        }
    }
}
customElements.define("sec-ember-field", SecEmberField);
//# sourceMappingURL=ember-field.js.map