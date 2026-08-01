import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function esc(s: string): string {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

export default async function handler(req: any, res: any) {
	if (req.method !== "POST") {
		return res.status(405).json({
			ok: false,
			error: "Method Not Allowed",
		});
	}

	try {
		const { firstName, lastName, email, message } = req.body ?? {};

		if (!firstName || !lastName || !email || !message) {
			return res.status(400).json({
				ok: false,
				error: "Missing required fields",
			});
		}

		if (!EMAIL_REGEX.test(email)) {
			return res.status(400).json({
				ok: false,
				error: "Invalid email",
			});
		}

		await resend.emails.send({
			from: "CrucibleOS Contact <onboarding@resend.dev>",
			to: "contact@crucibleos.org",
			subject: `New Contact: ${esc(firstName)} ${esc(lastName)}`,
			html: `
				<h2>New Contact Form Submission</h2>

				<p><b>Name:</b> ${esc(firstName)} ${esc(lastName)}</p>
				<p><b>Email:</b> ${esc(email)}</p>

				<hr />

				<p><b>Message:</b></p>
				<p>${esc(message).replace(/\n/g, "<br />")}</p>
			`,
		});

		return res.status(200).json({ ok: true });
	} catch (err) {
		console.error(err);

		return res.status(500).json({
			ok: false,
			error: "Server error",
		});
	}
}
