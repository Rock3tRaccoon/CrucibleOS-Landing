import { SecElement, sheet, esc } from "../base-element.js";
const css = sheet(`
  :host {
    display: inline-block;
    position: relative;
  }
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
  }
  :host::before {
    content: "";
    position: absolute;
    inset: -18% -6%;
    z-index: -1;
    background: radial-gradient(ellipse at 30% 50%, var(--sec-accent-subtle), transparent 68%);
    opacity: 0;
    animation: sec-impact-flash 0.6s ease-out forwards;
    pointer-events: none;
  }
  .word {
    display: inline-block;
    opacity: 0;
    filter: blur(7px);
    transform: scale(1.1);
    animation: sec-impact-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  @keyframes sec-impact-flash {
    0% { opacity: 0; }
    12% { opacity: 1; }
    100% { opacity: 0; }
  }
  @keyframes sec-impact-in {
    0% { opacity: 0; filter: blur(7px); transform: scale(1.1); }
    60% { opacity: 1; filter: blur(0); }
    100% { opacity: 1; filter: blur(0); transform: scale(1); }
  }
  @media (prefers-reduced-motion: reduce) {
    :host::before { display: none; }
    .word { animation: none; opacity: 1; filter: none; transform: none; }
  }
`);
/** `<sec-impact-text text="…">` — a heavier headline reveal than sec-reveal-text's wipe or
 *  sec-decode-text's scramble: words punch in from a blurred, scaled-up, flash-lit state and
 *  settle, all in a tight stagger — meant to feel like a single heavy impact, not a delicate
 *  animation. Built for CrucibleOS's "frontline of the cyber war" register. */
export class SecImpactText extends SecElement {
    static { this.observedAttributes = ["text"]; }
    render() {
        this.adopt(css);
        const text = this.getAttribute("text") ?? this.textContent ?? "";
        const words = text.split(" ");
        const wordsHtml = words
            .map((w, i) => `<span class="word" style="animation-delay:${i * 45}ms">${esc(w)}</span>`)
            .join(" ");
        this.root.innerHTML = `<span class="visually-hidden">${esc(text)}</span><span aria-hidden="true">${wordsHtml}</span>`;
    }
}
customElements.define("sec-impact-text", SecImpactText);
//# sourceMappingURL=impact-text.js.map