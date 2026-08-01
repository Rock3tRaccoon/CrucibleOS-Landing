import { SecElement, sheet, esc } from "../base-element.js";
import { icons } from "../icons.js";
function dedent(raw) {
    const lines = raw.replace(/\t/g, "  ").split("\n");
    while (lines.length && lines[0].trim() === "")
        lines.shift();
    while (lines.length && lines[lines.length - 1].trim() === "")
        lines.pop();
    const indent = lines.reduce((min, line) => {
        if (line.trim() === "")
            return min;
        const m = /^(\s*)/.exec(line)[1].length;
        return Math.min(min, m);
    }, Infinity);
    const cut = Number.isFinite(indent) ? indent : 0;
    return lines.map((l) => l.slice(cut)).join("\n");
}
const css = sheet(`
  :host { display: block; }
  .block {
    position: relative;
    border: 1px solid var(--sec-line-strong);
    border-radius: var(--sec-radius-md);
    background: var(--sec-bg-1);
    overflow: hidden;
  }
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sec-space-3);
    padding: var(--sec-space-2) var(--sec-space-4);
    border-bottom: 1px solid var(--sec-line);
    background: var(--sec-bg-2);
    font-family: var(--sec-font-mono);
    font-size: var(--sec-fs-xs);
  }
  .head-left { display: flex; align-items: center; gap: var(--sec-space-3); min-width: 0; }
  .filename { color: var(--sec-text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .lang { color: var(--sec-text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
  .copy {
    all: unset;
    display: inline-flex;
    align-items: center;
    gap: var(--sec-space-1);
    color: var(--sec-text-muted);
    cursor: pointer;
    padding: var(--sec-space-1) var(--sec-space-2);
    border-radius: var(--sec-radius-sm);
    flex: none;
    transition: color var(--sec-transition-fast), background var(--sec-transition-fast);
  }
  .copy:hover { color: var(--sec-text); background: rgba(255, 255, 255, 0.05); }
  .copy.done { color: var(--sec-success); }
  pre {
    margin: 0;
    padding: var(--sec-space-4);
    overflow-x: auto;
    font-family: var(--sec-font-mono);
    font-size: var(--sec-fs-sm);
    line-height: var(--sec-lh-body);
    color: var(--sec-text-secondary);
  }
`);
/** `<sec-code-block lang="rust" title="cap.rs">…raw code as text content…</sec-code-block>` — a
 *  dedented, monospace code frame with a copy-to-clipboard button. No syntax highlighting —
 *  kept intentionally plain, a tokenizer is more machinery than a docs site needs. */
export class SecCodeBlock extends SecElement {
    static { this.observedAttributes = ["lang", "title"]; }
    #code = "";
    render() {
        this.adopt(css);
        if (!this.#code)
            this.#code = dedent(this.textContent ?? "");
        const lang = this.getAttribute("lang") ?? "";
        const title = this.getAttribute("title") ?? "";
        this.root.innerHTML = `
      <div class="block" part="block">
        <div class="head">
          <div class="head-left">
            ${title ? `<span class="filename">${esc(title)}</span>` : ""}
            ${lang ? `<span class="lang">${esc(lang)}</span>` : ""}
          </div>
          <button class="copy" part="copy" type="button">${icons.copy}<span class="copy-label">Copy</span></button>
        </div>
        <pre part="pre"><code>${esc(this.#code)}</code></pre>
      </div>
    `;
        this.$(".copy").addEventListener("click", async () => {
            const btn = this.$(".copy");
            const label = this.$(".copy-label");
            try {
                await navigator.clipboard.writeText(this.#code);
                btn.classList.add("done");
                const prev = label.textContent;
                label.textContent = "Copied";
                setTimeout(() => {
                    btn.classList.remove("done");
                    label.textContent = prev;
                }, 1500);
            }
            catch {
                // clipboard unavailable — the code is still selectable/copyable by hand
            }
        });
    }
}
customElements.define("sec-code-block", SecCodeBlock);
//# sourceMappingURL=code-block.js.map