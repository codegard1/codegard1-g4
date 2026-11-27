import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { navLinks, site } from "../config/site";

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${site.title}` : site.title;
  }, [title]);
}

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <div id="LayoutContainer">
      <nav id="navbar" className="navbar-container container" aria-label="Main">
        <h2>
          <Link to="/" className="home-link">
            {site.title}
          </Link>
        </h2>
        <button
          type="button"
          id="navbar-toggle"
          aria-controls="navbar-menu"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((v) => !v)}
        >
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
        </button>

        {isOpen && (
          <div id="navbar-menu" onClick={() => setIsOpen(false)}>
            <ul className="navbar-links" onClick={(e) => e.stopPropagation()}>
              {navLinks.map((link) => (
                <li className="navbar-item" key={link.href}>
                  <Link
                    className="navbar-link"
                    to={link.href}
                    aria-current={pathname === link.href ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      <main>{children}</main>

      <footer>
        {`© ${new Date().getFullYear()} `}
        <Link to="/contact">{site.author.name}</Link>, All rights reserved. Built with{" "}
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          Vite
        </a>
        .
      </footer>
    </div>
  );
}
