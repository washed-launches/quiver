import { redirect } from "next/navigation";

export default async function LegacySitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/${slug.toLowerCase()}`);
}
