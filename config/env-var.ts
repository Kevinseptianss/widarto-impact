export const envVar = {
  API_URL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
  API_TOKEN: process.env.NEXT_PUBLIC_STRAPI_API_TOKEN,
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://widartoimpact.com",
  SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  EMAIL_SEND_TO: process.env.EMAIL_SEND_TO,
};
