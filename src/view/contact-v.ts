import { customElement, getFirst, html, onEvent } from "dom-native";
import { initReveal, type SecButton, type SecInput, type SecTextarea } from "sec-ui";
import { BaseViewElement } from "./base-v";
import "sec-ui";

const HTML = html`
	<main>
		<section class="contact-hero" data-reveal>
			<sec-ember-field density="0.5" class="hero-embers"></sec-ember-field>
			<sec-badge>CrucibleOS</sec-badge>
			<h1><sec-impact-text text="Get in Touch"></sec-impact-text></h1>
			<p>
				Questions about CrucibleOS, the capability model, or a potential
				security engagement — reach us directly.
			</p>
		</section>

		<section data-reveal>
			<div class="tile-container">
				<sec-card>
					<header slot="title">
						<svg viewBox="0 0 32 32" fill="currentColor">
							<path
								d="M28,6H4A2,2,0,0,0,2,8V24a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V8A2,2,0,0,0,28,6ZM25.8,8,16,14.78,6.2,8ZM4,24V8.91l11.43,7.91a1,1,0,0,0,1.14,0L28,8.91V24Z"
							/>
						</svg>
						General Inquiries
					</header>
					<p><a href="mailto:info@lfam.us">info@lfam.us</a></p>
				</sec-card>
				<sec-card>
					<header slot="title">
						<svg viewBox="0 0 32 32" fill="currentColor">
							<path
								d="M16,30A14,14,0,1,1,30,16,14,14,0,0,1,16,30ZM16,4A12,12,0,1,0,28,16,12,12,0,0,0,16,4Z"
							/>
							<path
								d="M15 8h2v10h-2zM15 20h2v2h-2z"
							/>
						</svg>
						Security Engagements
					</header>
					<p>
						<a href="mailto:info@lfam.us?subject=Security%20Engagement%20Inquiry"
							>Capability-security &amp; PQC migration consulting</a
						>
					</p>
				</sec-card>
			</div>
		</section>

		<section data-reveal>
			<h3>Message Us</h3>
			<div class="contact-form">
				<div class="form-row">
					<sec-input class="first-name" label="First name" name="firstName" required></sec-input>
					<sec-input class="last-name" label="Last name" name="lastName" required></sec-input>
				</div>

				<sec-input class="email" label="Email" name="email" type="email" required
					error="Please enter a valid email address."></sec-input>

				<sec-textarea class="message" label="Message" name="message" maxlength="500" required></sec-textarea>

				<sec-button class="send" variant="primary">Send</sec-button>
				<p class="status" role="status"></p>
			</div>
		</section>
	</main>
	<footer-c></footer-c>
`;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@customElement("contact-v")
export class ContactView extends BaseViewElement {
	#firstNameEl!: SecInput;
	#lastNameEl!: SecInput;
	#emailEl!: SecInput;
	#messageEl!: SecTextarea;
	#sendEl!: SecButton;
	#statusEl!: HTMLParagraphElement;

	#showStatus(msg: string) {
		this.#statusEl.textContent = msg;
		setTimeout(() => {
			this.#statusEl.textContent = "";
		}, 5000);
	}

	@onEvent("click", ".send")
	async sendMessage() {
		const firstName = this.#firstNameEl.value.trim();
		const lastName = this.#lastNameEl.value.trim();
		const email = this.#emailEl.value.trim();
		const message = this.#messageEl.value.trim();

		const emailValid = EMAIL_REGEX.test(email);
		this.#emailEl.toggleAttribute("invalid", !emailValid);

		if (!firstName || !lastName || !emailValid || !message) {
			this.#showStatus("Please fill out all fields with a valid email address.");
			return;
		}

		this.#sendEl.setAttribute("disabled", "");
		this.#statusEl.textContent = "Sending...";

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ firstName, lastName, email, message }),
			});

			if (!res.ok) {
				this.#showStatus("Failed to send message. Please try again.");
				return;
			}

			this.#firstNameEl.value = "";
			this.#lastNameEl.value = "";
			this.#emailEl.value = "";
			this.#messageEl.value = "";

			this.#showStatus("Thank you! Your message has been sent successfully.");
		} catch (err) {
			console.error(err);
			this.#showStatus("Failed to send message. Please try again.");
		} finally {
			this.#sendEl.removeAttribute("disabled");
		}
	}

	init() {
		const content = document.importNode(HTML, true);

		[this.#firstNameEl, this.#lastNameEl, this.#emailEl, this.#messageEl, this.#sendEl, this.#statusEl] =
			getFirst(content, ".first-name", ".last-name", ".email", ".message", ".send", ".status") as [
				SecInput,
				SecInput,
				SecInput,
				SecTextarea,
				SecButton,
				HTMLParagraphElement,
			];

		this.replaceChildren(content);
		initReveal(this);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"contact-v": ContactView;
	}
}
