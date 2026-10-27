
import { Resend } from "resend";

// Simple in-memory rate limiter
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip) {
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip === "localhost") {
    return false;
  }

  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.startTime > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, startTime: now });
    return false;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) return true;

  record.count += 1;
  return false;
}

// Clean expired rate-limit records
if (typeof setInterval !== "undefined") {
  const timer = setInterval(() => {
    const now = Date.now();

    for (const [ip, record] of rateLimitMap.entries()) {
      if (now - record.startTime > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.delete(ip);
      }
    }
  }, 5 * 60 * 1000);

  if (timer && typeof timer.unref === "function") {
    timer.unref();
  }
}

// Escape HTML to prevent email injection
function escapeHtml(str) {
  if (typeof str !== "string") return "";

  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Prevent email header injection
function stripNewlines(str) {
  if (typeof str !== "string") return "";
  return str.replace(/[\r\n]+/g, " ").trim();
}

// Verify Cloudflare Turnstile token
async function verifyTurnstile(token, secretKey, remoteIp) {
  if (!secretKey) {
    return { success: true, skipped: true };
  }

  if (!token) {
    return {
      success: false,
      error: "Missing Turnstile verification token",
    };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);

    if (remoteIp) {
      formData.append("remoteip", remoteIp);
    }

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return { success: data.success === true, data };
  } catch (err) {
    console.error("[Turnstile Error]", err);

    return {
      success: false,
      error: "Turnstile verification service unreachable",
    };
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      error: "Method not allowed. Use POST.",
    });
  }

  try {
    const clientIp =
      req.headers?.["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.headers?.["x-real-ip"] ||
      req.socket?.remoteAddress ||
      "unknown";

    // Rate limiting
    if (isRateLimited(clientIp)) {
      return res.status(429).json({
        error:
          "Too many requests. Please wait a few minutes before submitting again.",
      });
    }

    const {
      fullName,
      email,
      phone = "",
      organization = "",
      service = "",
      subject: customSubject = "",
      message = "",
      position = "",
      coverNote = "",
      cvFileName = "",
      cvBase64 = "",
      website = "",
      turnstileToken = "",
    } = req.body || {};

    // Honeypot spam protection
    if (website && website.trim() !== "") {
      return res.status(200).json({
        success: true,
        message:
          "Thank you! Your message has been sent. Our team will get back to you shortly.",
      });
    }

    // Turnstile verification
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    const turnstileResult = await verifyTurnstile(
      turnstileToken,
      turnstileSecret,
      clientIp
    );

    if (!turnstileResult.success) {
      return res.status(400).json({
        error: "Security verification failed. Please refresh and try again.",
      });
    }

    // Validate form fields
    const cleanName = stripNewlines(fullName);
    const cleanEmail = stripNewlines(email);
    const cleanPhone = stripNewlines(phone);
    const cleanOrg = stripNewlines(organization);
    const cleanService = stripNewlines(service);
    const cleanCustomSubject = stripNewlines(customSubject);
    const cleanPosition = stripNewlines(position);

    if (!cleanName || cleanName.length < 2) {
      return res.status(400).json({
        error: "Please enter your full name (minimum 2 characters).",
      });
    }

    if (cleanName.length > 100) {
      return res.status(400).json({
        error: "Full name exceeds maximum length of 100 characters.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        error: "Please provide a valid email address.",
      });
    }

    if (cleanEmail.length > 120) {
      return res.status(400).json({
        error: "Email address exceeds maximum length of 120 characters.",
      });
    }

    if (!cleanService) {
      return res.status(400).json({
        error: "Please select a primary service of interest.",
      });
    }

    const isCareer =
      cleanService === "job-application" ||
      cleanService === "internship" ||
      cleanService === "job" ||
      Boolean(cleanPosition || cvBase64);

    if (!isCareer && (!message || message.trim().length < 5)) {
      return res.status(400).json({
        error: "Please provide your project requirements or inquiry details.",
      });
    }

    if (message && message.length > 5000) {
      return res.status(400).json({
        error: "Message content exceeds maximum length of 5000 characters.",
      });
    }

    // Validate CV attachment
    const attachments = [];

    if (cvBase64) {
      const allowedExts = [".pdf", ".doc", ".docx"];
      const lowerFilename = (cvFileName || "resume.pdf").toLowerCase();
      const hasValidExt = allowedExts.some((ext) =>
        lowerFilename.endsWith(ext)
      );

      if (!hasValidExt) {
        return res.status(400).json({
          error:
            "Invalid CV file format. Allowed file formats are PDF, DOC, and DOCX.",
        });
      }

      try {
        const fileBuffer = Buffer.from(cvBase64, "base64");
        const MAX_BYTES = 3 * 1024 * 1024;

        if (fileBuffer.length > MAX_BYTES) {
          return res.status(400).json({
            error: "Uploaded CV file exceeds 3 MB limit.",
          });
        }

        attachments.push({
          filename: stripNewlines(cvFileName) || "CV_Attachment.pdf",
          content: fileBuffer,
        });
      } catch (bufErr) {
        console.error("[Attachment decoding error]", bufErr);

        return res.status(400).json({
          error: "Could not process CV attachment. Please re-upload.",
        });
      }
    }

    // IMPORTANT: All enquiries go to the client's email.
    // Configure CLIENT_EMAIL in Vercel Environment Variables.
    const clientEmail = (process.env.CLIENT_EMAIL || "").trim();

    if (!clientEmail) {
      return res.status(500).json({
        error: "CLIENT_EMAIL is not configured in Vercel.",
      });
    }

    const fromEmail = (
      process.env.RESEND_FROM_EMAIL ||
      process.env.FROM_EMAIL ||
      "ClinGene Website <onboarding@resend.dev>"
    ).trim();

    const emailSubject =
      `[ClinGene Website] ${cleanService} - ${cleanName}`;

    const resendApiKey = (process.env.RESEND_API_KEY || "").trim();

    if (
      !resendApiKey ||
      resendApiKey === "re_your_api_key_here" ||
      !resendApiKey.startsWith("re_")
    ) {
      return res.status(500).json({
        error: "RESEND_API_KEY is not configured correctly.",
      });
    }

    const submittedAtKarachi = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Karachi",
      dateStyle: "full",
      timeStyle: "long",
    }).format(new Date());

    // Build email HTML
    const htmlBody = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>${escapeHtml(emailSubject)}</title>
      </head>
      <body style="font-family:Arial,sans-serif;background:#f4f6f8;padding:24px;color:#1e293b">
        <div style="max-width:620px;margin:auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
          <div style="background:#061a2b;padding:24px;color:#ffffff">
            <h1>ClinGene Web Inquiry</h1>
            <p>Submitted via clingene.co contact desk</p>
            <strong>${isCareer ? "Careers & Opportunities" : "Genomic Inquiry"}</strong>
          </div>

          <div style="padding:28px">
            <h2>Contact Information</h2>
            <p><strong>Full Name:</strong> ${escapeHtml(cleanName)}</p>
            <p><strong>Email Address:</strong> <a href="mailto:${escapeHtml(cleanEmail)}">${escapeHtml(cleanEmail)}</a></p>
            <p><strong>Phone / WhatsApp:</strong> ${escapeHtml(cleanPhone) || "Not provided"}</p>
            <p><strong>${isCareer ? "Current Institution" : "Organization"}:</strong> ${escapeHtml(cleanOrg) || "Not provided"}</p>
            <p><strong>Service of Interest:</strong> ${escapeHtml(cleanService)}</p>

            ${
              cleanCustomSubject
                ? `<p><strong>Subject:</strong> ${escapeHtml(cleanCustomSubject)}</p>`
                : ""
            }

            ${
              isCareer
                ? `
                  <h2>Application Details</h2>
                  <p><strong>Position Applied For:</strong> ${escapeHtml(cleanPosition) || "General"}</p>
                  <p><strong>CV Attachment:</strong> ${attachments.length ? escapeHtml(attachments[0].filename) : "No file attached"}</p>
                  ${
                    coverNote
                      ? `<p><strong>Cover Note:</strong><br>${escapeHtml(coverNote)}</p>`
                      : ""
                  }
                `
                : `
                  <h2>Project Requirements &amp; Sample Details</h2>
                  <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
                `
            }
          </div>

          <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 28px;font-size:12px;color:#64748b">
            <p><strong>Timestamp (Pakistan Standard Time):</strong> ${escapeHtml(submittedAtKarachi)}</p>
            <p><strong>Client IP:</strong> ${escapeHtml(clientIp)}</p>
            <p>You can reply directly to this email to contact the sender.</p>
          </div>
        </div>
      </body>
      </html>
    `.trim();

    // Send email to the client; replies go to the visitor.
    const resend = new Resend(resendApiKey);

    const sendPayload = {
      from: fromEmail,
      to: [clientEmail],
      replyTo: cleanEmail,
      subject: emailSubject,
      html: htmlBody,
    };

    if (attachments.length > 0) {
      sendPayload.attachments = attachments;
    }

    const { data, error } = await resend.emails.send(sendPayload);

    if (error) {
      console.error("[Resend Delivery Error]", error);

      return res.status(500).json({
        error: error.message || "Failed to send message via email provider.",
      });
    }

    console.log(
      `[Email Sent Successfully] ID: ${data?.id}, To: ${clientEmail}`
    );

    return res.status(200).json({
      success: true,
      message:
        "Thank you! Your message has been sent. Our team will get back to you shortly.",
      id: data?.id,
    });
  } catch (err) {
    console.error("[Serverless Function Error]", err);

    return res.status(500).json({
      error:
        "An unexpected error occurred while sending your message. Please try again later.",
    });
  }
}
