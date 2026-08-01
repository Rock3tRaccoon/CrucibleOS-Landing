import { customElement, elem, getFirst, html, onHub } from "dom-native";
import { isNotEmpty } from "utils-min";
import { BaseViewElement } from "./base-v";
import { pathAt } from "src/router";
import "sec-ui";

const tagNameByPath: { [name: string]: string } = {
	"": "landing-v",
	docs: "docs-v",
	security: "security-v",
	roadmap: "roadmap-v",
	contact: "contact-v",
};

const HTML = html`
	<sec-magma-field points="24" class="bg-magma"></sec-magma-field>
	<header>
		<cr-header></cr-header>
	</header>
	<main></main>
`;

@customElement("root-v")
export class RootView extends BaseViewElement {
	#mainEl!: HTMLElement;
	#headerEl!: HTMLElement;

	@onHub("Route", "CHANGE")
	routChange() {
		this.refresh();
	}

	init() {
		const content = document.importNode(HTML, true);
		[this.#mainEl, this.#headerEl] = getFirst(content, "main", "header");
		this.replaceChildren(content);

		this.refresh();
	}

	refresh() {
		if (this.hasPathChanged(0)) {
			const newPath = pathAt(0);
			const name = isNotEmpty(newPath) ? newPath : "";

			const tagName = tagNameByPath[name] ?? "notfound-v";

			this.#mainEl.replaceChildren(elem(`${tagName}`));
			this.#mainEl.scrollTo(0, 0);
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"root-v": RootView;
	}
}
