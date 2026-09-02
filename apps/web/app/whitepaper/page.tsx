export default function WhitepaperPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="font-pixel text-[10px] text-moss">LaTeX export</p>
          <h1 className="font-pixel text-3xl text-forest">Whitepaper</h1>
        </div>
        <a href="/quiver.pdf" className="pixel-btn-sun" download>
          Download PDF
        </a>
      </div>
      <iframe title="QUIVER whitepaper" src="/quiver.pdf" className="h-[80vh] w-full pixel-border bg-cream" />
    </div>
  );
}
