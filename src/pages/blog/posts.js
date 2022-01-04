import React from "react";
import { Link, graphql } from "gatsby";
import Layout from "../../components/layout";
import Seo from "../../components/seo";

import {
  DetailsList,
  DetailsListLayoutMode,
  CheckboxVisibility,
} from "@fluentui/react/lib/DetailsList";

const PostsPage = ({ data, location }) => {
  const _items = data.allMarkdownRemark.nodes.map(post => {
    return {
      key: post.id,
      name: post.frontmatter.title,
      tags: post.frontmatter.tags,
      date: post.frontmatter.date,
      published: post.frontmatter.published,
      slug: post.fields.slug
    };
  });
  const _columns = [
    {
      key: "name",
      name: "Name",
      fieldName: "name",
      minWidth: 200,
      maxWidth: 300,
      isResizable: true,
      onRender: item => <Link to={item.slug}>{item.name}</Link>,
    },
    {
      key: "date",
      name: "Date",
      fieldName: "date",
      minWidth: 100,
      maxWidth: 100,
      isResizable: false,
    },
    {
      key: "published",
      name: "Published",
      fieldName: "published",
      minWidth: 100,
      maxWidth: 100,
      isResizable: false,
      onRender: item => item.published ? "Yes" : "No",
    },
    {
      key: "tags",
      name: "Tags",
      fieldName: "tags",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: item =>
        item.tags.map(
          tag => <span><Link to={`/blog/tags/${tag}`}>{tag}</Link>{`   `}</span>
        ),
    },
  ];

  return (
    <Layout location={location} title={data.site.siteMetadata.title}>
      <h2>All Blog Posts</h2>
      <Seo
        title={`All Blog Posts`}
        keywords={[
          `gatsby`,
          `Ciaervo`,
          `Blog`,
        ]}
      />
      <DetailsList
        items={_items}
        columns={_columns}
        setKey="set"
        layoutMode={DetailsListLayoutMode.justified}
        checkboxVisibility={CheckboxVisibility.hidden}
        compact={false}
      />
    </Layout>
  );
};

export default PostsPage;

export const pageQuery = graphql`
{
  site {
    siteMetadata {
      title
    }
  }
  allMarkdownRemark(limit: 2000, sort: {fields: frontmatter___date, order: DESC}) {
    nodes {
      frontmatter {
        date(formatString: "yyyy-MM-DD")
        published
        tags
        title
      }
      fields {
        slug
      }
      id
    }
  }
}
`;
