import React from "react";
import { Link } from "gatsby";

const PostList = ({ posts }) => (
  <ol style={{ listStyle: `none` }}>
    {posts.map(post => {
      const title = post.frontmatter.title || post.fields.slug;
      const tags = post.frontmatter.tags !== null
        ? post.frontmatter.tags.map(tag =>
          <Link key={`tag-${tag}`} to={`/tags/${tag}`}>{tag}&nbsp;&nbsp;</Link>)
        : "";

      return (
        <li key={post.fields.slug}>
          <article itemScope itemType="http://schema.org/Article">
            <header>
              <h2>
                <Link to={post.fields.slug} itemProp="url">
                  <span itemProp="headline">{title}</span>
                </Link>
              </h2>
              <small>{post.frontmatter.date}</small>
              <br />
              <small>tags:&nbsp;{tags}</small>
            </header>
            <section>
              <p
                dangerouslySetInnerHTML={{
                  __html: post.frontmatter.description || post.excerpt,
                }}
                itemProp="description"
              />
            </section>
          </article>
        </li>
      );
    })}
  </ol>
);

export default PostList;
