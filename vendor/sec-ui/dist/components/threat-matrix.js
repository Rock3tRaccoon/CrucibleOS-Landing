import { SecElement, sheet, esc } from "../base-element.js";
import { icons } from "../icons.js";
const CATEGORY_META = {
    crypto: { label: "Cryptographic", icon: icons.lock, color: "var(--sec-accent)" },
    isolation: { label: "Isolation & Integrity", icon: icons.shield, color: "var(--sec-danger)" },
    audit: { label: "Detection & Audit", icon: icons.eye, color: "var(--sec-warning)" },
};
const css = sheet(`
  :host { display: block; }
  .group { margin-bottom: var(--sec-space-6); }
  .group:last-child { margin-bottom: 0; }
  .group-header {
    display: flex;
    align-items: center;
    gap: var(--sec-space-2);
    padding-bottom: var(--sec-space-2);
    margin-bottom: var(--sec-space-3);
    border-bottom: 1px solid var(--sec-line);
  }
  .group-icon {
    display: inline-flex;
    flex: none;
    color: var(--cat-color);
  }
  .group-label {
    font-family: var(--sec-font-mono);
    font-size: var(--sec-fs-xs);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--sec-text-secondary);
  }
  /* A single hairline-bordered grid (1px gaps filled with the border color) reads as one
     structured matrix, the way a real compliance/control table would, rather than a set of
     independent floating cards competing for attention. */
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
    gap: 1px;
    background: var(--sec-line);
    border: 1px solid var(--sec-line);
    border-radius: var(--sec-radius-md);
    overflow: hidden;
  }
  .card {
    padding: var(--sec-space-4);
    background: var(--sec-bg-1);
    transition: background var(--sec-transition-med);
  }
  .card:hover {
    background: var(--sec-bg-2);
  }
  .card h4 {
    font-size: var(--sec-fs-body);
    font-weight: 600;
    color: var(--sec-text);
    margin: 0 0 var(--sec-space-2);
  }
  .card p {
    font-size: var(--sec-fs-sm);
    color: var(--sec-text-secondary);
    line-height: var(--sec-lh-body);
    margin: 0;
  }
`);
/** `<sec-threat-matrix>` — set `.threats` (ThreatEntry[]) from host code. Groups entries by
 *  category (crypto / isolation / audit) under a hairline-ruled header, rendering each as a cell
 *  in one shared bordered grid rather than a set of independent, hover-lit cards — deliberately
 *  understated (no colored accent bars, no hover-lift, no glow) so it reads as a compliance/control
 *  matrix, not a marketing feature grid. Category color lives only in the header icon/label. Built
 *  for CrucibleOS's Security page threat model, but generic enough for any threat/defense or
 *  problem/mitigation pairing that reads better grouped than as rows. */
export class SecThreatMatrix extends SecElement {
    #threats = [];
    get threats() {
        return this.#threats;
    }
    set threats(v) {
        this.#threats = v;
        this.render();
    }
    render() {
        this.adopt(css);
        const order = ["crypto", "isolation", "audit"];
        const groups = new Map();
        for (const t of this.#threats) {
            const arr = groups.get(t.category) ?? [];
            arr.push(t);
            groups.set(t.category, arr);
        }
        this.root.innerHTML = order
            .filter((cat) => groups.has(cat))
            .map((cat) => {
            const meta = CATEGORY_META[cat];
            const entries = groups.get(cat);
            return `
          <div class="group" style="--cat-color:${meta.color}">
            <div class="group-header">
              <span class="group-icon">${meta.icon}</span>
              <span class="group-label">${esc(meta.label)}</span>
            </div>
            <div class="grid">
              ${entries
                .map((e) => `
                    <div class="card">
                      <h4>${esc(e.threat)}</h4>
                      <p>${esc(e.defense)}</p>
                    </div>
                  `)
                .join("")}
            </div>
          </div>
        `;
        })
            .join("");
    }
}
customElements.define("sec-threat-matrix", SecThreatMatrix);
//# sourceMappingURL=threat-matrix.js.map