// lib/schema.ts

import { Article } from "./api/journals";

export function generateFAQSchema(
  faqs: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateBlogSchema(post: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.cover.url,
    author: {
      "@type": "Organization",
      name: "Widarto Impact",
    },
    publisher: {
      "@type": "Organization",
      name: "Widarto Impact",
      logo: {
        "@type": "ImageObject",
        url: "https://widartoimpact.com/logo.png",
      },
    },
    datePublished: post.date_published,
  };
}
