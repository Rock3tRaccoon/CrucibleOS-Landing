import { customElement, html } from "dom-native";
import { initReveal } from "sec-ui";
import { BaseViewElement } from "./base-v";
import "sec-ui";

const HTML = html`
	<main class="docs-shell">
		<section class="docs-hero" data-reveal>
			<sec-ember-field density="0.5" class="hero-embers"></sec-ember-field>
			<sec-badge>Documentation</sec-badge>
			<h1><sec-impact-text text="CrucibleOS Documentation"></sec-impact-text></h1>
			<p>
				The architecture, security model, and current status of CrucibleOS —
				written the same way the project's internal docs are: what's
				demonstrated today, clearly separated from what's still roadmap.
			</p>
		</section>

		<div class="docs-layout">
			<sec-doc-nav class="docs-sidebar">
				<a href="#overview">Overview</a>
				<a href="#architecture">Architecture</a>
				<a href="#capabilities">Capability Model</a>
				<a href="#security-model">Security Model</a>
				<a href="#editions">Editions &amp; SKUs</a>
				<a href="#faq">FAQ</a>
			</sec-doc-nav>

			<article class="docs-content">
				<section id="overview" data-reveal>
					<h2>Overview</h2>
					<p>
						CrucibleOS is a capability-based operating system — code name
						<b>Forge</b> — written from scratch in Rust. It isn't a hardened
						Linux distribution: there's no Linux kernel, no systemd, no
						legacy C codebase underneath it. Three ideas run through the
						whole design:
					</p>
					<ul>
						<li>No ambient authority — a process only ever has what it's explicitly handed.</li>
						<li>A cryptographically verified, fail-closed boot chain.</li>
						<li>Post-quantum cryptography by default, with no classical-only fallback path.</li>
					</ul>
					<p>
						It boots and runs today — a GPU-accelerated desktop, its own
						hypervisor (<b>Foundry</b>), and a WebAssembly runtime
						(<b>wasm-cbl</b>) — on both x86_64 and AArch64, in QEMU/KVM.
						Bare-metal hardware validation and an independent security review
						are next.
					</p>
					<sec-callout variant="warning" label="Read This First">
						<p>
							CrucibleOS is pre-revenue, built by a two-engineer team, and a
							working prototype, not a finished product. Nothing on this site
							should be read as a certification, an audit result, or a
							production guarantee. See <a href="#security-model">Security
							Model</a> and <a href="#editions">Editions &amp; SKUs</a> for
							exactly what that does and doesn't mean today.
						</p>
					</sec-callout>
				</section>

				<section id="architecture" data-reveal>
					<h2>Architecture</h2>
					<p>
						Userland is built from small, single-purpose service processes
						called <b>crucibles</b> — each one independently sandboxed,
						rather than one monolithic kernel.
					</p>

					<div class="subsystem-grid">
						<div class="subsystem">
							<h3>Forge</h3>
							<p>The capability microkernel itself, written in Rust from scratch.</p>
						</div>
						<div class="subsystem">
							<h3>Temper</h3>
							<p>The post-quantum cryptography layer everything else routes through.</p>
						</div>
						<div class="subsystem">
							<h3>LedgerFS</h3>
							<p>A content-addressed filesystem — files are identified by what they contain, not where they sit.</p>
						</div>
						<div class="subsystem">
							<h3>Foundry</h3>
							<p>CrucibleOS's own lightweight hypervisor, for running other operating systems as guests.</p>
						</div>
						<div class="subsystem">
							<h3>wasm-cbl</h3>
							<p>A WebAssembly runtime for running portable, sandboxed applications.</p>
						</div>
						<div class="subsystem">
							<h3>Crux</h3>
							<p>The package manager, compatible with the Rust crates.io ecosystem.</p>
						</div>
					</div>
				</section>

				<section id="capabilities" data-reveal>
					<h2>Capability Model</h2>
					<p>
						Most operating systems give every process broad authority by
						default, then carve out restrictions after the fact — policy
						layers like SELinux or AppArmor, bolted onto that foundation.
						CrucibleOS works the other way: a process starts with nothing,
						and only ever gains exactly what it's explicitly handed.
					</p>
					<p>
						Those grants are unforgeable and tracked by the kernel, and they
						form a tree — so revoking one automatically revokes everything
						derived from it, in a single step, rather than a manual sweep.
						Some grants are reinforced with cryptographic signatures on top
						of that, for the cases that call for it.
					</p>
				</section>

				<section id="security-model" data-reveal>
					<h2>Security Model</h2>
					<p>
						Cryptographically verified boot, the full threat model, and
						capability domain breakdown live on the dedicated
						<a view="/security">Security</a> page — this section is a
						pointer, not a duplicate.
					</p>
					<sec-callout variant="success" label="Demonstrated Today">
						<p>
							Boot-chain verification is real and demoed, not aspirational:
							a root seal and per-binary TCB signatures are checked before
							anything loads, and a bad signature halts the boot rather than
							continuing. See <a view="/security">Security →</a>.
						</p>
					</sec-callout>
				</section>

				<section id="editions" data-reveal>
					<h2>Editions &amp; SKUs</h2>
					<p>
						Three build editions are active today; several regulated-industry
						editions are named and planned but not yet built. The full table
						is on the <a view="/roadmap">Roadmap</a> page.
					</p>
				</section>

				<section id="faq" data-reveal>
					<h2>FAQ</h2>
					<sec-accordion single>
						<sec-accordion-item heading="Is CrucibleOS a Linux distribution?">
							No. There is no Linux kernel underneath CrucibleOS. It has its
							own microkernel (Forge), its own filesystem (LedgerFS), its own
							hypervisor (Foundry), and its own compositor. A syscall
							rerouting layer lets it run a subset of existing Linux ELF
							binaries directly, but that's a compatibility bridge, not the
							foundation.
						</sec-accordion-item>
						<sec-accordion-item heading="Can I download and install CrucibleOS today?">
							Not yet as a public release. It currently runs in QEMU/KVM for
							development and demonstration; bare-metal hardware validation
							is upcoming work, tracked on the Roadmap page.
						</sec-accordion-item>
						<sec-accordion-item heading="Has CrucibleOS been independently security-audited?">
							No. No independent audit, penetration test, or formal
							verification has been performed yet. The capability model and
							boot chain are implemented and demonstrated, but "demonstrated"
							and "audited" are different claims — we're careful not to
							conflate them.
						</sec-accordion-item>
						<sec-accordion-item heading="What does 'post-quantum by default' mean here?">
							Every signature and key exchange in the boot and IPC session
							setup path uses NIST-standardized post-quantum algorithms
							(ML-KEM-1024, ML-DSA-65, SLH-DSA) — there is no classical-only
							fallback path to quietly downgrade to.
						</sec-accordion-item>
						<sec-accordion-item heading="Is CrucibleOS open source?">
							Licensing and distribution model are undecided as of this
							writing. Reach out via the Contact page if that's relevant to
							your use case.
						</sec-accordion-item>
					</sec-accordion>
				</section>
			</article>
		</div>
	</main>
	<footer-c></footer-c>
`;

@customElement("docs-v")
export class DocsView extends BaseViewElement {
	init() {
		const content = document.importNode(HTML, true);
		this.replaceChildren(content);
		initReveal(this);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"docs-v": DocsView;
	}
}
