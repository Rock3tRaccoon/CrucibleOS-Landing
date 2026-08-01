import { SecElement, sheet } from "../base-element.js";
const css = sheet(`
  :host {
    display: block;
    position: relative;
    overflow: hidden;
  }
  .layer {
    position: absolute;
    clip-path: polygon(50% 0%, 78% 14%, 100% 46%, 91% 100%, 50% 84%, 9% 100%, 0% 46%, 22% 14%);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.4));
    will-change: transform;
  }
  .l1 {
    width: 66vw;
    max-width: 900px;
    aspect-ratio: 1 / 1.35;
    top: -18%;
    right: -18%;
    opacity: 0.12;
    animation: sec-hull-drift-1 46s ease-in-out infinite alternate;
  }
  .l2 {
    width: 42vw;
    max-width: 620px;
    aspect-ratio: 1 / 1.35;
    bottom: -14%;
    left: -10%;
    opacity: 0.17;
    animation: sec-hull-drift-2 36s ease-in-out infinite alternate;
  }
  .l3 {
    width: 22vw;
    max-width: 320px;
    aspect-ratio: 1 / 1.35;
    top: 18%;
    left: 6%;
    opacity: 0.3;
    box-shadow: inset 0 0 0 1px var(--sec-accent-line);
    animation: sec-hull-drift-3 28s ease-in-out infinite alternate;
  }
  .rim {
    position: absolute;
    inset: 0;
    clip-path: polygon(50% 0%, 78% 14%, 100% 46%, 91% 100%, 50% 84%, 9% 100%, 0% 46%, 22% 14%);
    box-shadow: none;
    opacity: 0.85;
  }
  .l3 .rim { opacity: 1; }
  .fog {
    position: absolute;
    inset: 0;
    background: radial-gradient(60% 55% at 50% 42%, transparent 15%, var(--sec-bg-0) 88%);
    pointer-events: none;
  }

  @keyframes sec-hull-drift-1 {
    from { transform: translate3d(0, 0, 0) rotate(0deg); }
    to { transform: translate3d(-14px, 10px, 0) rotate(-1.2deg); }
  }
  @keyframes sec-hull-drift-2 {
    from { transform: translate3d(0, 0, 0) rotate(0deg); }
    to { transform: translate3d(12px, -8px, 0) rotate(1deg); }
  }
  @keyframes sec-hull-drift-3 {
    from { transform: translate3d(0, 0, 0); }
    to { transform: translate3d(-8px, 6px, 0); }
  }

  @media (prefers-reduced-motion: reduce) {
    .l1, .l2, .l3 { animation: none; }
  }
`);
/** `<sec-hull-field>` — massive, dim, angular silhouettes at three depths, fogged into the
 *  background, drifting almost imperceptibly slowly. Meant to read the way a capital ship's
 *  hull reads looming out of the dark: scale and weight first, detail never. Layered ambient
 *  backdrop, not a focal graphic — pair with foreground content, not standalone. */
export class SecHullField extends SecElement {
    render() {
        this.adopt(css);
        this.root.innerHTML = `
      <div class="layer l1"><span class="rim"></span></div>
      <div class="layer l2"><span class="rim"></span></div>
      <div class="layer l3"><span class="rim"></span></div>
      <div class="fog"></div>
    `;
    }
}
customElements.define("sec-hull-field", SecHullField);
//# sourceMappingURL=hull-field.js.map