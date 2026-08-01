import { BaseHTMLElement, customElement, getFirst, html } from "dom-native";
import "sec-ui";

const HTML = html`
	<sec-footer col-1-title="Product" col-2-title="Company" col-3-title="Contact">
		<div slot="brand">
			<h3 class="footer-title">CrucibleOS</h3>
			<p class="footer-subtitle">
				A capability-based operating system built from scratch in Rust, with
				a cryptographically verified boot chain and post-quantum cryptography
				designed in from day one — not bolted on after the fact.
			</p>
			<p class="footer-meta">Built by Sing Security.</p>
		</div>

		<a slot="col-1" view="/docs">Documentation</a>
		<a slot="col-1" view="/security">Security Model</a>
		<a slot="col-1" view="/roadmap">Roadmap &amp; Editions</a>

		<a slot="col-2" href="https://www.singsecurity.com/" target="_blank" rel="noopener">Sing Security</a>
		<a slot="col-2" view="/contact">Contact</a>

		<a slot="col-3" href="mailto:info@lfam.us">info@lfam.us</a>

		<span class="footer-year"></span>
		<sec-tag slot="bottom-right" variant="warning">Working Prototype — TRL 3–4</sec-tag>
	</sec-footer>
`;

@customElement("footer-c")
export class FooterComponent extends BaseHTMLElement {
	#yearEl!: HTMLElement;
	init() {
		const content = document.importNode(HTML, true);
		this.#yearEl = getFirst(content, ".footer-year");
		this.#yearEl.textContent = `© ${new Date().getFullYear()} CrucibleOS`;
		this.replaceChildren(content);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"footer-c": FooterComponent;
	}
}
