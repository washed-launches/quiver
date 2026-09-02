export default function WhitepaperPage() {
  return (
    <div className="mx-auto max-w-page px-5 py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">LaTeX</p>
          <h1 className="mt-2 font-display text-4xl text-forest">Whitepaper</h1>
        </div>
        <a href="/quiver.pdf" className="btn-primary" download>
          Download PDF
        </a>
      </div>
      <iframe title="QUIVER whitepaper" src="/quiver.pdf" className="frame h-[80vh] w-full bg-paper" />
    </div>
  );
}
