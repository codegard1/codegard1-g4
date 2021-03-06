import React from 'react';
import { Link } from 'gatsby';

const PageButtons = ({ numPages, currentPage }) => {
  // if (!numPages || !currentPage) return null;

  const isFirst = currentPage === 1;
  const isLast = currentPage === numPages;
  const prev = `/blog/${currentPage - 1}`;
  const next = `/blog/${currentPage + 1}`;

  const nums = Array.from({ length: numPages }).map((_, i) => i + 1);

  return (
    <div id="PageButtons">
      {!isFirst && (
        <span>
          <Link to={prev} rel="prev">
            Previous
          </Link>
        </span>
      )}
      <span>
        <ul>
          {nums.map((num) => (
            <li key={num} className={num === currentPage ? "num-active" : ""}>
              <Link to={`/blog/${num}`}>{num}</Link>
            </li>
          ))}
        </ul>
      </span>
      {!isLast && (
        <span>
          <Link to={next} rel="next">
            Next
          </Link>
        </span>
      )}
    </div>
  );
};

export default PageButtons;
