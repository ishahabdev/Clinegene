
import { Resend } from "resend";

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      error: "Method not allowed. Use POST.",
    });
  }

  // Validate Resend API key
  const apiKey = (process.env.RESEND_API_KEY || "").trim();

  if (!apiKey || !apiKey.startsWith("re_") || apiKey === "re_your_key_here") {
    return res.status(500).json({
      error: "RESEND_API_KEY is not configured correctly.",
    });
  }

  // Client's email address from environment variables
  const clientEmail = (process.env.CLIENT_EMAIL || "").trim();

  if (!clientEmail) {
    return res.status(500).json({
      error: "CLIENT_EMAIL is not configured.",
    });
  }

  // Read visitor's form data
  const { name, fullName, email, replyTo, subject, html } = req.body || {};
  const visitorEmail = (email || replyTo || "").trim();
  const visitorName = (name || fullName || "Website Visitor").trim();

  if (!visitorEmail || !html) {
    return res.status(400).json({
      error: "Missing required fields: email and html are required.",
    });
  }

  const fromEmail = (
    process.env.RESEND_FROM_EMAIL ||
    process.env.FROM_EMAIL ||
    "ClinGene Website <onboarding@resend.dev>"
  ).trim();

  try {
    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [clientEmail],
      replyTo: visitorEmail,
      subject: subject || `New enquiry from ${visitorName}`,
      html,
    });

    if (error) {
      return res.status(500).json({
        error: error.message || "Failed to send email via Resend.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email sent successfully.",
      id: data?.id,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message || "An unexpected error occurred while sending email.",
    });
  }
}
