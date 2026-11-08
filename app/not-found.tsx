import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "404: Not Found" };

export default function NotFound() {
  return (
    <>
      <h1>404: Not Found</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
      <p>
        <Link href="/">Back to the home page</Link>
      </p>
    </>
  );
}
