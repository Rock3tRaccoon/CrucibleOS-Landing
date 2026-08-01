import { SecElement, sheet, esc } from "../base-element.js";
const css = sheet(`
  :host { display: block; }
  .term {
    border: 1px solid var(--sec-line-strong);
    border-radius: var(--sec-radius-md);
    background: var(--sec-bg-1);
    overflow: hidden;
    box-shadow: var(--sec-shadow-card);
  }
  .chrome {
    display: flex;
    align-items: center;
    gap: var(--sec-space-2);
    padding: var(--sec-space-2) var(--sec-space-4);
    border-bottom: 1px solid var(--sec-line);
    background: var(--sec-bg-2);
  }
  .dot { width: 9px; height: 9px; border-radius: 50%; background: var(--sec-line-strong); }
  .chrome-title {
    margin-left: var(--sec-space-2);
    font-family: var(--sec-font-mono);
    font-size: var(--sec-fs-xs);
    color: var(--sec-text-muted);
  }
  .body {
    padding: var(--sec-space-4);
    font-family: var(--sec-font-mono);
    font-size: var(--sec-fs-sm);
    line-height: var(--sec-lh-body);
    min-height: 4em;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .line { color: var(--sec-text-secondary); }
  .line.ok { color: var(--sec-success); }
  .line.warn { color: var(--sec-warning); }
  .line.fail { color: var(--sec-danger); }
  .line.muted { color: var(--sec-text-muted); }
  .cursor {
    display: inline-block;
    width: 0.55em;
    height: 1em;
    background: var(--sec-accent);
    vertical-align: text-bottom;
    margin-left: 2px;
    animation: sec-term-blink 1s step-end infinite;
  }
  @keyframes sec-term-blink { 50% { opacity: 0; } }
  @media (prefers-reduced-motion: reduce) {
    .cursor { animation: none; }
  }
`);
/** `<sec-terminal title="…">` — set `.lines` (SecTerminalLine[]) from host code; types a boot-log
 *  style sequence into a terminal-chrome frame once the element scrolls into view. Plays once;
 *  reduced-motion or an empty viewport renders the final state immediately, no animation. */
export class SecTerminal extends SecElement {
    static { this.observedAttributes = ["title"]; }
    #lines = [];
    #played = false;
    #io;
    #reduced = false;
    get lines() {
        return this.#lines;
    }
    set lines(v) {
        this.#lines = v;
        this.render();
    }
    render() {
        this.adopt(css);
        const title = this.getAttribute("title") ?? "";
        this.root.innerHTML = `
      <div class="term" part="term">
        <div class="chrome">
          <span class="dot"></span><span class="dot"></span><span class="dot"></span>
          ${title ? `<span class="chrome-title">${esc(title)}</span>` : ""}
        </div>
        <div class="body" part="body"></div>
      </div>
    `;
        this.#reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
        if (this.#reduced) {
            this.#renderFinal();
            return;
        }
        this.#io?.disconnect();
        this.#io = new IntersectionObserver((entries) => {
            if (entries[0]?.isIntersecting && !this.#played) {
                this.#played = true;
                this.#type();
                this.#io?.disconnect();
            }
        }, { threshold: 0.35 });
        this.#io.observe(this);
    }
    disconnectedCallback() {
        this.#io?.disconnect();
    }
    #renderFinal() {
        const body = this.$(".body");
        if (!body)
            return;
        body.innerHTML = this.#lines.map((l) => `<div class="line ${l.tone ?? ""}">${esc(l.text)}</div>`).join("");
    }
    async #type() {
        const body = this.$(".body");
        if (!body)
            return;
        body.innerHTML = "";
        for (const line of this.#lines) {
            const div = document.createElement("div");
            div.className = `line ${line.tone ?? ""}`;
            const cursor = document.createElement("span");
            cursor.className = "cursor";
            div.appendChild(cursor);
            body.appendChild(div);
            for (let i = 1; i <= line.text.length; i++) {
                div.textContent = line.text.slice(0, i);
                div.appendChild(cursor);
                await new Promise((r) => setTimeout(r, 10 + Math.random() * 14));
            }
            cursor.remove();
            await new Promise((r) => setTimeout(r, line.tone === "fail" ? 420 : 90));
        }
    }
}
customElements.define("sec-terminal", SecTerminal);
//# sourceMappingURL=terminal.js.map