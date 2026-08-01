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
  /* inline (not inline-block): keeps mid-word characters from becoming their own
     line-break opportunities, so wrapping still only happens at real spaces. */
  .chars span {
    display: inline;
  }
`);
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%$&/\\<>+=";
/** `<sec-decode-text text="Pioneering Systems Security Research"></sec-decode-text>` — headline
 *  characters scramble through random glyphs before resolving left-to-right, matrix/terminal
 *  style. Real text stays in the DOM for a11y; the animated copy is `aria-hidden`. Skips
 *  straight to final text under reduced-motion. */
export class SecDecodeText extends SecElement {
    static { this.observedAttributes = ["text"]; }
    #alive = false;
    render() {
        this.adopt(css);
        const text = this.getAttribute("text") ?? this.textContent ?? "";
        this.root.innerHTML = `<span class="visually-hidden">${esc(text)}</span><span class="chars" aria-hidden="true"></span>`;
        this.#run(text);
    }
    connectedCallback() {
        super.connectedCallback();
        this.#alive = true;
    }
    disconnectedCallback() {
        this.#alive = false;
    }
    #run(text) {
        const charsEl = this.$(".chars");
        if (!charsEl)
            return;
        charsEl.innerHTML = "";
        const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
        if (reduced) {
            charsEl.textContent = text;
            return;
        }
        const spans = [...text].map((ch) => {
            const s = document.createElement("span");
            s.textContent = ch === " " ? " " : "";
            charsEl.appendChild(s);
            return s;
        });
        const perCharMs = 12;
        const scrambleMs = 140;
        const start = performance.now();
        const tick = (now) => {
            if (!this.#alive)
                return;
            let allDone = true;
            spans.forEach((s, i) => {
                const finalCh = text[i];
                if (finalCh === " ")
                    return;
                const elapsed = now - start - i * perCharMs;
                if (elapsed < 0) {
                    allDone = false;
                }
                else if (elapsed < scrambleMs) {
                    s.textContent = GLYPHS[(Math.random() * GLYPHS.length) | 0];
                    allDone = false;
                }
                else {
                    s.textContent = finalCh;
                }
            });
            if (!allDone)
                requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }
}
customElements.define("sec-decode-text", SecDecodeText);
//# sourceMappingURL=decode-text.js.map