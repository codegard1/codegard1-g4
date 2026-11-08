import Link from "next/link";

export default function PageButtons({
  numPages,
  currentPage,
}: {
  numPages: number;
  currentPage: number;
}) {
  const isFirst = currentPage === 1;
  const isLast = currentPage === numPages;
  const nums = Array.from({ length: numPages }, (_, i) => i + 1);

  return (
    <nav id="PageButtons" aria-label="Blog pages">
      {!isFirst && (
        <span>
          <Link href={`/blog/${currentPage - 1}`} rel="prev">
            Previous
          </Link>
        </span>
      )}
      <span>
        <ul>
          {nums.map((num) => (
            <li key={num} className={num === currentPage ? "num-active" : ""}>
              <Link href={`/blog/${num}`} aria-current={num === currentPage ? "page" : undefined}>
                {num}
              </Link>
            </li>
          ))}
        </ul>
      </span>
      {!isLast && (
        <span>
          <Link href={`/blog/${currentPage + 1}`} rel="next">
            Next
          </Link>
        </span>
      )}
    </nav>
  );
}
