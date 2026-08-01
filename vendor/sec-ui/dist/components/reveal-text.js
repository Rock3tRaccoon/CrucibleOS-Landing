import { SecElement, sheet, esc } from "../base-element.js";
const css = sheet(`
  :host { display: inline; }
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
  }
  .word {
    display: inline-block;
    clip-path: inset(0 100% 0 0);
    animation: sec-reveal-wipe 0.55s cubic-bezier(0.2, 0.7, 0.1, 1) forwards;
  }
  @keyframes sec-reveal-wipe {
    to { clip-path: inset(0 0 0 0); }
  }
  @media (prefers-reduced-motion: reduce) {
    .word { animation: none; clip-path: none; }
  }
`);
/** `<sec-reveal-text text="Infrastructure Incubator Holding Company"></sec-reveal-text>` — each
 *  word wipes into view left-to-right, staggered, like a plotter/shutter opening. The
 *  professional/industrial counterpart to sec-decode-text's matrix scramble — same idea (an
 *  animated headline reveal), different register: precise and mechanical, not "hacker terminal". */
export class SecRevealText extends SecElement {
    static { this.observedAttributes = ["text"]; }
    render() {
        this.adopt(css);
        const text = this.getAttribute("text") ?? this.textContent ?? "";
        const words = text.split(" ");
        const wordsHtml = words
            .map((w, i) => `<span class="word" style="animation-delay:${i * 90}ms">${esc(w)}</span>`)
            .join(" ");
        this.root.innerHTML = `<span class="visually-hidden">${esc(text)}</span><span aria-hidden="true">${wordsHtml}</span>`;
    }
}
customElements.define("sec-reveal-text", SecRevealText);
//# sourceMappingURL=reveal-text.js.map