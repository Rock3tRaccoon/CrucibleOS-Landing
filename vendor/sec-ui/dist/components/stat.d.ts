import { SecElement } from "../base-element.js";
/** `<sec-stat label="Domain" value="Systems Security"></sec-stat>` — a small metric tile styled
 *  like a schematic readout cell: faint grid texture, corner ticks, accent bar on hover. */
export declare class SecStat extends SecElement {
    static observedAttributes: string[];
    render(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "sec-stat": SecStat;
    }
}
