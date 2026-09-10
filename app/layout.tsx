import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Compass } from "lucide-react";
import { AnalyticsSettingsButton, GoogleAnalytics } from "../src/components/GoogleAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://vendoratlas.artificiallyconfident.com"),
  title: { default: "Vendor Atlas | UK industrial compliance finder", template: "%s | Vendor Atlas" },
  description:
    "Check DSEAR, LEV, pressure-system, LOLER and asbestos duties, see explainable planning ranges and compare evidence-backed UK specialists.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Vendor Atlas | UK industrial compliance finder",
    description:
      "Decision support, explainable cost estimates and evidence-backed UK specialists for five industrial compliance services.",
    url: "/",
    siteName: "Vendor Atlas",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1728,
        height: 912,
        alt: "Vendor Atlas: industrial compliance services compared carefully.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vendor Atlas | UK industrial compliance finder",
    description: "Decision support for DSEAR, LEV, pressure systems, LOLER and asbestos surveys.",
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
      "Decision support for procuring UK DSEAR, LEV, pressure-system, LOLER and asbestos-survey services.",
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
              <Link href="/">DSEAR</Link>
              <Link href="/lev">LEV</Link>
              <Link href="/pressure-systems">Pressure systems</Link>
              <Link href="/loler">LOLER</Link>
              <Link href="/asbestos">Asbestos</Link>
            </nav>
          </div>
          <div className="analytics-notice" role="note">
            <div className="shell">
              <strong>Measurement notice:</strong> First-party page and funnel counts are always on. Google
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
                evidence with visible check dates and evidence gaps.
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
