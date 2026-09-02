import { marked } from "marked";
import Link from "next/link";
import { listDocs, readDoc } from "@/lib/docs";

const titles: Record<string, string> = {
  index: "What QUIVER is",
  "not-a-launchpad": "Not a launchpad",
  subscription: "Subscription vs take-rate",
  pons: "Why $QUIVER launched on PONS",
  "creator-guide": "Creator guide",
  math: "Curve math",
  buybacks: "Buybacks",
  contracts: "Contracts",
  chain: "Robinhood Chain",
};

export default async function DocsPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const page = slug?.[0] ?? "index";
  const pages = await listDocs();
  const markdown = await readDoc(page);
  const html = marked.parse(markdown, { async: false }) as string;

  return (
    <div className="mx-auto grid max-w-page gap-12 px-5 py-14 md:grid-cols-[200px_1fr]">
      <aside className="h-fit md:sticky md:top-24">
        <p className="eyebrow mb-4">Docs</p>
        <ul className="space-y-2.5">
          {pages.map((p) => (
            <li key={p}>
              <Link
                href={p === "index" ? "/docs" : `/docs/${p}`}
                className={`font-ui text-[13px] ${p === page ? "text-forest" : "text-mist hover:text-forest"}`}
              >
                {titles[p] ?? p}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <article className="docs-prose max-w-[680px]" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
