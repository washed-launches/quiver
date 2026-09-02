import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="font-pixel text-2xl text-forest">No site on this slug</h1>
      <p className="mt-3">Create one in three clicks.</p>
      <Link href="/launch" className="pixel-btn-sun mt-6 inline-block">
        Launch
      </Link>
    </div>
  );
}
