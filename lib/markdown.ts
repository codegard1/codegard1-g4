import type { Element, Root as HastRoot } from "hast";
import type { Root as MdastRoot } from "mdast";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkSmartypants from "remark-smartypants";
import { unified } from "unified";
import { visit } from "unist-util-visit";

/**
 * Rewrites relative image/link references (./foo.png) inside a post to the
 * public URL where that asset is served (/blog/<slug>/foo.png).
 * Replaces gatsby-remark-images and gatsby-remark-copy-linked-files.
 */
function remarkRewriteRelativeUrls(options: { base: string }) {
  return (tree: MdastRoot) => {
    visit(tree, ["image", "link", "definition"], (node) => {
      if (!("url" in node) || typeof node.url !== "string") return;
      const url = node.url;
      if (url.startsWith("./")) {
        node.url = `${options.base}/${url.slice(2)}`;
      } else if (!/^(?:[a-z]+:|\/|#)/i.test(url)) {
        node.url = `${options.base}/${url}`;
      }
    });
  };
}

/** Lazy-load images and make iframes responsive-friendly. */
function rehypeMediaAttributes() {
  return (tree: HastRoot) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName === "img") {
        node.properties.loading ??= "lazy";
        node.properties.decoding ??= "async";
      }
      if (node.tagName === "iframe") {
        node.properties.loading ??= "lazy";
      }
    });
  };
}

const prettyCodeOptions: PrettyCodeOptions = {
  theme: "github-light",
  keepBackground: false,
  defaultLang: "plaintext",
};

/** Render a markdown body to HTML. `assetBase` is the public path for the post's colocated files. */
export async function renderMarkdown(markdown: string, assetBase: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkSmartypants)
    .use(remarkRewriteRelativeUrls, { base: assetBase })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypePrettyCode, prettyCodeOptions)
    .use(rehypeMediaAttributes)
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}

/** Plain-text excerpt of a markdown body, pruned at a word boundary. */
export async function markdownToExcerpt(markdown: string, maxLength: number): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(markdown);
  const text = String(file)
    .replace(/<(script|style|iframe)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}
