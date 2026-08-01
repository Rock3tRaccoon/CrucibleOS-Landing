import { SecElement } from "../base-element.js";
/** `<sec-code-block lang="rust" title="cap.rs">…raw code as text content…</sec-code-block>` — a
 *  dedented, monospace code frame with a copy-to-clipboard button. No syntax highlighting —
 *  kept intentionally plain, a tokenizer is more machinery than a docs site needs. */
export declare class SecCodeBlock extends SecElement {
    #private;
    static observedAttributes: string[];
    render(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "sec-code-block": SecCodeBlock;
    }
}
