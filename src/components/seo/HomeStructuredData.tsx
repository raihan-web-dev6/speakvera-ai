import {
  getSiteUrl,
} from "@/lib/site-url";

export default function HomeStructuredData() {
  const siteUrl =
    getSiteUrl();

  const website = {
    "@context":
      "https://schema.org",

    "@type":
      "WebSite",

    name:
      "Speakvera AI",

    url:
      siteUrl,

    description:
      "AI-powered English speaking practice with instant feedback, structured Everyday English lessons, IELTS Speaking preparation and speaking assessments.",
  };

  const application = {
    "@context":
      "https://schema.org",

    "@type":
      "SoftwareApplication",

    name:
      "Speakvera AI",

    url:
      siteUrl,

    applicationCategory:
      "EducationalApplication",

    operatingSystem:
      "Web",

    description:
      "Speakvera AI helps learners practice English speaking, receive AI feedback, prepare for IELTS Speaking and follow a structured 40-day English course.",

    featureList: [
      "AI English speaking feedback",
      "40-day Everyday English course",
      "IELTS Speaking practice",
      "English speaking assessments",
      "CEFR level estimates",
      "Learning progress tracking",
      "Certificates for eligible learners",
    ],

    offers: [
      {
        "@type":
          "Offer",

        name:
          "Speakvera Free",

        price:
          "0",

        priceCurrency:
          "USD",
      },

      {
        "@type":
          "Offer",

        name:
          "Speakvera Pro Monthly",

        price:
          "6.99",

        priceCurrency:
          "USD",
      },

      {
        "@type":
          "Offer",

        name:
          "Speakvera Premium Monthly",

        price:
          "12.99",

        priceCurrency:
          "USD",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              website
            ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              application
            ),
        }}
      />
    </>
  );
}