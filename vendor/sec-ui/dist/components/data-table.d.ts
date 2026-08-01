import { SecElement } from "../base-element.js";
export interface SecColumn {
    key: string;
    label: string;
    sortable?: boolean;
    /** Column-specific cell renderer; return raw HTML (already escaped by the caller if needed). */
    render?: (row: Record<string, unknown>) => string;
    width?: string;
}
/** `<sec-data-table searchable>` — generic sortable/searchable table. Set `.columns` and `.rows`
 *  as properties (not attributes) from host code. Emits `rowclick` with `{ row }` in detail. */
export declare class SecDataTable extends SecElement {
    #private;
    static observedAttributes: string[];
    get columns(): SecColumn[];
    set columns(v: SecColumn[]);
    get rows(): Record<string, unknown>[];
    set rows(v: Record<string, unknown>[]);
    render(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "sec-data-table": SecDataTable;
    }
}
