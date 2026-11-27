import { Link } from "react-router-dom";
import { tagSlug } from "../data/content";

export default function TagLinks({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <span className="tag-links">
      {tags.map((tag) => (
        <Link key={tag} to={`/blog/tags/${tagSlug(tag)}`}>
          {tag}
        </Link>
      ))}
    </span>
  );
}
