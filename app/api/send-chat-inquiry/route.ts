import { envVar } from "@/config/env-var";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

function renderRow(label: string, value: unknown, alwaysShow = true) {
  const isEmpty =
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0);

  if (isEmpty && !alwaysShow) return "";

  const displayValue = isEmpty
    ? "-"
    : Array.isArray(value)
      ? value.join(", ")
      : String(value);

  return `<p><strong>${label}:</strong> ${displayValue}</p>`;
}

function formatPlainValue(value: unknown) {
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

    const htmlBody = `
      <h2>New Project Inquiry — Chat Form</h2>

      <h3>About You</h3>
      ${renderRow("Full Name", data.fullName)}
      ${renderRow("Role", data.role)}
      ${renderRow("Company / Brand Name", data.company)}
      ${renderRow("City / Country", data.businessLocation)}
      ${renderRow("Website or Social Media", data.website)}
      ${renderRow("Email", data.email)}

      <br/>
      <h3>About the Brand</h3>
      ${renderRow("Category / Industry", data.category)}
      ${renderRow("Primary Market", data.primaryMarket)}
      ${renderRow("Annual Revenue Range", data.revenueRange)}

      <br/>
      <h3>Services</h3>
      ${renderRow("Seeking help with", data.support)}

      <br/>
      <h3>Project Context</h3>
      ${renderRow("This is", data.projectType)}
      ${renderRow("Looking to", data.wishTo)}
      ${renderRow("Main Challenge", data.challenge)}

      <br/>
      <h3>Timeline</h3>
      ${renderRow("Would like to start", data.kickOff)}
      ${renderRow("Aiming for completion", data.completion)}

      <br/>
      <h3>Investment</h3>
      ${renderRow("Investment Range", data.budget)}
      ${renderRow("Investment Scope Note", data.budgetDetail)}

      <br/>
      <h3>Source</h3>
      ${renderRow("Found through", data.source)}
    `;

    const mailOptions = {
      from: `"Widarto Impact Website" <${envVar.SMTP_USER}>`,
      to: envVar.EMAIL_SEND_TO,
      replyTo: data.email,
      subject: `Chat Project Inquiry: ${data.company || data.fullName || "New Lead"}`,
      text: `
New Project Inquiry — Chat Form

ABOUT YOU
Full Name: ${formatPlainValue(data.fullName)}
Role: ${formatPlainValue(data.role)}
Company / Brand Name: ${formatPlainValue(data.company)}
City / Country: ${formatPlainValue(data.businessLocation)}
Website or Social Media: ${formatPlainValue(data.website)}
Email: ${formatPlainValue(data.email)}

ABOUT THE BRAND
Category / Industry: ${formatPlainValue(data.category)}
Primary Market: ${formatPlainValue(data.primaryMarket)}
Annual Revenue Range: ${formatPlainValue(data.revenueRange)}

SERVICES
Seeking help with: ${formatPlainValue(data.support)}

PROJECT CONTEXT
This is: ${formatPlainValue(data.projectType)}
Looking to: ${formatPlainValue(data.wishTo)}
Main Challenge: ${formatPlainValue(data.challenge)}

TIMELINE
Would like to start: ${formatPlainValue(data.kickOff)}
Aiming for completion: ${formatPlainValue(data.completion)}

INVESTMENT
Investment Range: ${formatPlainValue(data.budget)}
Investment Scope Note: ${formatPlainValue(data.budgetDetail)}

SOURCE
Found through: ${formatPlainValue(data.source)}
      `.trim(),
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
