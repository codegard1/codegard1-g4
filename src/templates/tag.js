import * as React from "react";
import { Link, graphql } from "gatsby";
import Layout from "../components/layout";
import Seo from "../components/seo";

import {
  DetailsList,
  DetailsListLayoutMode,
  CheckboxVisibility,
} from "@fluentui/react/lib/DetailsList";

const Tags = ({ pageContext, data, location }) => {
  const { tag } = pageContext;
  const { nodes, totalCount } = data.allMarkdownRemark;
  const tagHeader = `${totalCount} post${totalCount === 1 ? "" : "s"
    } tagged with "${tag}"`;

  const _items = nodes.map(post => {
    return {
      key: post.id,
      name: post.frontmatter.title,
      date: post.frontmatter.date,
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
  ];

  return (
    <Layout title={data.site.siteMetadata.title} location={location}>
      <Seo
        title={`Tags: ${tag}`}
        keywords={[
          `gatsby`,
          `Ciaervo`,
          `Blog`,
          tag
        ]}
      />
      <h2>{tagHeader}</h2>
      <DetailsList
        items={_items}
        columns={_columns}
        setKey="set"
        layoutMode={DetailsListLayoutMode.justified}
        checkboxVisibility={CheckboxVisibility.hidden}
        compact={false}
      />
      <br />
      <Link to="/blog/tags">All tags</Link>
      <br/>
    </Layout>
  );
};

export default Tags;

export const pageQuery = graphql`
query ($tag: String) {
  allMarkdownRemark(
    limit: 2000
    sort: {fields: [frontmatter___date], order: DESC}
    filter: {frontmatter: {tags: {in: [$tag]}}}
  ) {
    totalCount
    nodes {
      id
      fields {
        slug
      }
      frontmatter {
        title
        date(formatString: "yyy-MM-DD")
      }
    }
  }
  site {
    siteMetadata {
      title
    }
  }
}
`;
