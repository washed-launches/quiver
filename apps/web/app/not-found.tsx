import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-5 sm:py-24">
      <h1 className="font-display text-3xl text-forest">Nothing here</h1>
      <p className="mt-3 text-ink/70">That name isn’t taken. Make your own page if you want it.</p>
      <Link href="/launch" className="btn-primary mt-6 inline-flex">
        Create a site
      </Link>
    </div>
  );
}
