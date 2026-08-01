import { SecElement, sheet } from "../base-element.js";
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
/** Parses a `#rrggbb`/`#rgb` string (as read from a resolved CSS custom property) into an
 *  "r, g, b" component string for building `rgba(...)` canvas colors. Returns null if it
 *  can't be parsed (e.g. the property resolved to a named color or wasn't set). */
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
/** `<sec-network-field density="1">` — an animated node/edge "telemetry network" backdrop.
 *  Nodes drift and gently part around the cursor; pauses off-screen and renders a single
 *  static frame under reduced-motion. Meant to sit behind real content in stacking order —
 *  it only intercepts clicks in the empty space it actually covers. */
export class SecNetworkField extends SecElement {
    static { this.observedAttributes = ["density"]; }
    #canvas;
    #ctx;
    #nodes = [];
    #raf = 0;
    #running = false;
    #ro;
    #io;
    #w = 0;
    #h = 0;
    #mouse = null;
    #reduced = false;
    #accentRgb = "45, 212, 238";
    render() {
        this.adopt(css);
        this.root.innerHTML = `<canvas></canvas>`;
        this.#canvas = this.$("canvas");
        this.#ctx = this.#canvas.getContext("2d");
        this.#reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
        this.#accentRgb = hexToRgbComponents(getComputedStyle(this).getPropertyValue("--sec-accent")) ?? this.#accentRgb;
        this.#resize();
        this.#seed();
        this.#draw();
        this.#ro = new ResizeObserver(() => {
            this.#resize();
            this.#seed();
            if (this.#reduced)
                this.#draw();
        });
        this.#ro.observe(this);
        if (!this.#reduced) {
            this.#io = new IntersectionObserver((entries) => {
                const visible = entries[0]?.isIntersecting ?? false;
                if (visible)
                    this.#start();
                else
                    this.#stop();
            }, { threshold: 0 });
            this.#io.observe(this);
            this.addEventListener("pointermove", this.#onPointer);
            this.addEventListener("pointerleave", () => (this.#mouse = null));
        }
    }
    disconnectedCallback() {
        this.#stop();
        this.#ro?.disconnect();
        this.#io?.disconnect();
    }
    #onPointer = (e) => {
        const rect = this.getBoundingClientRect();
        this.#mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    #resize() {
        const rect = this.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.#w = Math.max(1, rect.width);
        this.#h = Math.max(1, rect.height);
        this.#canvas.width = Math.round(this.#w * dpr);
        this.#canvas.height = Math.round(this.#h * dpr);
        this.#ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    #seed() {
        const density = Number(this.getAttribute("density")) || 1;
        const count = Math.max(12, Math.round((this.#w * this.#h) / 26000 * density));
        this.#nodes = Array.from({ length: count }, () => ({
            x: Math.random() * this.#w,
            y: Math.random() * this.#h,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            r: Math.random() * 1.4 + 0.6,
        }));
    }
    #start() {
        if (this.#running)
            return;
        this.#running = true;
        const loop = () => {
            if (!this.#running)
                return;
            this.#draw();
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
    #draw() {
        const ctx = this.#ctx;
        ctx.clearRect(0, 0, this.#w, this.#h);
        const linkDist = 130;
        const accent = this.#accentRgb;
        for (const n of this.#nodes) {
            if (!this.#reduced) {
                n.x += n.vx;
                n.y += n.vy;
                if (this.#mouse) {
                    const dx = n.x - this.#mouse.x;
                    const dy = n.y - this.#mouse.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < 12000) {
                        const d = Math.sqrt(d2) || 1;
                        n.x += (dx / d) * 0.6;
                        n.y += (dy / d) * 0.6;
                    }
                }
                if (n.x < 0 || n.x > this.#w)
                    n.vx *= -1;
                if (n.y < 0 || n.y > this.#h)
                    n.vy *= -1;
                n.x = Math.min(Math.max(n.x, 0), this.#w);
                n.y = Math.min(Math.max(n.y, 0), this.#h);
            }
        }
        for (let i = 0; i < this.#nodes.length; i++) {
            for (let j = i + 1; j < this.#nodes.length; j++) {
                const a = this.#nodes[i];
                const b = this.#nodes[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < linkDist) {
                    const alpha = (1 - dist / linkDist) * 0.35;
                    ctx.strokeStyle = `rgba(${accent}, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }
        for (const n of this.#nodes) {
            ctx.beginPath();
            ctx.fillStyle = `rgba(${accent}, 0.85)`;
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
customElements.define("sec-network-field", SecNetworkField);
//# sourceMappingURL=network-field.js.map