import { SecElement } from "../base-element.js";
declare abstract class SecFieldBase extends SecElement {
    static observedAttributes: string[];
    get value(): string;
    set value(v: string);
    protected wireEvents(control: HTMLInputElement | HTMLTextAreaElement): void;
    protected updateCounter(): void;
}
/** `<sec-input label="First name" name="firstName" type="text" required></sec-input>` */
export declare class SecInput extends SecFieldBase {
    render(): void;
}
/** `<sec-textarea label="Message" name="message" maxlength="250" required></sec-textarea>` */
export declare class SecTextarea extends SecFieldBase {
    render(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "sec-input": SecInput;
        "sec-textarea": SecTextarea;
    }
}
export {};
