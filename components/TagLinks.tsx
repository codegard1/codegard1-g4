import Link from "next/link";
import { tagSlug } from "@/lib/posts";

export default function TagLinks({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <span className="tag-links">
      {tags.map((tag) => (
        <Link key={tag} href={`/blog/tags/${tagSlug(tag)}`}>
          {tag}
        </Link>
      ))}
    </span>
  );
}
