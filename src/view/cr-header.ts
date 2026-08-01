import { customElement, html } from "dom-native";
import { BaseViewElement } from "./base-v";
import "sec-ui";

const HEADER_HTML = html`
	<sec-nav>
		<a slot="brand" view="/">
			<img class="brand-mark" src="images/logo-mark.png" alt="" width="40" height="45" />
			<span>CrucibleOS</span>
		</a>
		<a slot="links" view="/docs">Docs</a>
		<a slot="links" view="/security">Security</a>
		<a slot="links" view="/roadmap">Roadmap</a>
		<a slot="links" view="/contact">Contact</a>
		<sec-button slot="cta" variant="primary" size="sm" view="/docs">Read the Docs</sec-button>
	</sec-nav>
`;

@customElement("cr-header")
export class CrHeader extends BaseViewElement {
	init() {
		let content = document.importNode(HEADER_HTML, true);
		this.replaceChildren(content);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"cr-header": CrHeader;
	}
}
