import { customElement, html } from "dom-native";
import { initReveal, type SecTerminal, type SecThreatMatrix } from "sec-ui";
import { BaseViewElement } from "./base-v";
import "sec-ui";

const THREAT_ENTRIES: SecThreatMatrix["threats"] = [
	{
		category: "crypto",
		threat: "Harvest-now, decrypt-later",
		defense: "ML-KEM-1024 (FIPS 203) key exchange everywhere — no classical-only fallback path to quietly downgrade to.",
	},
	{
		category: "crypto",
		threat: "Unauthorized data access, at rest or in transit",
		defense: "Vault (.vfc) and LedgerFS give tamper-evidence via BLAKE3 Merkle trees and ML-DSA-65 signatures; encryption-at-rest isn't wired into any live read path yet.",
	},
	{
		category: "crypto",
		threat: "Weak randomness",
		defense: "Root MasterKey generated once from hardware entropy at boot (x86_64 today); all derived keys via BLAKE3 with domain separation.",
	},
	{
		category: "isolation",
		threat: "Privilege escalation",
		defense: "Capability model — no ambient authority, unforgeable kernel-managed tokens, least privilege at spawn.",
	},
	{
		category: "isolation",
		threat: "Code injection / ret2usr",
		defense: "SMEP/SMAP hardware enforcement at the kernel/userspace boundary.",
	},
	{
		category: "isolation",
		threat: "Cross-process memory snooping",
		defense: "Capability-scoped memory grants isolate process address spaces; crypto-pager adds per-page memory encryption where compliance targets require it (currently the Defense/CC EAL5+ SKU).",
	},
	{
		category: "isolation",
		threat: "Supply-chain / binary tampering",
		defense: "Signed .elf.sig verification for every binary in the trusted computing base, checked at boot — fails closed on mismatch.",
	},
	{
		category: "audit",
		threat: "Audit-log tampering",
		defense: "LedgerFS append-only, tamper-evident audit chain, sealed with SLH-DSA for long-lived integrity.",
	},
	{
		category: "audit",
		threat: "Basic side-channels",
		defense: "Acknowledged risk — active hardening, not yet a closed item. Not independently audited.",
	},
];

const BOOT_FAIL_LINES: SecTerminal["lines"] = [
	{ text: "[boot] loading TCB binaries", tone: "muted" },
	{ text: "[ ok ] temper-cbl.elf.sig verified", tone: "ok" },
	{ text: "[fail] fs-cbl.elf.sig invalid", tone: "fail" },
	{ text: "[FATAL] TCB signature invalid — halting (fail-closed)", tone: "fail" },
];

const HTML = html`
	<main class="security-shell">
		<section class="security-hero" data-reveal>
			<sec-ember-field density="0.5" class="hero-embers"></sec-ember-field>
			<sec-badge>Security Model</sec-badge>
			<h1><sec-impact-text text="Capability-Based, Verified, Post-Quantum"></sec-impact-text></h1>
			<p>
				CrucibleOS's security model is built from three parts that are
				usually retrofitted onto an existing OS: object-capability
				isolation, a cryptographically verified boot chain, and post-quantum
				cryptography with no classical-only fallback.
			</p>
		</section>

		<section class="capability-domains" data-reveal>
			<div class="section-header">
				<sec-forge-seam class="accent-line"></sec-forge-seam>
				<h2>Capability Domains</h2>
			</div>
			<p class="section-lead">
				Every process is placed in a domain at spawn; authority only
				narrows moving outward, never widens.
			</p>
			<div class="domain-row">
				<div class="domain">
					<span class="domain-tag">System</span>
					<p>Kernel-only. Not reachable from userspace.</p>
				</div>
				<span class="domain-arrow">→</span>
				<div class="domain">
					<span class="domain-tag">Admin</span>
					<p>Gated by forge-admin. Elevation is a temporary, auto-revoked, fail-closed protocol.</p>
				</div>
				<span class="domain-arrow">→</span>
				<div class="domain">
					<span class="domain-tag">Application</span>
					<p>Standard userspace processes — only the capabilities they were explicitly handed.</p>
				</div>
				<span class="domain-arrow">→</span>
				<div class="domain">
					<span class="domain-tag">Sandboxed</span>
					<p>Least-privilege domain for untrusted workloads — the default for wasm-cbl guests.</p>
				</div>
			</div>

			<div class="siege-wrap" data-reveal>
				<sec-siege-field class="siege-demo"></sec-siege-field>
				<p class="siege-caption">
					A live simulation of this exact tree — not a stand-in. Most sparks
					simply shatter on arrival — deflected, nothing to escalate through.
					The rare one that actually connects visibly turns its target: a
					brief window where it's shown probing its own neighbors, before the
					capability model's own integrity check — the real recursive
					descendant-traversal it uses to cascade-revoke a subtree in one
					call, compiled from Rust to WebAssembly — catches the broken
					derivation chain and cuts the whole branch outright. It then
					regrows and visibly reheats as it's restored.
				</p>
			</div>
		</section>

		<section class="boot-section" data-reveal>
			<div class="section-header">
				<sec-forge-seam class="accent-line"></sec-forge-seam>
				<h2>Cryptographically Verified, Fail-Closed Boot</h2>
			</div>
			<p class="section-lead">
				A root seal (ML-DSA-65 + SLH-DSA signature over the LedgerFS
				superblock) is verified first. Every TCB binary then has its own
				signed <code>.elf.sig</code> sidecar checked before it loads. A bad
				signature doesn't warn and continue — it halts the boot.
			</p>
			<sec-terminal title="forge — boot console (signature mismatch)" class="fail-terminal"></sec-terminal>
			<sec-callout variant="success" label="Demonstrated Today">
				<p>
					This is a real, captured behavior — not a design aspiration. It
					has also already caught a real bug once: a silently-overwritten
					signature sidecar, found and fixed during development.
				</p>
			</sec-callout>
		</section>

		<section class="crypto-section" data-reveal>
			<div class="section-header">
				<sec-forge-seam class="accent-line"></sec-forge-seam>
				<h2>Post-Quantum Cryptography, By Default</h2>
			</div>
			<div class="crypto-grid">
				<sec-stat label="Key Exchange" value="ML-KEM-1024 (FIPS 203)"></sec-stat>
				<sec-stat label="Signatures" value="ML-DSA-65 (FIPS 204)"></sec-stat>
				<sec-stat label="Long-Lived Sealing" value="SLH-DSA (FIPS 205)"></sec-stat>
				<sec-stat label="AEAD / Hashing" value="ChaCha20-Poly1305 / BLAKE3"></sec-stat>
			</div>
		</section>

		<section class="threat-section" data-reveal>
			<div class="section-header">
				<sec-forge-seam class="accent-line"></sec-forge-seam>
				<h2>Threat Model</h2>
			</div>
			<sec-threat-matrix class="threat-matrix"></sec-threat-matrix>
			<sec-callout variant="danger" label="Not Yet Available">
				<p>
					No independent security audit, penetration test, or formal
					verification has been performed on CrucibleOS. The mechanisms
					above are implemented and demonstrated; that is a different claim
					from "audited."
				</p>
			</sec-callout>
		</section>
	</main>
	<footer-c></footer-c>
`;

@customElement("security-v")
export class SecurityView extends BaseViewElement {
	init() {
		const content = document.importNode(HTML, true);
		this.replaceChildren(content);

		const matrix = this.cacheFirst(".threat-matrix") as SecThreatMatrix | null;
		if (matrix) matrix.threats = THREAT_ENTRIES;

		const terminal = this.cacheFirst(".fail-terminal") as SecTerminal | null;
		if (terminal) terminal.lines = BOOT_FAIL_LINES;

		initReveal(this);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"security-v": SecurityView;
	}
}
