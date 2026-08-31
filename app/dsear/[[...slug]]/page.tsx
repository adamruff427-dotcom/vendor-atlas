import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pages } from "../../../src/content/pages";

type Props = { params: Promise<{ slug?: string[] }> };
function resolvePage(slug?: string[]) {
  const path = `/dsear${slug?.length ? `/${slug.join("/")}` : ""}`;
  return pages.find((page) => page.path === path);
}
export async function generateStaticParams() {
  return pages.map((page) => ({
    slug: page.path === "/dsear" ? [] : page.path.replace("/dsear/", "").split("/"),
  }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = resolvePage(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: { title: page.title, description: page.description, url: page.path },
  };
}

export default async function DsearPage({ params }: Props) {
  const { slug } = await params;
  const page = resolvePage(slug);
  if (!page) notFound();
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description,
    author: { "@type": "Organization", name: "Vendor Atlas" },
    publisher: { "@type": "Organization", name: "Vendor Atlas" },
    mainEntityOfPage: `https://vendoratlas.artificiallyconfident.com${page.path}`,
  };
  return (
    <article className="content-page">
      <header className="content-hero">
        <div className="shell narrow">
          <span className="eyebrow">{page.eyebrow}</span>
          <h1>{page.title}</h1>
          <p className="lead">{page.intro}</p>
          <Link className="button primary" href="/#assessment">
            Check my situation
          </Link>
        </div>
      </header>
      <div className="shell article-grid">
        <div>
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
              {section.points && (
                <ul>
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
        <aside className="sources">
          <strong>Primary sources and further reading</strong>
          {page.sources.map((source) => (
            <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
              {source.label} <span aria-hidden>↗</span>
            </a>
          ))}
          <p>Vendor Atlas interpretation is decision support, not legal advice.</p>
        </aside>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </article>
  );
}
