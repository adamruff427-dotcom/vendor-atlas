import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Compass } from "lucide-react";
import { AnalyticsSettingsButton, GoogleAnalytics } from "../src/components/GoogleAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://vendoratlas.artificiallyconfident.com"),
  title: { default: "Vendor Atlas | DSEAR assessment finder", template: "%s | Vendor Atlas" },
  description:
    "Check whether a DSEAR assessment may be relevant, see an indicative cost range and compare evidence-backed UK specialists.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Vendor Atlas | DSEAR assessment finder",
    description:
      "A two-minute DSEAR relevance check, explainable cost estimate and evidence-backed specialist comparison.",
    url: "/",
    siteName: "Vendor Atlas",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1536,
        height: 910,
        alt: "Vendor Atlas: Do I need a DSEAR assessment? Find out in about 2 minutes.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vendor Atlas | DSEAR assessment finder",
    description: "A two-minute DSEAR relevance check and specialist comparison.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Vendor Atlas",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Decision support for procuring UK compliance services, beginning with DSEAR risk assessment.",
    url: "https://vendoratlas.artificiallyconfident.com/",
  };
  return (
    <html lang="en-GB">
      <body>
        <GoogleAnalytics />
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <header className="site-header">
          <div className="shell header-inner">
            <Link className="brand" href="/">
              <span className="brand-mark" aria-hidden="true"><Compass strokeWidth={1.8} /></span>
              <span>
                Vendor Atlas<small>Compliance services, compared carefully</small>
              </span>
            </Link>
            <nav aria-label="Main navigation">
              <Link href="/dsear">DSEAR guide</Link>
              <Link href="/dsear/cost">Costs</Link>
              <Link href="/dsear/suppliers">Specialists</Link>
              <Link href="/dsear/buying-toolkit">Buying toolkit</Link>
            </nav>
          </div>
          <div className="analytics-notice" role="note">
            <div className="shell">
              <strong>Measurement notice:</strong> First-party funnel counts are always on. Google
              Analytics loads only if you allow it; advertising storage stays off. <AnalyticsSettingsButton />
            </div>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer>
          <div className="shell footer-grid">
            <div>
              <strong>Vendor Atlas</strong>
              <p>Initial procurement support for compulsory business services.</p>
            </div>
            <div>
              <strong>Important</strong>
              <p>
                Vendor Atlas does not provide legal advice, conduct risk assessments or approve
                suppliers. Verify scope and competence before appointment.
              </p>
            </div>
            <div>
              <strong>Evidence</strong>
              <p>
                Regulatory claims link to primary sources. Supplier claims are provider-source
                evidence, last checked 31 August 2026.
              </p>
              <Link href="/privacy">Privacy and analytics</Link>
            </div>
          </div>
        </footer>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      </body>
    </html>
  );
}
