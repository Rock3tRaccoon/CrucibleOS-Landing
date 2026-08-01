import { SecElement, sheet } from "../base-element.js";
import { icons } from "../icons.js";
const css = sheet(`
  :host { display: inline-block; }
  .plate {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: var(--sec-space-3);
    font-family: var(--sec-font-mono);
    font-size: var(--sec-fs-xs);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--sec-text-secondary);
    padding: var(--sec-space-2) var(--sec-space-4);
    border: 1px solid var(--sec-line-strong);
    background: var(--sec-bg-2);
  }
  .bolt {
    display: inline-flex;
    color: var(--sec-accent);
    flex: none;
  }
  .rivet {
    position: absolute;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--sec-bg-0);
    border: 1px solid var(--sec-line-strong);
  }
  .rivet.tl { top: 4px; left: 4px; }
  .rivet.br { bottom: 4px; right: 4px; }
  .label { position: relative; }
`);
/** `<sec-plate-badge>Eyebrow label</sec-plate-badge>` — a stamped steel-plate tag with a
 *  bolt-head glyph and rivet corners. The industrial counterpart to sec-badge's shield-tag. */
export class SecPlateBadge extends SecElement {
    render() {
        this.adopt(css);
        this.root.innerHTML = `
      <span class="plate" part="plate">
        <span class="rivet tl"></span>
        <span class="rivet br"></span>
        <span class="bolt">${icons.bolt}</span>
        <span class="label"><slot></slot></span>
      </span>
    `;
    }
}
customElements.define("sec-plate-badge", SecPlateBadge);
//# sourceMappingURL=plate-badge.js.map