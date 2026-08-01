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
/** `<sec-blueprint-field density="1">` — a fixed technical/schematic backdrop: a fine
 *  drafting grid with sparse structural connection nodes linked by orthogonal (not
 *  diagonal) lines, gently pulsing. Nodes stay put — this is a blueprint, not a network
 *  diagram — which is the point of contrast with sec-network-field's organic drift.
 *  Pauses off-screen and renders a single static frame under reduced-motion. */
export class SecBlueprintField extends SecElement {
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
    #reduced = false;
    #accentRgb = "201, 154, 61";
    #gridSize = 32;
    render() {
        this.adopt(css);
        this.root.innerHTML = `<canvas></canvas>`;
        this.#canvas = this.$("canvas");
        this.#ctx = this.#canvas.getContext("2d");
        this.#reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
        this.#accentRgb = hexToRgbComponents(getComputedStyle(this).getPropertyValue("--sec-accent")) ?? this.#accentRgb;
        this.#resize();
        this.#seed();
        this.#draw(0);
        this.#ro = new ResizeObserver(() => {
            this.#resize();
            this.#seed();
            this.#draw(0);
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
    }
    disconnectedCallback() {
        this.#stop();
        this.#ro?.disconnect();
        this.#io?.disconnect();
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
    #seed() {
        const density = Number(this.getAttribute("density")) || 1;
        const cols = Math.max(1, Math.round(this.#w / this.#gridSize));
        const rows = Math.max(1, Math.round(this.#h / this.#gridSize));
        const count = Math.max(6, Math.round((cols * rows) / 18 * density));
        this.#nodes = Array.from({ length: count }, () => ({
            x: Math.round(Math.random() * cols) * this.#gridSize,
            y: Math.round(Math.random() * rows) * this.#gridSize,
            phase: Math.random() * Math.PI * 2,
        }));
    }
    #start() {
        if (this.#running)
            return;
        this.#running = true;
        const loop = (t) => {
            if (!this.#running)
                return;
            this.#draw(t);
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
    #draw(t) {
        const ctx = this.#ctx;
        ctx.clearRect(0, 0, this.#w, this.#h);
        // fine drafting grid
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        for (let x = 0; x <= this.#w; x += this.#gridSize) {
            ctx.beginPath();
            ctx.moveTo(x + 0.5, 0);
            ctx.lineTo(x + 0.5, this.#h);
            ctx.stroke();
        }
        for (let y = 0; y <= this.#h; y += this.#gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y + 0.5);
            ctx.lineTo(this.#w, y + 0.5);
            ctx.stroke();
        }
        // orthogonal connectors between nearby nodes (right-angle, like a schematic trace)
        const linkDist = this.#gridSize * 4;
        ctx.strokeStyle = `rgba(${this.#accentRgb}, 0.16)`;
        ctx.lineWidth = 1;
        for (let i = 0; i < this.#nodes.length; i++) {
            for (let j = i + 1; j < this.#nodes.length; j++) {
                const a = this.#nodes[i];
                const b = this.#nodes[j];
                const dx = Math.abs(a.x - b.x);
                const dy = Math.abs(a.y - b.y);
                if (dx + dy < linkDist && (dx === 0 || dy === 0 || Math.min(dx, dy) <= this.#gridSize)) {
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }
        // pulsing structural nodes (fixed position — this is a blueprint, not a live network)
        for (const n of this.#nodes) {
            const pulse = this.#reduced ? 1 : 0.55 + 0.45 * Math.sin(t / 900 + n.phase);
            ctx.fillStyle = `rgba(${this.#accentRgb}, ${0.5 * pulse})`;
            ctx.fillRect(n.x - 2.5, n.y - 2.5, 5, 5);
            ctx.strokeStyle = `rgba(${this.#accentRgb}, ${0.8 * pulse})`;
            ctx.strokeRect(n.x - 2.5, n.y - 2.5, 5, 5);
        }
    }
}
customElements.define("sec-blueprint-field", SecBlueprintField);
//# sourceMappingURL=blueprint-field.js.map