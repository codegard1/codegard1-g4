# Next.js Migration Scaffold

## 1. New package.json dependency block

Use this dependency block when switching the repo from Gatsby to Next.js.

```json
{
  "name": "codegard1",
  "private": true,
  "description": "Personal web site",
  "version": "0.3.0",
  "author": "Chris Odegard <c.odegard@gmail.com>",
  "engines": {
    "node": "^18 || ^20",
    "npm": "^9"
  },
  "dependencies": {
    "@fluentui/react": "8.125.5",
    "@fluentui/react-components": "9.73.8",
    "@fluentui/react-icons": "2.0.325",
    "@fluentui/react-migration-v8-v9": "9.10.9",
    "@uifabric/icons": "7.9.6",
    "gray-matter": "^4.0.3",
    "js-search": "^2.0.0",
    "lodash": "4.18.1",
    "next": "^14.2.0",
    "prop-types": "^15.8.1",
    "prismjs": "^1.29.0",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "remark": "^16.0.0",
    "remark-html": "^16.0.0"
  },
  "devDependencies": {
    "prettier": "^2.7.1"
  },
  "homepage": "https://codegard1.com",
  "keywords": [
    "ciaervo",
    "codegard1",
    "Chris Odegard",
    "Blog",
    "Personal Site",
    "nextjs"
  ],
  "license": "0BSD",
  "main": "/",
  "scripts": {
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,md}\"",
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "clean": "rm -rf .next node_modules",
    "preprocess": "node ./utilities/PreprocessInstagramJson.js"
  }
}
```

## 2. Suggested `pages/` router scaffold

### Static route files
- `pages/index.js`
- `pages/contact.js`
- `pages/blackjack.js`
- `pages/music/index.js`
- `pages/collection/index.js`
- `pages/gallery/index.js`
- `pages/gallery/instagram.js`
- `pages/gallery/shoes.js`
- `pages/gallery/microscope.js`
- `pages/blog/posts.js`
- `pages/blog/tags.js`
- `pages/blog/search.js`
- `pages/404.js`

### Dynamic route files
- `pages/blog/index.js` (redirect to or render `/blog/1`)
- `pages/blog/[slug].js` (individual blog post pages)
- `pages/blog/tags/[tag].js` (tag pages)
- `pages/blog/[page].js` or `pages/blog/[page]/index.js` (optional pagination route, if you want separate route files for numbered pages)

## 3. Recommended data/config layout

### Shared site metadata
- `lib/siteMetadata.js`
- `lib/siteConfig.js`

### Markdown helper utilities
- `lib/posts.js` (load `content/blog/*/index.md` with `gray-matter`)
- `lib/tags.js` (derive tags and tag pages from markdown data)
- `lib/imageData.js` (load JSON + local image metadata for gallery pages)

## 4. Example file scaffold outlines

### `pages/index.js`
```js
import Head from "next/head";
import Link from "next/link";
import Layout from "../components/layout";
import Seo from "../components/seo";
import { siteMetadata } from "../lib/siteConfig";

export default function Home() {
  return (
    <Layout title={siteMetadata.title}>
      <Seo title="Home" />
      <h1>Welcome to Codegard1</h1>
      <p>A personal site migrated from Gatsby to Next.js.</p>
      <ul>
        <li><Link href="/blog">Blog</Link></li>
        <li><Link href="/gallery">Gallery</Link></li>
        <li><Link href="/music">Music</Link></li>
      </ul>
    </Layout>
  );
}
```

### `pages/blog/[slug].js`
```js
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import Seo from "../../components/seo";
import { getPostSlugs, getPostBySlug } from "../../lib/posts";

export default function BlogPost({ post, previous, next }) {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Layout title={post.frontmatter.title}>
      <Seo title={post.frontmatter.title} description={post.frontmatter.description || post.excerpt} />
      <article>
        <h1>{post.frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  const slugs = getPostSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);
  return {
    props: {
      post,
    },
  };
}
```

### `pages/blog/tags/[tag].js`
```js
import Layout from "../../../components/layout";
import Seo from "../../../components/seo";
import { getPostsByTag, getAllTags } from "../../../lib/tags";

export default function TagPage({ tag, posts }) {
  return (
    <Layout title={`Tag: ${tag}`}>
      <Seo title={`Tag: ${tag}`} />
      <h1>Posts tagged {tag}</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <a href={`/blog/${post.slug}`}>{post.frontmatter.title}</a>
          </li>
        ))}
      </ul>
    </Layout>
  );
}

export async function getStaticPaths() {
  const tags = getAllTags();
  return {
    paths: tags.map((tag) => ({ params: { tag } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const posts = getPostsByTag(params.tag);
  return {
    props: {
      tag: params.tag,
      posts,
    },
  };
}
```

### `lib/posts.js`
```js
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "content/blog");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory).filter((name) => fs.statSync(path.join(postsDirectory, name)).isDirectory());
}

export async function getPostBySlug(slug) {
  const fullPath = path.join(postsDirectory, slug, "index.md");
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const processedContent = await remark().use(html).process(content);
  const htmlContent = processedContent.toString();

  return {
    slug,
    frontmatter: data,
    html: htmlContent,
  };
}
```

## 5. Notes

- The `pages/` router scaffold keeps the existing route structure while making the migration incremental.
- The `lib/` helpers will replace Gatsby GraphQL and source plugin behavior.
- Keep the current `src/components` directory and update only imports from `gatsby` to `next/link`, `next/head`, and local data helpers.
