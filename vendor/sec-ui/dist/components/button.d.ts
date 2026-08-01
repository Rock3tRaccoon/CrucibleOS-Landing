import { SecElement } from "../base-element.js";
/** `<sec-button variant="primary|secondary|ghost|danger" size="md|sm" href="" view="" disabled type="button|submit">` */
export declare class SecButton extends SecElement {
    static observedAttributes: string[];
    connectedCallback(): void;
    render(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "sec-button": SecButton;
    }
}
