import { Resend } from "resend";

// Simple in-memory rate limiter per IP (resets on serverless cold starts)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip) {
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip === "localhost") return false;
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.startTime > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, startTime: now });
    return false;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  record.count += 1;
  return false;
}

// Clean old rate limit entries periodically without keeping Node event loop open
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

// HTML Escaping to prevent injection in email clients
function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Strip newlines to prevent email header injection
function stripNewlines(str) {
  if (typeof str !== "string") return "";
  return str.replace(/[\r\n]+/g, " ").trim();
}

// Verify Cloudflare Turnstile token
async function verifyTurnstile(token, secretKey, remoteIp) {
  if (!secretKey) {
    // If secret key is not set, skip verification for local/preview development
    return { success: true, skipped: true };
  }

  if (!token) {
    return { success: false, error: "Missing Turnstile verification token" };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (remoteIp) formData.append("remoteip", remoteIp);

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return { success: data.success === true, data };
  } catch (err) {
    console.error("[Turnstile Error]", err);
    return { success: false, error: "Turnstile verification service unreachable" };
  }
}

export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const clientIp =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.headers["x-real-ip"] ||
      req.socket?.remoteAddress ||
      "unknown";

    // 2. In-memory Rate Limiting
    if (isRateLimited(clientIp)) {
      return res.status(429).json({
        error: "Too many requests. Please wait a few minutes before submitting again.",
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
      website = "", // Honeypot field
      turnstileToken = "",
    } = req.body || {};

    // 3. Honeypot check (hidden "website" field)
    // If a spam bot filled this field, return silent success without sending
    if (website && website.trim() !== "") {
      console.warn(`[Spam honeypot triggered] IP: ${clientIp}, value: ${website}`);
      return res.status(200).json({
        success: true,
        message: "Thank you! Your message has been sent. Our team will get back to you shortly.",
      });
    }

    // 4. Cloudflare Turnstile Verification
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    const turnstileResult = await verifyTurnstile(turnstileToken, turnstileSecret, clientIp);
    if (!turnstileResult.success) {
      console.warn(`[Turnstile failed] IP: ${clientIp}`, turnstileResult);
      return res.status(400).json({
        error: "Security verification failed. Please refresh and try again.",
      });
    }

    // 5. Input Validation
    const cleanName = stripNewlines(fullName);
    const cleanEmail = stripNewlines(email);
    const cleanPhone = stripNewlines(phone);
    const cleanOrg = stripNewlines(organization);
    const cleanService = stripNewlines(service);
    const cleanCustomSubject = stripNewlines(customSubject);
    const cleanPosition = stripNewlines(position);

    if (!cleanName || cleanName.length < 2) {
      return res.status(400).json({ error: "Please enter your full name (minimum 2 characters)." });
    }
    if (cleanName.length > 100) {
      return res.status(400).json({ error: "Full name exceeds maximum length of 100 characters." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }
    if (cleanEmail.length > 120) {
      return res.status(400).json({ error: "Email address exceeds maximum length of 120 characters." });
    }

    if (!cleanService) {
      return res.status(400).json({ error: "Please select a primary service of interest." });
    }

    const isCareer =
      cleanService === "job-application" ||
      cleanService === "internship" ||
      cleanService === "job" ||
      Boolean(cleanPosition || cvBase64);

    if (!isCareer && (!message || message.trim().length < 5)) {
      return res.status(400).json({ error: "Please provide your project requirements or inquiry details." });
    }
    if (message && message.length > 5000) {
      return res.status(400).json({ error: "Message content exceeds maximum length of 5000 characters." });
    }

    // 6. CV Attachment Validation (For Careers)
    let attachments = [];
    if (cvBase64) {
      const allowedExts = [".pdf", ".doc", ".docx"];
      const lowerFilename = (cvFileName || "resume.pdf").toLowerCase();
      const hasValidExt = allowedExts.some((ext) => lowerFilename.endsWith(ext));

      if (!hasValidExt) {
        return res.status(400).json({
          error: "Invalid CV file format. Allowed file formats are PDF, DOC, and DOCX.",
        });
      }

      // Base64 to buffer and size check (Max 3MB = 3,145,728 bytes)
      try {
        const fileBuffer = Buffer.from(cvBase64, "base64");
        const MAX_BYTES = 3 * 1024 * 1024;
        if (fileBuffer.length > MAX_BYTES) {
          return res.status(400).json({
            error: "Uploaded CV file exceeds 3 MB limit. Please upload a smaller file.",
          });
        }

        attachments.push({
          filename: stripNewlines(cvFileName) || "CV_Attachment.pdf",
          content: fileBuffer,
        });
      } catch (bufErr) {
        console.error("[Attachment decoding error]", bufErr);
        return res.status(400).json({ error: "Could not process CV attachment. Please re-upload." });
      }
    }

    // 7. Configure Email Routing & Recipients
    const defaultRecipient = "ishahabdev@gmail.com";
    const infoEmail = process.env.INFO_EMAIL || defaultRecipient;
    const careersEmail = process.env.CAREERS_EMAIL || defaultRecipient;
    const toEmail = isCareer ? careersEmail : infoEmail;

    // NOTE: Once domain is verified in Resend, change FROM_EMAIL to e.g. "ClinGene Website <noreply@clingene.co>"
    const fromEmail = process.env.FROM_EMAIL || "ClinGene Website <onboarding@resend.dev>";

    // Email Subject: "[ClinGene Website] <Primary Service> - <Full Name>"
    const emailSubject = `[ClinGene Website] ${cleanService} - ${cleanName}`;

    const resendApiKey = (process.env.RESEND_API_KEY || "").trim();
    const isInvalidKey =
      !resendApiKey ||
      resendApiKey === "re_your_api_key_here" ||
      !resendApiKey.startsWith("re_");

    if (isInvalidKey) {
      const missingMsg =
        "RESEND_API_KEY is not configured yet. Please add a valid Resend API key (starts with 're_') to your .env file or Vercel Environment Variables so emails can be delivered to " +
        toEmail +
        ".";
      console.error("[Email Delivery Configuration Error]", missingMsg);
      return res.status(500).json({ error: missingMsg });
    }

    const resend = new Resend(resendApiKey);

    // Submission timestamp in Asia/Karachi timezone
    const submittedAtKarachi = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Karachi",
      dateStyle: "full",
      timeStyle: "long",
    }).format(new Date());

    // 8. Build Clean HTML Email Body
    const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(emailSubject)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 24px; color: #1e293b; }
    .card { background-color: #ffffff; max-width: 620px; margin: 0 auto; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 16px rgba(15,23,42,0.06); overflow: hidden; }
    .header { background: linear-gradient(135deg, #061a2b 0%, #0d3859 100%); padding: 24px 28px; color: #ffffff; }
    .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 700; letter-spacing: -0.01em; }
    .header p { margin: 0; font-size: 13px; color: #94a3b8; }
    .badge { display: inline-block; background-color: #10c8e0; color: #061a2b; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 4px 10px; border-radius: 9999px; margin-top: 10px; }
    .content { padding: 28px; }
    .section-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-top: 0; margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; }
    .field-row { display: flex; margin-bottom: 12px; font-size: 14px; line-height: 1.5; }
    .field-label { width: 180px; font-weight: 600; color: #475569; flex-shrink: 0; }
    .field-val { color: #0f172a; word-break: break-word; }
    .field-val a { color: #0284c7; text-decoration: none; }
    .message-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #0d3859; border-radius: 8px; padding: 16px; margin-top: 16px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #1e293b; }
    .footer { background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 28px; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>ClinGene Web Inquiry</h1>
      <p>Submitted via clingene.co contact desk</p>
      <span class="badge">${isCareer ? "Careers &amp; Opportunities" : "Genomic Inquiry"}</span>
    </div>
    <div class="content">
      <h2 class="section-title">Contact Information</h2>
      <div class="field-row"><div class="field-label">Full Name:</div><div class="field-val"><strong>${escapeHtml(cleanName)}</strong></div></div>
      <div class="field-row"><div class="field-label">Email Address:</div><div class="field-val"><a href="mailto:${escapeHtml(cleanEmail)}">${escapeHtml(cleanEmail)}</a></div></div>
      <div class="field-row"><div class="field-label">Phone / WhatsApp:</div><div class="field-val">${escapeHtml(cleanPhone) || '<span style="color:#94a3b8">Not provided</span>'}</div></div>
      <div class="field-row"><div class="field-label">${isCareer ? "Current Institution:" : "Organization:"}</div><div class="field-val">${escapeHtml(cleanOrg) || '<span style="color:#94a3b8">Not provided</span>'}</div></div>
      <div class="field-row"><div class="field-label">Service of Interest:</div><div class="field-val"><span style="color: #0369a1; font-weight: 600;">${escapeHtml(cleanService)}</span></div></div>
      ${cleanCustomSubject ? `<div class="field-row"><div class="field-label">Subject:</div><div class="field-val">${escapeHtml(cleanCustomSubject)}</div></div>` : ""}

      ${
        isCareer
          ? `
        <h2 class="section-title" style="margin-top: 24px;">Application Details</h2>
        <div class="field-row"><div class="field-label">Position Applied For:</div><div class="field-val"><strong>${escapeHtml(cleanPosition) || '<span style="color:#94a3b8">General</span>'}</strong></div></div>
        <div class="field-row"><div class="field-label">CV Attachment:</div><div class="field-val">${attachments.length > 0 ? `📎 ${escapeHtml(attachments[0].filename)} (Attached)` : '<span style="color:#94a3b8">No file attached</span>'}</div></div>
        ${coverNote ? `
          <div class="field-row" style="flex-direction: column; margin-top: 14px;">
            <div class="field-label" style="width: 100%; margin-bottom: 6px;">Cover Note / Motivation:</div>
            <div class="message-box">${escapeHtml(coverNote)}</div>
          </div>
        ` : ""}
      `
          : `
        <h2 class="section-title" style="margin-top: 24px;">Project Requirements &amp; Sample Details</h2>
        <div class="message-box">${escapeHtml(message)}</div>
      `
      }
    </div>
    <div class="footer">
      <div><strong>Timestamp (Pakistan Standard Time):</strong> ${escapeHtml(submittedAtKarachi)}</div>
      <div style="margin-top: 4px;"><strong>Client IP:</strong> ${escapeHtml(clientIp)}</div>
      <div style="margin-top: 4px; color: #94a3b8;">You can reply directly to this email to contact the sender.</div>
    </div>
  </div>
</body>
</html>
    `.trim();

    // 9. Send via Resend
    const sendPayload = {
      from: fromEmail,
      to: [toEmail],
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
        error: "Failed to send message. Please try again later or email us directly.",
      });
    }

    console.log(`[Email Sent Successfully] ID: ${data?.id}, To: ${toEmail}, From: ${cleanEmail}`);
    return res.status(200).json({
      success: true,
      message: "Thank you! Your message has been sent. Our team will get back to you shortly.",
      id: data?.id,
    });
  } catch (err) {
    console.error("[Serverless Function Error]", err);
    return res.status(500).json({
      error: "An unexpected error occurred while sending your message. Please try again later.",
    });
  }
}
