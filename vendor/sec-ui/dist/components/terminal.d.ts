import { SecElement } from "../base-element.js";
export interface SecTerminalLine {
    text: string;
    tone?: "ok" | "warn" | "fail" | "muted";
}
/** `<sec-terminal title="…">` — set `.lines` (SecTerminalLine[]) from host code; types a boot-log
 *  style sequence into a terminal-chrome frame once the element scrolls into view. Plays once;
 *  reduced-motion or an empty viewport renders the final state immediately, no animation. */
export declare class SecTerminal extends SecElement {
    #private;
    static observedAttributes: string[];
    get lines(): SecTerminalLine[];
    set lines(v: SecTerminalLine[]);
    render(): void;
    disconnectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "sec-terminal": SecTerminal;
    }
}
