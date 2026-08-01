/** Observes every `[data-reveal]` under `root`, adding `.is-visible` (with a staggered
 *  `--reveal-delay`) the first time each element scrolls into view. Pairs with reveal.css.
 *  Falls back to revealing everything immediately when the browser can't animate or the
 *  user asked for reduced motion. */
export function initReveal(root = document, opts = {}) {
    const els = Array.from(root.querySelectorAll("[data-reveal]"));
    if (els.length === 0)
        return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
        els.forEach((el) => el.classList.add("is-visible"));
        return;
    }
    const stagger = opts.stagger ?? 70;
    const groupSize = opts.groupSize ?? 6;
    let order = 0;
    const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (!entry.isIntersecting)
                continue;
            const el = entry.target;
            el.style.setProperty("--reveal-delay", `${(order++ % groupSize) * stagger}ms`);
            el.classList.add("is-visible");
            io.unobserve(el);
        }
    }, { threshold: 0.15, rootMargin: "0px 0px -10% 0px" });
    els.forEach((el) => io.observe(el));
}
//# sourceMappingURL=reveal.js.map