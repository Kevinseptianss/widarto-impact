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
    
const htmlBody = `
  <h2>New Project Inquiry</h2>
  <p><strong>Name:</strong> ${data.name}</p>
  <p><strong>Email:</strong> ${data.email}</p>
  <p><strong>Company:</strong> ${data.company}</p>
  <p><strong>Category / Industry:</strong> ${data.category}</p>
  <p><strong>Primary Market:</strong> ${data.primaryMarket}</p>
  <p><strong>Revenue Range:</strong> ${data.revenueRange}</p>
  <p><strong>Role:</strong> ${data.role}</p>
  <p><strong>Location:</strong> ${data.businessLocation || "-"}</p>
  <p><strong>Website:</strong> ${data.website || "-"}</p>
  <br/>
  <h3>Project Details</h3>
  <p><strong>Services:</strong> ${data.services.join(", ")}</p>
  <p><strong>Other Service Details:</strong> ${data.otherServiceDetails || "-"}</p>
  <p><strong>Brand Stage:</strong> ${data.brandStage}</p>
  <p><strong>Project Description:</strong> ${data.projectDescription}</p>
  <p><strong>Main Challenge:</strong> ${data.mainChallenge || "-"}</p>
  <p><strong>Investment Range:</strong> ${data.investmentRange}</p>
  <p><strong>Specific Investment Details:</strong> ${data.specificInvestmentDetails || "-"}</p>
  <br/>
  <h3>Timeline & Notes</h3>
  <p><strong>Start Date:</strong> ${data.startDate}</p>
  <p><strong>Target Launch Date:</strong> ${data.targetLaunchDate || "-"}</p>
  <p><strong>How did you hear about us:</strong> ${data.howDidYouHear || "-"}</p>
  <p><strong>Additional Notes:</strong> ${data.additionalNotes || "-"}</p>
`;



    // <p><strong>Specific Budget:</strong> $${data.specificInvestmentDetails || "-"}</p>

    const mailOptions = {
      from: `"Widarto Impact Website" <${envVar.SMTP_USER}>`,
      to: envVar.EMAIL_SEND_TO,
      replyTo: data.email,
      subject: `Project Inquiry: ${data.company}`,
      text: `
        New Project Inquiry
        Name: ${data.name}
        Email: ${data.email}
        Company: ${data.company}
        Project: ${data.projectDescription}
        Budget: ${data.investmentRange}
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
