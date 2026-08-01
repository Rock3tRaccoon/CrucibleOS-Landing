import { SecElement } from "../base-element.js";
/** `<sec-tag variant="neutral|accent|success|warning|danger|purple">Label</sec-tag>` */
export declare class SecTag extends SecElement {
    static observedAttributes: string[];
    render(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "sec-tag": SecTag;
    }
}
