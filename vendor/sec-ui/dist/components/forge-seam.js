import { SecElement, sheet } from "../base-element.js";
const css = sheet(`
  :host {
    display: block;
    position: relative;
    overflow: visible;
  }
  .base {
    position: absolute;
    inset: 0;
    background: var(--sec-line-strong);
  }
  .seam {
    position: absolute;
    inset: 0;
    background: var(--sec-accent);
    opacity: 0.55;
  }
  .glow {
    position: absolute;
    top: -7px;
    bottom: -7px;
    left: -12%;
    right: -12%;
    background: radial-gradient(closest-side, var(--sec-accent), transparent 70%);
    background-size: 16% 100%;
    background-repeat: no-repeat;
    background-position: -16% 50%;
    filter: blur(3px);
    opacity: 0.9;
    mix-blend-mode: screen;
    animation: sec-seam-travel 3.6s ease-in-out infinite;
    pointer-events: none;
  }
  @keyframes sec-seam-travel {
    0%, 100% { background-position: -16% 50%; }
    50% { background-position: 116% 50%; }
  }
  @media (prefers-reduced-motion: reduce) {
    .glow { animation: none; background-position: 50% 50%; }
  }
`);
/** `<sec-forge-seam>` — a thin glowing "molten seam" line: a bright hotspot drifts back and
 *  forth along an accent-colored base line. Drop-in replacement for a plain accent-line div in
 *  section headers/dividers, giving every section break the same forge-heated texture instead
 *  of a static bar. Sizing (width/height) is left entirely to the consumer's own layout CSS on
 *  the host element, same as the plain div it replaces. */
export class SecForgeSeam extends SecElement {
    render() {
        this.adopt(css);
        this.root.innerHTML = `
      <span class="base" part="base"></span>
      <span class="seam" part="seam"></span>
      <span class="glow" part="glow"></span>
    `;
    }
}
customElements.define("sec-forge-seam", SecForgeSeam);
//# sourceMappingURL=forge-seam.js.map