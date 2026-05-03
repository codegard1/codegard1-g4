import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <main>
      <h1>Codegard1</h1>
      <nav>
        <ul>
          <li><Link href="/blog/posts">Blog</Link></li>
          <li><Link href="/gallery">Gallery</Link></li>
          <li><Link href="/music">Music</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>
      </nav>
    </main>
  );
};

export default Home;
