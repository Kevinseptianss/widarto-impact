import { envVar } from "@/config/env-var";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

function formatValue(value: unknown) {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return "-";
  }
  return Array.isArray(value) ? value.join(", ") : String(value);
}

function renderRow(label: string, value: unknown) {
  return `<p><strong>${label}:</strong><br/>${formatValue(value)}</p>`;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const transporter = nodemailer.createTransport({
      host: envVar.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: envVar.SMTP_USER,
        pass: envVar.SMTP_PASSWORD,
      },
    });

    const fullName = formatValue(data.fullName);
    const company = formatValue(data.company);
    const investmentRange = formatValue(data.budget);

    const textBody = `
New Inquiry from Widarto Impact Website

Name:
${fullName}

Role:
${formatValue(data.role)}

Company / Brand:
${company}

Based in:
${formatValue(data.businessLocation)}

Website / Social Media:
${formatValue(data.website)}

Category / Industry:
${formatValue(data.category)}

Main Market:
${formatValue(data.primaryMarket)}

Annual Revenue:
${formatValue(data.revenueRange)}

Services Needed:
${formatValue(data.support)}

Project Type:
${formatValue(data.projectType)}

We are looking to:
${formatValue(data.wishTo)}

Main Challenge:
${formatValue(data.challenge)}

Kick-off Target:
${formatValue(data.kickOff)}

Completion Target:
${formatValue(data.completion)}

Investment Range:
${investmentRange}

Email:
${formatValue(data.email)}

How They Found Us:
${formatValue(data.source)}

Submitted From:
Widarto Impact Website Inquiry Form
`.trim();

    const htmlBody = `
      <h2>New Inquiry from Widarto Impact Website</h2>
      ${renderRow("Name", data.fullName)}
      ${renderRow("Role", data.role)}
      ${renderRow("Company / Brand", data.company)}
      ${renderRow("Based in", data.businessLocation)}
      ${renderRow("Website / Social Media", data.website)}
      ${renderRow("Category / Industry", data.category)}
      ${renderRow("Main Market", data.primaryMarket)}
      ${renderRow("Annual Revenue", data.revenueRange)}
      ${renderRow("Services Needed", data.support)}
      ${renderRow("Project Type", data.projectType)}
      ${renderRow("We are looking to", data.wishTo)}
      ${renderRow("Main Challenge", data.challenge)}
      ${renderRow("Kick-off Target", data.kickOff)}
      ${renderRow("Completion Target", data.completion)}
      ${renderRow("Investment Range", data.budget)}
      ${renderRow("Email", data.email)}
      ${renderRow("How They Found Us", data.source)}
      <p><strong>Submitted From:</strong><br/>Widarto Impact Website Inquiry Form</p>
    `;

    const mailOptions = {
      from: `"Widarto Impact Website" <${envVar.SMTP_USER}>`,
      to: envVar.EMAIL_SEND_TO,
      replyTo: data.email,
      subject: `New Inquiry: ${fullName} / ${company} / ${investmentRange}`,
      text: textBody,
      html: htmlBody,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
