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
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[220px_1fr]">
      <aside className="pixel-panel h-fit p-4">
        <p className="font-pixel text-[10px] text-moss">Docs</p>
        <ul className="mt-3 space-y-2">
          {pages.map((p) => (
            <li key={p}>
              <Link
                href={p === "index" ? "/docs" : `/docs/${p}`}
                className={`font-pixel text-[11px] ${p === page ? "text-moss" : "text-forest"}`}
              >
                {titles[p] ?? p}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <article className="docs-prose pixel-panel p-8" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
