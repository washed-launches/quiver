import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-5 py-24">
      <h1 className="font-display text-3xl text-forest">Nothing here yet</h1>
      <p className="mt-3 text-ink/70">That slug isn’t taken. You can grab it.</p>
      <Link href="/launch" className="btn-primary mt-6 inline-flex">
        Launch
      </Link>
    </div>
  );
}
