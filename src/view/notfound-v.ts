import { customElement, html, onEvent } from "dom-native";
import { initReveal } from "sec-ui";
import { BaseViewElement } from "./base-v";
import "sec-ui";

const HTML = html`
	<sec-blueprint-field density="0.7" class="nf-field"></sec-blueprint-field>
	<div class="nf-vignette"></div>
	<main>
		<section data-reveal>
			<h2 class="main"><sec-reveal-text text="404 — Page Not Found"></sec-reveal-text></h2>
			<p class="shadow">
				How did you get here? The page you are looking for does not exist.<br />
				Here is your way back!
			</p>
		</section>
		<section class="buttons" data-reveal>
			<sec-button variant="primary" view="/">Go to home page</sec-button>
			<sec-button variant="secondary" class="back">Go back</sec-button>
		</section>
	</main>
`;

@customElement("notfound-v")
export class NotFoundView extends BaseViewElement {
	@onEvent("click", ".back")
	onBack() {
		window.history.back();
	}
	init() {
		const content = document.importNode(HTML, true);
		this.replaceChildren(content);
		initReveal(this);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"notfound-v": NotFoundView;
	}
}
