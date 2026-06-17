import { envVar } from "@/config/env-var";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

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

    // Helper to conditionally render rows in HTML email
    const renderRow = (label: string, value: any) => {
      if (!value || (Array.isArray(value) && value.length === 0)) return "";
      const displayValue = Array.isArray(value) ? value.join(", ") : value;
      return `<p><strong>${label}:</strong> ${displayValue}</p>`;
    };

    let programSpecificDetails = "";
    const pType = data.programType;

    if (pType === "brand-audit") {
      programSpecificDetails = `
        ${renderRow("Reason for Audit", data.auditReason)}
        ${renderRow("Aspects to Assess", data.auditAspects)}
        ${renderRow("Audit Decision Informing", data.auditDecision)}
        ${data.auditDecision === "Other" ? renderRow("Other Decision Details", data.auditDecisionOther) : ""}
        ${renderRow("Studio Experience", data.auditStudioExperience)}
      `;
    } else if (pType === "brand-creation") {
      programSpecificDetails = `
        ${renderRow("About the Brand", data.creationAbout)}
        ${renderRow("Brand Stage", data.creationStage)}
        ${renderRow("Needs to be Built", data.creationNeeds)}
        ${renderRow("SKUs at Launch", data.creationSkus)}
        ${renderRow("Competitors / References", data.creationCompetitors)}
      `;
    } else if (pType === "brand-refresh") {
      programSpecificDetails = `
        ${renderRow("Signal for Refresh", data.refreshSignal)}
        ${renderRow("Current Performance", data.refreshPerformance)}
        ${renderRow("Working Aspects", data.refreshWorkingAspects)}
        ${renderRow("Aspects to Change", data.refreshChangeAspects)}
        ${data.refreshChangeAspects?.includes("Other") ? renderRow("Other Change Details", data.refreshChangeOther) : ""}
        ${renderRow("SKUs Involved", data.refreshSkus)}
      `;
    } else if (pType === "scale-up") {
      programSpecificDetails = `
        ${renderRow("Need to Scale", data.scaleNeed)}
        ${renderRow("Urgent Challenge", data.scaleUrgentChallenge)}
        ${renderRow("Current SKUs", data.scaleSkus)}
        ${renderRow("Projected Growth", data.scaleGrowth)}
        ${renderRow("Existing System", data.scaleExistingSystem)}
      `;
    } else if (pType === "turnaround") {
      programSpecificDetails = `
        ${renderRow("Declining Signals", data.turnaroundSignals)}
        ${renderRow("Decline Duration", data.turnaroundDuration)}
        ${renderRow("Cause of Decline", data.turnaroundCause)}
        ${renderRow("Aspects to Rebuild", data.turnaroundRebuildAspects)}
        ${renderRow("SKUs to Redesign", data.turnaroundSkus)}
        ${renderRow("Previous Interventions", data.turnaroundInterventions)}
      `;
    }

    const htmlBody = `
      <h2>New Program Inquiry: ${pType ? pType.toUpperCase().replace("-", " ") : "Unknown"}</h2>
      
      <h3>About You</h3>
      ${renderRow("Name", data.name)}
      ${renderRow("Email", data.email)}
      ${renderRow("Company", data.company)}
      ${renderRow("Role", data.role)}
      ${renderRow("Location", data.location)}
      ${renderRow("Website", data.website)}
      
      <br/>
      <h3>About the Brand</h3>
      ${renderRow("Brand Stage", data.brandStage)}
      ${renderRow("Category / Industry", data.category)}
      ${renderRow("Primary Market", data.primaryMarket)}
      ${renderRow("Revenue Range", data.revenueRange)}
      
      <br/>
      <h3>Project Details</h3>
      ${programSpecificDetails}
      
      <br/>
      <h3>Timeline & Notes</h3>
      ${renderRow("Ideal Start Date", data.startDate)}
      ${renderRow("Target Launch Date", data.targetLaunchDate)}
      ${renderRow("Additional Notes", data.additionalNotes)}
    `;

    const mailOptions = {
      from: `"Widarto Impact Website" <${envVar.SMTP_USER}>`,
      to: envVar.EMAIL_SEND_TO,
      replyTo: data.email,
      subject: `Program Inquiry (${pType}): ${data.company}`,
      text: `
        New Program Inquiry (${pType})
        Name: ${data.name}
        Email: ${data.email}
        Company: ${data.company}
      `,
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
