import { SecElement } from "../base-element.js";
export interface ThreatEntry {
    category: "crypto" | "isolation" | "audit";
    threat: string;
    defense: string;
}
/** `<sec-threat-matrix>` — set `.threats` (ThreatEntry[]) from host code. Groups entries by
 *  category (crypto / isolation / audit) under a hairline-ruled header, rendering each as a cell
 *  in one shared bordered grid rather than a set of independent, hover-lit cards — deliberately
 *  understated (no colored accent bars, no hover-lift, no glow) so it reads as a compliance/control
 *  matrix, not a marketing feature grid. Category color lives only in the header icon/label. Built
 *  for CrucibleOS's Security page threat model, but generic enough for any threat/defense or
 *  problem/mitigation pairing that reads better grouped than as rows. */
export declare class SecThreatMatrix extends SecElement {
    #private;
    get threats(): ThreatEntry[];
    set threats(v: ThreatEntry[]);
    render(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "sec-threat-matrix": SecThreatMatrix;
    }
}
