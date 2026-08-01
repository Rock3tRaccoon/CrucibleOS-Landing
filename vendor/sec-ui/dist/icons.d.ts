/** Minimal inline-SVG icon set — kept tiny and self-contained (no icon font/CDN). */
export declare const icons: {
    chevronDown: string;
    menu: string;
    close: string;
    search: string;
    arrowRight: string;
    external: string;
    sort: string;
    shield: string;
    bolt: string;
    copy: string;
    info: string;
    check: string;
    warning: string;
    danger: string;
    lock: string;
    eye: string;
    /** The official Rust gear mark (rust-lang.org brand assets), traced from the real path data
     *  rather than a line-icon approximation — recolored to currentColor for theming, everything
     *  else left as-is. Sized on its native 144-unit viewBox, unlike the 16-unit icons above, and
     *  sized in `em` so it scales with whatever font-size its host (e.g. sec-badge) sets, rather
     *  than the fixed pixel box the other icons here use. */
    rust: string;
};
export type IconName = keyof typeof icons;
