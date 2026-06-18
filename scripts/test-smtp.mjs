const fs = require("fs");
const nodemailer = require("nodemailer");

const env = Object.fromEntries(
  fs
    .readFileSync(".env", "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index), line.slice(index + 1)];
    }),
);

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

transporter
  .verify()
  .then(() => {
    console.log("SMTP_OK", env.SMTP_HOST, env.SMTP_USER);
    process.exit(0);
  })
  .catch((error) => {
    console.error("SMTP_FAIL", error.message);
    process.exit(1);
  });
