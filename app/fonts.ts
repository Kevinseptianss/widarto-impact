import localFont from "next/font/local";

export const basisGrotesque = localFont({
  src: "../public/fonts/basis-grotesque-pro.woff2",
  variable: "--font-basis-grotesque",
  weight: "400",
  style: "normal",
  display: "swap",
});

export const graphik = localFont({
  src: "../public/fonts/graphik.woff2",
  variable: "--font-graphik",
  weight: "400",
  style: "normal",
  display: "swap",
});

export const minionPro = localFont({
  src: "../public/fonts/minion-pro.woff2",
  variable: "--font-minion-pro",
  weight: "400",
  style: "normal",
  display: "swap",
});

export const helvetica = localFont({
  src: [
    {
      path: "../public/fonts/helvetica.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/helvetica-medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/helvetica-bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-helvetica",
  display: "swap",
});
