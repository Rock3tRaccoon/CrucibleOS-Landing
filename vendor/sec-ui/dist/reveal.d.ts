/** Observes every `[data-reveal]` under `root`, adding `.is-visible` (with a staggered
 *  `--reveal-delay`) the first time each element scrolls into view. Pairs with reveal.css.
 *  Falls back to revealing everything immediately when the browser can't animate or the
 *  user asked for reduced motion. */
export declare function initReveal(root?: ParentNode, opts?: {
    stagger?: number;
    groupSize?: number;
}): void;
