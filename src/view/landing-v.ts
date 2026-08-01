import { customElement, html } from "dom-native";
import { initReveal, type SecTerminal } from "sec-ui";
import { BaseViewElement } from "./base-v";
import "sec-ui";

const BOOT_LINES: SecTerminal["lines"] = [
	{ text: "[boot] Forge kernel — capability microkernel (x86_64-crucible)", tone: "muted" },
	{ text: "[boot] verifying root seal — ML-DSA-65 + SLH-DSA", tone: "muted" },
	{ text: "[ ok ] root seal verified", tone: "ok" },
	{ text: "[boot] loading TCB binaries", tone: "muted" },
	{ text: "[ ok ] temper-cbl.elf.sig verified", tone: "ok" },
	{ text: "[ ok ] fs-cbl.elf.sig verified", tone: "ok" },
	{ text: "[ ok ] proc-mgr.elf.sig verified", tone: "ok" },
	{ text: "[boot] mounting LedgerFS — content-addressed store", tone: "muted" },
	{ text: "[ ok ] LedgerFS mounted", tone: "ok" },
	{ text: "[boot] spawning capability-scoped services", tone: "muted" },
	{ text: "[ ok ] net-cbl — 0 ambient capabilities granted", tone: "ok" },
	{ text: "[ ok ] audit-cbl — sealed ledger active", tone: "ok" },
	{ text: "[ ok ] CrucibleOS ready", tone: "ok" },
];

const HTML = html`
	<main class="landing-shell">
		<!-- HERO -->
		<section class="hero-section">
			<sec-hull-field class="hero-backdrop"></sec-hull-field>
			<sec-ember-field density="0.8" class="hero-embers"></sec-ember-field>

			<div class="hero-left" data-reveal>
				<sec-badge icon="rust">Forge Kernel · Rust</sec-badge>

				<h1><sec-impact-text text="A Capability-Based Operating System, Built From Scratch"></sec-impact-text></h1>

				<p class="hero-description">
					CrucibleOS is not a hardened Linux distribution. It's a
					capability-based operating system written from scratch in Rust,
					with a cryptographically verified boot chain and post-quantum
					cryptography designed in from day one — not bolted on after the fact.
				</p>

				<div class="hero-buttons">
					<sec-button variant="primary" view="/docs">Read the Docs</sec-button>
					<sec-button variant="secondary" view="/security">Explore the Security Model</sec-button>
				</div>
			</div>

			<div class="hero-right" data-reveal>
				<sec-terminal title="forge — boot console" class="boot-terminal"></sec-terminal>
			</div>
		</section>

		<!-- CURRENT STATUS — honesty by design -->
		<section class="status-section" data-reveal>
			<sec-callout variant="warning" label="Current Status">
				<p>
					CrucibleOS is a working prototype (self-assessed TRL 3–4), not a
					finished product. It boots and runs a GPU-accelerated desktop, a
					native hypervisor, and a WASM runtime today in QEMU/KVM. Hardware
					validation and an independent security review are the next
					milestones — see the <a view="/roadmap">roadmap</a> for what's
					shipped versus planned.
				</p>
			</sec-callout>
		</section>

		<!-- THREE EXECUTION MODELS -->
		<section class="models-section">
			<div class="section-header" data-reveal>
				<sec-forge-seam class="accent-line"></sec-forge-seam>
				<h2>One Security Substrate, Three Compatibility Paths</h2>
			</div>
			<p class="section-lead" data-reveal>
				Adopters choose the execution model per workload, not a
				one-size-fits-all mandate — so the security benefits show up during
				migration, not after a flag-day rewrite.
			</p>

			<div class="model-grid">
				<sec-card data-reveal>
					<h3 slot="title">Native Syscall Rerouting</h3>
					<p>
						Run existing Linux ELF binaries directly against Forge's syscall
						layer — no VM, no recompilation. Covers a POSIX subset today
						(fork/exec/file I/O/memory/time); networking is not yet
						implemented.
					</p>
				</sec-card>

				<sec-card data-reveal>
					<h3 slot="title">Foundry — Native Hypervisor</h3>
					<p>
						Run any unmodified guest OS in a crash-isolated VM under
						Foundry, CrucibleOS's own hypervisor. The privileged kernel TCB
						is reduced to enable-virtualization, nested paging, and VM-exit
						dispatch — the entire device model runs as an unprivileged
						userspace process (<code>cast-cbl</code>), a design we call a
						<b>Type-0 hypervisor</b>.
					</p>
				</sec-card>

				<sec-card data-reveal>
					<h3 slot="title">wasm-cbl — WASI Runtime</h3>
					<p>
						Run real, unmodified <code>wasm32-wasip1</code> binaries,
						sandboxed by construction, portable across x86_64 and AArch64.
						Full WASI preview1 surface, verified against independently
						compiled test binaries.
					</p>
				</sec-card>
			</div>
		</section>

		<!-- SECURITY PILLARS -->
		<section class="pillars-section">
			<div class="section-header" data-reveal>
				<sec-forge-seam class="accent-line"></sec-forge-seam>
				<h2>Security Designed In, Not Bolted On</h2>
			</div>

			<div class="pillar-grid">
				<sec-stat label="Process Isolation" value="Capability-Based" data-reveal></sec-stat>
				<sec-stat label="Boot Chain" value="Cryptographically Verified" data-reveal></sec-stat>
				<sec-stat label="Cryptography" value="Post-Quantum (ML-KEM, ML-DSA, SLH-DSA)" data-reveal></sec-stat>
				<sec-stat label="Language" value="Rust — Zero Legacy C" data-reveal></sec-stat>
			</div>

			<div class="pillar-copy" data-reveal>
				<p>
					Most operating systems bolt security policy onto an
					ambient-authority foundation after the fact — every process starts
					with broad implicit authority, and hardening carves exceptions down
					from there. CrucibleOS's capability model works the other way: a
					process has literally nothing it wasn't explicitly handed at spawn
					or delegation, enforced by unforgeable, kernel-managed tokens.
				</p>
			</div>

			<div class="siege-teaser" data-reveal>
				<sec-siege-field class="siege-demo-sm"></sec-siege-field>
				<div class="siege-teaser-copy">
					<p class="siege-teaser-label">Live, Not a Mockup</p>
					<p>
						This is a real Rust simulation, compiled to WebAssembly, running
						the actual capability-tree revocation algorithm — not a canvas
						animation standing in for one.
					</p>
					<sec-button variant="secondary" size="sm" view="/security">See It Full-Size →</sec-button>
				</div>
			</div>
		</section>

		<!-- CTA -->
		<section class="cta" data-reveal>
			<sec-ember-field density="0.5" class="cta-embers"></sec-ember-field>
			<h2>Read the architecture, then decide for yourself</h2>
			<p>
				The documentation covers the Forge kernel, LedgerFS, Temper's
				cryptographic layers, and exactly what's demonstrated today versus
				still on the roadmap.
			</p>
			<sec-button variant="primary" view="/docs">Go to Documentation</sec-button>
		</section>
	</main>
	<footer-c></footer-c>
`;

@customElement("landing-v")
export class LandingView extends BaseViewElement {
	init() {
		const content = document.importNode(HTML, true);
		this.replaceChildren(content);

		const terminal = this.cacheFirst(".boot-terminal") as SecTerminal | null;
		if (terminal) terminal.lines = BOOT_LINES;

		initReveal(this);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"landing-v": LandingView;
	}
}
