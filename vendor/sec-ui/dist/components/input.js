import { SecElement, sheet } from "../base-element.js";
const css = sheet(`
  :host { display: block; }
  label {
    display: block;
    font-family: var(--sec-font-mono);
    font-size: var(--sec-fs-xs);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--sec-text-secondary);
    margin-bottom: var(--sec-space-2);
  }
  .control {
    width: 100%;
    box-sizing: border-box;
    background: var(--sec-bg-field);
    border: 1px solid var(--sec-line);
    border-radius: var(--sec-radius-sm);
    color: var(--sec-text);
    font-family: var(--sec-font-sans);
    font-size: var(--sec-fs-body);
    padding: 11px 14px;
    transition: border-color var(--sec-transition-fast), background var(--sec-transition-fast);
  }
  .control::placeholder { color: var(--sec-text-muted); }
  .control:focus {
    outline: none;
    border-color: var(--sec-accent);
    background: var(--sec-bg-2);
    box-shadow: 0 0 0 3px var(--sec-accent-subtle);
  }
  :host([invalid]) .control { border-color: var(--sec-danger); }
  .error {
    display: none;
    margin-top: var(--sec-space-2);
    font-size: var(--sec-fs-xs);
    color: var(--sec-danger);
  }
  :host([invalid]) .error { display: block; }
  textarea.control { resize: vertical; min-height: 120px; font-family: var(--sec-font-sans); }
  .counter {
    margin-top: var(--sec-space-2);
    text-align: right;
    font-family: var(--sec-font-mono);
    font-size: var(--sec-fs-xs);
    color: var(--sec-text-muted);
  }
`);
class SecFieldBase extends SecElement {
    static { this.observedAttributes = ["label", "placeholder", "required", "invalid", "error", "maxlength", "type", "name", "value"]; }
    get value() {
        return this.$("input,textarea")?.value ?? "";
    }
    set value(v) {
        const el = this.$("input,textarea");
        if (el)
            el.value = v;
    }
    wireEvents(control) {
        control.addEventListener("input", () => {
            this.emit("sec-input", { value: control.value });
            this.updateCounter();
        });
        control.addEventListener("change", () => this.emit("sec-change", { value: control.value }));
    }
    updateCounter() {
        const counter = this.$(".counter");
        const maxlength = this.getAttribute("maxlength");
        if (!counter || !maxlength)
            return;
        const len = this.value.length;
        counter.textContent = `${len} / ${maxlength}`;
    }
}
/** `<sec-input label="First name" name="firstName" type="text" required></sec-input>` */
export class SecInput extends SecFieldBase {
    render() {
        this.adopt(css);
        const label = this.getAttribute("label");
        const type = this.getAttribute("type") ?? "text";
        const placeholder = this.getAttribute("placeholder") ?? "";
        const required = this.hasAttribute("required");
        const name = this.getAttribute("name") ?? "";
        const error = this.getAttribute("error") ?? "This field is invalid.";
        const value = this.getAttribute("value") ?? "";
        this.root.innerHTML = `
      ${label ? `<label part="label">${label}${required ? " *" : ""}</label>` : ""}
      <input class="control" part="control" type="${type}" name="${name}" placeholder="${placeholder}"
        ${required ? "required" : ""} value="${value}" />
      <p class="error" part="error">${error}</p>
    `;
        this.wireEvents(this.$("input"));
    }
}
/** `<sec-textarea label="Message" name="message" maxlength="250" required></sec-textarea>` */
export class SecTextarea extends SecFieldBase {
    render() {
        this.adopt(css);
        const label = this.getAttribute("label");
        const placeholder = this.getAttribute("placeholder") ?? "";
        const required = this.hasAttribute("required");
        const name = this.getAttribute("name") ?? "";
        const maxlength = this.getAttribute("maxlength");
        const error = this.getAttribute("error") ?? "This field is invalid.";
        const value = this.getAttribute("value") ?? "";
        this.root.innerHTML = `
      ${label ? `<label part="label">${label}${required ? " *" : ""}</label>` : ""}
      <textarea class="control" part="control" name="${name}" placeholder="${placeholder}"
        ${required ? "required" : ""} ${maxlength ? `maxlength="${maxlength}"` : ""}>${value}</textarea>
      ${maxlength ? `<p class="counter" part="counter">${value.length} / ${maxlength}</p>` : ""}
      <p class="error" part="error">${error}</p>
    `;
        this.wireEvents(this.$("textarea"));
    }
}
customElements.define("sec-input", SecInput);
customElements.define("sec-textarea", SecTextarea);
//# sourceMappingURL=input.js.map