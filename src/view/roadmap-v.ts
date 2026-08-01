import { customElement, html } from "dom-native";
import { initReveal, type SecDataTable } from "sec-ui";
import { BaseViewElement } from "./base-v";
import "sec-ui";

const SKU_COLUMNS: SecDataTable["columns"] = [
	{ key: "sku", label: "Edition", sortable: true },
	{
		key: "status",
		label: "Status",
		render: (r) =>
			r.status === "Active"
				? `<sec-tag variant="success">Active</sec-tag>`
				: `<sec-tag variant="warning">Planned</sec-tag>`,
	},
	{ key: "target", label: "Target" },
];

const SKU_ROWS: SecDataTable["rows"] = [
	{ sku: "minimal", status: "Active", target: "Embedded / bare-metal — no filesystem or networking, temper-cbl only, maximum determinism." },
	{ sku: "server", status: "Active", target: "Cloud / API / CI — full networking and filesystem, no GUI." },
	{ sku: "desktop", status: "Active", target: "Developer / analyst workstation — full GUI, EDF scheduler for the compositor." },
	{ sku: "aerospace", status: "Planned", target: "Avionics — targeting DO-178C DAL A relevance." },
	{ sku: "automotive", status: "Planned", target: "Targeting ISO 26262 ASIL-D relevance." },
	{ sku: "defense", status: "Planned", target: "Targeting Common Criteria EAL5+ relevance." },
	{ sku: "industrial", status: "Planned", target: "Targeting IEC 62443 SL 3+ relevance." },
];

const HTML = html`
	<main class="roadmap-shell">
		<section class="roadmap-hero" data-reveal>
			<sec-ember-field density="0.5" class="hero-embers"></sec-ember-field>
			<sec-badge>Roadmap</sec-badge>
			<h1><sec-impact-text text="What's Shipped, What's Planned"></sec-impact-text></h1>
			<p>
				CrucibleOS is a working prototype, not a finished product. This page
				is a plain accounting of what's real today versus what's still ahead.
			</p>
		</section>

		<section class="status-columns" data-reveal>
			<div class="status-col">
				<h2 class="col-heading working">Working Today</h2>
				<ul>
					<li>Boots and runs on x86_64 and AArch64 in QEMU/KVM, with a GPU-accelerated desktop, file manager, text editor, and shell.</li>
					<li>Capability-based process isolation, enforced and verified.</li>
					<li>A cryptographically verified, fail-closed boot chain.</li>
					<li>Post-quantum cryptography throughout boot and inter-process communication — no classical-only fallback.</li>
					<li>Three ways to run existing software: a native Linux compatibility layer, a hypervisor (Foundry) that boots real Linux guests, and a WebAssembly runtime (wasm-cbl).</li>
				</ul>
			</div>
			<div class="status-col">
				<h2 class="col-heading not-yet">Not Yet True</h2>
				<ul>
					<li>No independent security audit, penetration test, or formal verification.</li>
					<li>No bare-metal hardware validation — QEMU/KVM only, so far.</li>
					<li>The compatibility layers (Linux, Foundry, wasm-cbl) are still limited — no networking, single-core guests, no GPU passthrough.</li>
					<li>Licensing and open-source status are undecided.</li>
				</ul>
			</div>
		</section>

		<section class="editions-section" data-reveal>
			<div class="section-header">
				<sec-forge-seam class="accent-line"></sec-forge-seam>
				<h2>Editions &amp; SKUs</h2>
			</div>
			<p class="section-lead">
				Three build editions are active today. Several regulated-industry
				editions are named to signal intended markets, but aren't built yet.
			</p>
			<sec-data-table class="sku-table" searchable></sec-data-table>
		</section>
	</main>
	<footer-c></footer-c>
`;

@customElement("roadmap-v")
export class RoadmapView extends BaseViewElement {
	init() {
		const content = document.importNode(HTML, true);
		this.replaceChildren(content);

		const table = this.cacheFirst(".sku-table") as SecDataTable | null;
		if (table) {
			table.columns = SKU_COLUMNS;
			table.rows = SKU_ROWS;
		}

		initReveal(this);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"roadmap-v": RoadmapView;
	}
}
