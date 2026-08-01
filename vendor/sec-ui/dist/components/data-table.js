import { SecElement, sheet, esc } from "../base-element.js";
import { icons } from "../icons.js";
const css = sheet(`
  :host { display: block; }
  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sec-space-4);
    margin-bottom: var(--sec-space-4);
  }
  .search {
    display: flex;
    align-items: center;
    gap: var(--sec-space-2);
    border: 1px solid var(--sec-line);
    border-radius: var(--sec-radius-sm);
    padding: 8px 12px;
    color: var(--sec-text-muted);
    background: var(--sec-bg-field);
    max-width: 280px;
    width: 100%;
  }
  .search:focus-within { border-color: var(--sec-accent); color: var(--sec-accent); }
  .search input {
    all: unset;
    flex: 1;
    color: var(--sec-text);
    font-family: var(--sec-font-mono);
    font-size: var(--sec-fs-sm);
  }
  .count {
    font-family: var(--sec-font-mono);
    font-size: var(--sec-fs-xs);
    color: var(--sec-text-muted);
    white-space: nowrap;
  }
  table { width: 100%; border-collapse: collapse; }
  thead th {
    text-align: left;
    font-family: var(--sec-font-mono);
    font-size: var(--sec-fs-xs);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--sec-text-muted);
    padding: var(--sec-space-2) var(--sec-space-3);
    border-bottom: 1px solid var(--sec-line);
    user-select: none;
  }
  thead th[data-sortable] { cursor: pointer; }
  thead th[data-sortable]:hover { color: var(--sec-text); }
  .th-inner { display: inline-flex; align-items: center; gap: var(--sec-space-1); }
  .th-inner .sort-icon { opacity: 0.4; }
  th[data-active] .sort-icon { opacity: 1; color: var(--sec-accent); }
  tbody tr {
    border-bottom: 1px solid var(--sec-line-soft);
    transition: background var(--sec-transition-fast);
  }
  tbody tr:hover { background: rgba(255, 255, 255, 0.025); }
  tbody td {
    padding: var(--sec-space-3);
    font-size: var(--sec-fs-sm);
    color: var(--sec-text-secondary);
    vertical-align: middle;
  }
  tbody tr[data-clickable] { cursor: pointer; }
  .empty { padding: var(--sec-space-7) var(--sec-space-3); text-align: center; color: var(--sec-text-muted); }
`);
/** `<sec-data-table searchable>` — generic sortable/searchable table. Set `.columns` and `.rows`
 *  as properties (not attributes) from host code. Emits `rowclick` with `{ row }` in detail. */
export class SecDataTable extends SecElement {
    static { this.observedAttributes = ["searchable"]; }
    #columns = [];
    #rows = [];
    #sortKey = null;
    #sortDir = 1;
    #query = "";
    get columns() {
        return this.#columns;
    }
    set columns(v) {
        this.#columns = v;
        this.render();
    }
    get rows() {
        return this.#rows;
    }
    set rows(v) {
        this.#rows = v;
        this.render();
    }
    #visibleRows() {
        let rows = this.#rows;
        if (this.#query) {
            const q = this.#query.toLowerCase();
            rows = rows.filter((r) => Object.values(r).some((v) => String(v ?? "").toLowerCase().includes(q)));
        }
        if (this.#sortKey) {
            const key = this.#sortKey;
            rows = [...rows].sort((a, b) => {
                const av = a[key], bv = b[key];
                if (av == null)
                    return 1;
                if (bv == null)
                    return -1;
                return av > bv ? this.#sortDir : av < bv ? -this.#sortDir : 0;
            });
        }
        return rows;
    }
    render() {
        this.adopt(css);
        const searchable = this.hasAttribute("searchable");
        const rows = this.#visibleRows();
        const head = this.#columns
            .map((c) => {
            const active = this.#sortKey === c.key;
            return `<th data-sortable="${!!c.sortable}" ${active ? "data-active" : ""} data-key="${c.key}" style="${c.width ? `width:${c.width}` : ""}">
          <span class="th-inner">${esc(c.label)}${c.sortable ? `<span class="sort-icon">${icons.sort}</span>` : ""}</span>
        </th>`;
        })
            .join("");
        const body = rows.length
            ? rows
                .map((r) => `<tr data-row>${this.#columns
                .map((c) => `<td>${c.render ? c.render(r) : esc(r[c.key])}</td>`)
                .join("")}</tr>`)
                .join("")
            : `<tr><td class="empty" colspan="${this.#columns.length}">No matching entries.</td></tr>`;
        this.root.innerHTML = `
      <div class="toolbar">
        ${searchable
            ? `<label class="search" part="search">${icons.search}<input type="text" placeholder="Filter…" value="${esc(this.#query)}" /></label>`
            : "<span></span>"}
        <span class="count" part="count">${rows.length} ${rows.length === 1 ? "entry" : "entries"}</span>
      </div>
      <table part="table">
        <thead><tr>${head}</tr></thead>
        <tbody>${body}</tbody>
      </table>
    `;
        this.$$("th[data-sortable='true']").forEach((th) => {
            th.addEventListener("click", () => {
                const key = th.dataset.key;
                if (this.#sortKey === key)
                    this.#sortDir = this.#sortDir === 1 ? -1 : 1;
                else {
                    this.#sortKey = key;
                    this.#sortDir = 1;
                }
                this.render();
            });
        });
        this.$$("tr[data-row]").forEach((tr, i) => {
            tr.setAttribute("data-clickable", "");
            tr.addEventListener("click", () => this.emit("rowclick", { row: rows[i] }));
        });
        const search = this.$(".search input");
        search?.addEventListener("input", () => {
            this.#query = search.value;
            this.render();
            this.$(".search input").focus();
            const val = this.$(".search input");
            val.selectionStart = val.selectionEnd = val.value.length;
        });
    }
}
customElements.define("sec-data-table", SecDataTable);
//# sourceMappingURL=data-table.js.map