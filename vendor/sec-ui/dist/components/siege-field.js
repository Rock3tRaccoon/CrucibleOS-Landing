import { SecElement, sheet } from "../base-element.js";
import { SiegeSim } from "../wasm/forge_core.js";
import { ensureForgeWasm } from "../wasm/init.js";
const css = sheet(`
  :host { display: block; position: relative; overflow: hidden; }
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
/** Deterministic per-particle pseudo-randomness (a burst's spark angles must stay fixed across
 *  the frames it's drawn on, and there's no per-particle state to hang a seeded RNG off) — same
 *  sin-scramble trick as GLSL's classic `hash()`, just needs to be stable, not cryptographic. */
function hash(n) {
    const x = Math.sin(n) * 43758.5453;
    return x - Math.floor(x);
}
/** A blacksmith's heat-color ramp (charcoal → dull red → orange → pale yellow-white), the same
 *  progression real forged metal runs through as it comes up to temperature. Everything in this
 *  component that's "reheating" — a regrowing node, the conduits leading into it — is driven by
 *  this instead of a flat two-color lerp, which is what actually sells "reforging" over "fading in." */
function heatColor(t) {
    const stops = [
        [0, 30, 26, 24],
        [0.28, 130, 32, 20],
        [0.6, 235, 110, 40],
        [1, 255, 226, 165],
    ];
    const c = Math.max(0, Math.min(1, t));
    for (let i = 1; i < stops.length; i++) {
        const [t0, r0, g0, b0] = stops[i - 1];
        const [t1, r1, g1, b1] = stops[i];
        if (c <= t1) {
            const f = (c - t0) / (t1 - t0 || 1);
            return `${Math.round(r0 + (r1 - r0) * f)}, ${Math.round(g0 + (g1 - g0) * f)}, ${Math.round(b0 + (b1 - b0) * f)}`;
        }
    }
    const last = stops[stops.length - 1];
    return `${last[1]}, ${last[2]}, ${last[3]}`;
}
/** How long a burn burst plays out, in ms, once a compromised node is caught and cut. */
const BURN_DURATION = 650;
function hexPath(ctx, cx, cy, r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const ang = (Math.PI / 3) * i - Math.PI / 2;
        const x = cx + r * Math.cos(ang);
        const y = cy + r * Math.sin(ang);
        if (i === 0)
            ctx.moveTo(x, y);
        else
            ctx.lineTo(x, y);
    }
    ctx.closePath();
}
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
export class SecSiegeField extends SecElement {
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
    #lastT = 0;
    #accentRgb = "255, 106, 61";
    #hotRgb = "255, 138, 99";
    // Fixed, not theme-derived: a compromise needs to read as "wrong" against any accent color this
    // component ends up themed with, the same reasoning as forge-core's other fixed signal colors.
    #compromiseRgb = "196, 78, 232";
    // Which node ids were compromised as of the previous frame — diffed against the current frame
    // to catch the exact instant one is caught (compromised flips false with no in-between state),
    // which is when and where a burn burst spawns. Local, client-side state: forge-core has no
    // concept of this, it's purely a rendering reaction to a state transition.
    #prevCompromised = new Set();
    #recentBursts = [];
    render() {
        this.adopt(css);
        this.root.innerHTML = `<canvas></canvas>`;
        this.#canvas = this.$("canvas");
        this.#ctx = this.#canvas.getContext("2d");
        this.#reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
        const style = getComputedStyle(this);
        this.#accentRgb = hexToRgbComponents(style.getPropertyValue("--sec-accent")) ?? this.#accentRgb;
        this.#hotRgb = hexToRgbComponents(style.getPropertyValue("--sec-accent-hover")) ?? this.#hotRgb;
        this.#resize();
        ensureForgeWasm().then(() => {
            if (!this.isConnected)
                return;
            this.#sim = new SiegeSim(Math.floor(Math.random() * 0xffffffff), this.#w, this.#h);
            this.#draw(this.#sim.tick(0));
            // ResizeObserver always invokes its callback once immediately on observe() — that
            // #resize() call resets the canvas's width/height attributes, which wipes its bitmap
            // even when the size is unchanged. The animation loop papers over that (next rAF frame
            // repaints), but reduced-motion never starts one, so the wipe would be the last thing
            // that ever happened. Redraw explicitly every time this fires — but deferred to the next
            // animation frame, never called directly from inside the RO callback: the browser's own
            // resize-observation delivery can recurse synchronously within one frame (spec'd "gather
            // active observations" loop), and calling into wasm from inside that nesting corrupts
            // wasm-bindgen's shared call stack when another wasm class instance (e.g. EmberSim) is
            // touched around the same time — surfaces as "recursive use of an object" / OOB traps.
            this.#ro = new ResizeObserver(() => {
                this.#resize();
                cancelAnimationFrame(this.#roRaf);
                this.#roRaf = requestAnimationFrame(() => {
                    if (this.#sim) {
                        this.#sim.resize(this.#w, this.#h);
                        this.#draw(this.#sim.tick(0));
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
        this.#lastT = 0;
        const loop = (t) => {
            if (!this.#running || !this.#sim)
                return;
            const dt = this.#lastT ? Math.min(0.05, (t - this.#lastT) / 1000) : 1 / 60;
            this.#lastT = t;
            this.#draw(this.#sim.tick(dt), t);
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
    #draw(frame, t = 0) {
        const ctx = this.#ctx;
        ctx.clearRect(0, 0, this.#w, this.#h);
        const byId = new Map();
        for (const n of frame.nodes) {
            byId.set(n.id, { x: n.x, y: n.y, revoked: n.revoked, compromised: n.compromised, regrow: n.regrow });
        }
        const heatOf = (n) => (n.revoked ? n.regrow : 1);
        // Every node's immediate graph neighbors (parent + children) — what a compromised node's
        // tendrils reach toward. There's no path from here to actual lateral movement; it's just what
        // "probing" looks like.
        const neighborsOf = new Map();
        const addNeighbor = (a, b) => {
            const list = neighborsOf.get(a);
            if (list)
                list.push(b);
            else
                neighborsOf.set(a, [b]);
        };
        for (const [p, c] of frame.edges) {
            addNeighbor(p, c);
            addNeighbor(c, p);
        }
        // Burn-burst spawn detection: a node stops being compromised in exactly one way — it gets
        // caught, right as its whole admin branch is cut — so "was compromised last frame, isn't now"
        // is a reliable, sufficient trigger. Recorded at the node's own position, not the canvas
        // center: this is the malicious grant itself being burned out, not a global event.
        for (const n of frame.nodes) {
            if (this.#prevCompromised.has(n.id) && !n.compromised) {
                this.#recentBursts.push({ x: n.x, y: n.y, start: t });
            }
        }
        this.#prevCompromised = new Set(frame.nodes.filter((n) => n.compromised).map((n) => n.id));
        this.#recentBursts = this.#recentBursts.filter((b) => t - b.start < BURN_DURATION);
        // Conduits: a soft wide underpass plus a crisp core, colored by the same heat ramp as the
        // nodes they connect, so a cut branch's edges cool and reheat in lockstep with it.
        for (const [a, b] of frame.edges) {
            const pa = byId.get(a);
            const pb = byId.get(b);
            if (!pa || !pb)
                continue;
            const heat = (heatOf(pa) + heatOf(pb)) / 2;
            const rgb = heat >= 0.999 ? this.#accentRgb : heatColor(heat);
            const alpha = 0.08 + heat * 0.2;
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.strokeStyle = `rgba(${rgb}, ${alpha * 0.5})`;
            ctx.lineWidth = 2.4;
            ctx.stroke();
            ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        // Attacks: a white-hot spark flies in from outside the tree on a glowing tail (life 0..1).
        // Most simply shatter into a small ember shower on arrival — deflected, nothing to escalate
        // through. The rare one that actually connects (a.hit) gets a sharp violet flash instead,
        // marking the instant its target turns — see the node loop below for what happens next.
        for (const a of frame.attacks) {
            const target = byId.get(a.target);
            if (!target)
                continue;
            if (a.life < 1) {
                const dx = target.x - a.x;
                const dy = target.y - a.y;
                const angle = Math.atan2(dy, dx);
                ctx.save();
                ctx.translate(a.x, a.y);
                ctx.rotate(angle);
                const grad = ctx.createLinearGradient(-10, 0, 2, 0);
                grad.addColorStop(0, `rgba(${this.#accentRgb}, 0)`);
                grad.addColorStop(0.7, `rgba(${this.#accentRgb}, 0.55)`);
                grad.addColorStop(1, `rgba(${this.#hotRgb}, 0.95)`);
                ctx.beginPath();
                ctx.moveTo(2, 0);
                ctx.lineTo(-10, 1.1);
                ctx.lineTo(-10, -1.1);
                ctx.closePath();
                ctx.fillStyle = grad;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(1.4, 0, 1.2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.#hotRgb}, 0.95)`;
                ctx.fill();
                ctx.restore();
            }
            else if (a.hit) {
                // Not a pulse — a glitch burst: a handful of stepped, jittering static shards plus a
                // chromatic-aberration fleck either side, gone in the same breath they appear. Reads as
                // corrupted signal, not an impact shockwave; it's the first instant of the node "turning."
                const sp = Math.min(1, (a.life - 1) / 0.45);
                const alpha = 1 - sp;
                const step = Math.floor(a.life * 30);
                const seed = a.target * 92821 + step;
                for (let i = 0; i < 4; i++) {
                    const jx = (hash(seed + i * 7) - 0.5) * 14;
                    const jy = (hash(seed + i * 11) - 0.5) * 6;
                    const bw = 2 + hash(seed + i * 13) * 5;
                    const bh = 1 + hash(seed + i * 17) * 1.4;
                    ctx.fillStyle = `rgba(${this.#compromiseRgb}, ${alpha * 0.8})`;
                    ctx.fillRect(a.x + jx - bw / 2, a.y + jy - bh / 2, bw, bh);
                }
                ctx.fillStyle = `rgba(255, 70, 70, ${alpha * 0.5})`;
                ctx.fillRect(a.x - 5, a.y - 0.7, 4, 1.4);
                ctx.fillStyle = `rgba(70, 200, 255, ${alpha * 0.5})`;
                ctx.fillRect(a.x + 1, a.y + 0.7, 4, 1.4);
            }
            else {
                const sp = Math.min(1, (a.life - 1) / 0.45);
                const seed = a.target * 104729;
                for (let i = 0; i < 5; i++) {
                    const ang = hash(seed + i * 13) * Math.PI * 2;
                    const speed = 5 + hash(seed + i * 29) * 7;
                    const dist = sp * speed;
                    const px = a.x + Math.cos(ang) * dist;
                    const py = a.y + Math.sin(ang) * dist + sp * sp * 3;
                    const alpha = (1 - sp) * 0.85;
                    const r = 1.4 * (1 - sp * 0.5);
                    ctx.beginPath();
                    ctx.arc(px, py, r, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${this.#accentRgb}, ${alpha})`;
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(px, py, r * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${this.#accentRgb}, ${alpha * 0.15})`;
                    ctx.fill();
                }
            }
        }
        for (const n of frame.nodes) {
            const baseRadius = n.depth === 0 ? 7.5 : n.depth === 1 ? 6 : n.depth === 2 ? 4.4 : 3.2;
            const heat = heatOf(n);
            let rgb = n.revoked ? heatColor(heat) : this.#accentRgb;
            let alpha = n.revoked
                ? 0.25 + heat * 0.65
                : n.depth === 0
                    ? 1
                    : n.depth === 1
                        ? 0.9
                        : n.depth === 2
                            ? 0.62
                            : 0.46;
            let radius = baseRadius * (n.revoked ? 0.4 + heat * 0.6 : 1);
            let glow = n.depth <= 1 && (!n.revoked || heat > 0.45);
            let px = n.x;
            let py = n.y;
            // A cut branch doesn't just fade — a handful of dark quench-motes puff outward at the
            // instant of the cut (heat still near 0), the same shape language as the ember bursts above
            // but cold and brief, selling "this was severed" rather than "this dimmed."
            if (n.revoked && heat < 0.12) {
                const q = heat / 0.12;
                const dist = q * (baseRadius * 2.4);
                const puffAlpha = (1 - q) * 0.7;
                const seed = n.id * 7919;
                for (let i = 0; i < 5; i++) {
                    const ang = hash(seed + i * 17) * Math.PI * 2;
                    const qx = n.x + Math.cos(ang) * dist;
                    const qy = n.y + Math.sin(ang) * dist;
                    ctx.beginPath();
                    ctx.arc(qx, qy, 1.1, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(20, 18, 16, ${puffAlpha})`;
                    ctx.fill();
                }
            }
            // Compromised: a real glitch, not a smooth pulse — position, size and alpha all jump on a
            // stepped clock (not eased), with occasional near-total dropouts, because a breathing sine
            // reads as "alive," and this state needs to read as "wrong." Chromatic-aberration ghosting
            // and the odd scan-bar fleck are added after the node itself is drawn, below.
            const glitchStep = n.compromised ? Math.floor(t / 70) : 0;
            const glitchSeed = n.id * 13 + glitchStep;
            if (n.compromised) {
                const dropout = hash(glitchSeed + 5) < 0.12;
                rgb = this.#compromiseRgb;
                alpha = dropout ? 0.06 : 0.6 + 0.4 * hash(glitchSeed + 6);
                radius = baseRadius * (0.85 + 0.3 * hash(glitchSeed));
                px = n.x + (hash(glitchSeed + 1) - 0.5) * 3;
                py = n.y + (hash(glitchSeed + 2) - 0.5) * 3;
                glow = true;
            }
            if (glow) {
                ctx.beginPath();
                ctx.arc(px, py, radius * 2.8, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${rgb}, ${alpha * 0.12})`;
                ctx.fill();
            }
            hexPath(ctx, px, py, radius);
            ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
            ctx.fill();
            if (n.depth <= 1 || n.compromised) {
                hexPath(ctx, px, py, radius);
                ctx.strokeStyle = `rgba(${rgb}, ${Math.min(1, alpha + 0.15)})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
            if (n.compromised) {
                // Chromatic aberration: the same hex outline, ghosted in red and cyan on either side of a
                // jittering axis — the classic corrupted-signal tell, and a lot more legible at this size
                // than trying to fake a horizontal-tear glitch on a shape this small.
                const off = 1.6 + hash(glitchSeed + 7) * 2;
                const ang = hash(glitchSeed + 8) * Math.PI * 2;
                hexPath(ctx, px + Math.cos(ang) * off, py + Math.sin(ang) * off, radius);
                ctx.strokeStyle = "rgba(255, 70, 70, 0.4)";
                ctx.lineWidth = 1;
                ctx.stroke();
                hexPath(ctx, px - Math.cos(ang) * off, py - Math.sin(ang) * off, radius);
                ctx.strokeStyle = "rgba(70, 210, 255, 0.4)";
                ctx.stroke();
                // An occasional bright scan-bar fleck slicing across the node — intermittent, not on every
                // step, so it reads as noise rather than a steady decoration.
                if (hash(glitchSeed + 9) < 0.3) {
                    const by = py + (hash(glitchSeed + 10) - 0.5) * radius * 1.6;
                    const bw = radius * (1.3 + hash(glitchSeed + 11));
                    ctx.fillStyle = `rgba(255, 255, 255, ${0.35 * hash(glitchSeed + 12)})`;
                    ctx.fillRect(px - bw / 2, by - 0.6, bw, 1.2);
                }
            }
            // Tendrils: short, probing reaches toward this node's real graph neighbors — advancing and
            // retreating, never arriving, and jagged rather than a clean line, redrawn on the same
            // stepped clock as the node's own glitch rather than eased, so it reads as one unstable
            // signal rather than a node glitching next to an unrelated smooth animation. There's no code
            // path where this actually spreads; it's what a node looks like while its own state can no
            // longer be trusted, nothing more.
            if (n.compromised) {
                const tendrilStep = Math.floor(t / 90);
                for (const nbId of neighborsOf.get(n.id) ?? []) {
                    const nb = byId.get(nbId);
                    if (!nb)
                        continue;
                    const seed = n.id * 131 + nbId * 7 + tendrilStep;
                    const reach = 0.2 + 0.22 * hash(seed);
                    const midReach = reach * (0.4 + 0.3 * hash(seed + 1));
                    const dx = nb.x - px;
                    const dy = nb.y - py;
                    const len = Math.hypot(dx, dy) || 1;
                    const nx = -dy / len;
                    const ny = dx / len;
                    const jitter = (hash(seed + 2) - 0.5) * 7;
                    const mx = px + dx * midReach + nx * jitter;
                    const my = py + dy * midReach + ny * jitter;
                    const tx = px + dx * reach;
                    const ty = py + dy * reach;
                    ctx.beginPath();
                    ctx.moveTo(px, py);
                    ctx.lineTo(mx, my);
                    ctx.lineTo(tx, ty);
                    ctx.strokeStyle = "rgba(255, 70, 70, 0.22)";
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    ctx.strokeStyle = `rgba(${this.#compromiseRgb}, 0.5)`;
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(tx, ty, 1.3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${this.#compromiseRgb}, ${0.5 + 0.4 * hash(seed + 3)})`;
                    ctx.fill();
                }
            }
        }
        // Burn bursts: the malicious grant itself being heated and burned out, exactly where it was —
        // a hot white flash plus embers cooling through the same heat ramp a regrowing node uses, then
        // fading. The node at that same spot is already drawing its own dark, quenched state this same
        // frame (see the node loop above); this is what actively destroying it looks like, not a
        // separate decoration layered on top.
        for (const b of this.#recentBursts) {
            const p = Math.min(1, (t - b.start) / BURN_DURATION);
            const fade = 1 - p;
            const coreAlpha = Math.max(0, 1 - p * 2.2);
            ctx.beginPath();
            ctx.arc(b.x, b.y, 2 + p * 4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.#hotRgb}, ${coreAlpha * 0.9})`;
            ctx.fill();
            const seed = Math.floor(b.start * 13) + 71;
            for (let i = 0; i < 7; i++) {
                const ang = hash(seed + i * 11) * Math.PI * 2;
                const speed = 9 + hash(seed + i * 17) * 16;
                const dist = p * speed;
                const ex = b.x + Math.cos(ang) * dist;
                const ey = b.y + Math.sin(ang) * dist - p * p * 8;
                const emberHeat = Math.max(0, 1 - p * 1.2 - hash(seed + i) * 0.2);
                const rgb = heatColor(emberHeat);
                const r = 1.5 * (1 - p * 0.4);
                ctx.beginPath();
                ctx.arc(ex, ey, r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${rgb}, ${fade * 0.9})`;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(ex, ey, r * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${rgb}, ${fade * 0.15})`;
                ctx.fill();
            }
        }
    }
}
customElements.define("sec-siege-field", SecSiegeField);
//# sourceMappingURL=siege-field.js.map