import { SecElement, sheet, esc } from "../base-element.js";
import { icons } from "../icons.js";
const css = sheet(`
  :host { display: inline-block; }
  .badge {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: var(--sec-space-3);
    font-family: var(--sec-font-mono);
    font-size: var(--sec-fs-xs);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--sec-accent);
    padding: 7px 14px 7px 10px;
    border: 1px solid var(--sec-accent-line);
    border-radius: var(--sec-radius-sm);
    background: var(--sec-accent-subtle);
    overflow: hidden;
  }
  .badge::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(100deg, transparent 40%, rgba(255, 255, 255, 0.18) 50%, transparent 60%);
    background-size: 220% 100%;
    animation: sec-badge-shimmer 3.6s ease-in-out infinite;
  }
  @keyframes sec-badge-shimmer {
    0% { background-position: 140% 0; }
    60%, 100% { background-position: -80% 0; }
  }
  .shield {
    position: relative;
    display: inline-flex;
    flex: none;
    filter: drop-shadow(0 0 3px var(--sec-accent));
    animation: sec-badge-glow 2.6s ease-in-out infinite;
  }
  .shield img {
    display: block;
    width: 18px;
    height: 18px;
    object-fit: contain;
  }
  @keyframes sec-badge-glow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.55; }
  }
  .divider {
    position: relative;
    align-self: stretch;
    width: 1px;
    background: var(--sec-accent-line);
    flex: none;
  }
  .label { position: relative; }
  @media (prefers-reduced-motion: reduce) {
    .badge::before { animation: none; }
    .shield { animation: none; }
  }
`);
/** `<sec-badge icon="shield">Eyebrow label</sec-badge>` — small angular tag used above hero
 *  headings, with a glyph (shield by default, echoing the crest mark) and a slow shimmer sweep.
 *  Set `icon` to any key in `icons` (e.g. `icon="rust"`) to swap it per-instance without affecting
 *  every other badge on the site. For a site-specific raster/complex-vector brand mark that can't
 *  be expressed as a `currentColor` icon (sec-ui itself stays asset-free and site-agnostic), set
 *  `icon-src` to an image URL instead — it takes priority over `icon` when both are present. */
export class SecBadge extends SecElement {
    static { this.observedAttributes = ["icon", "icon-src"]; }
    render() {
        this.adopt(css);
        const iconSrc = this.getAttribute("icon-src");
        const glyph = iconSrc
            ? `<img src="${esc(iconSrc)}" alt="" />`
            : (icons[this.getAttribute("icon") || "shield"] ?? icons.shield);
        this.root.innerHTML = `<span class="badge" part="badge"><span class="shield">${glyph}</span><span class="divider"></span><span class="label"><slot></slot></span></span>`;
    }
}
customElements.define("sec-badge", SecBadge);
//# sourceMappingURL=badge.js.map