import React from "react";
import kebabCase from "lodash/kebabCase";
import { Link, graphql } from "gatsby";
import Layout from "../../components/layout";
import Seo from "../../components/seo";

import {
  DetailsList,
  DetailsListLayoutMode,
  CheckboxVisibility,
} from "@fluentui/react/lib/DetailsList";

const TagsPage = ({ data, location }) => {
  const _items = data.allMarkdownRemark.group.map(tag => {
    return {
      key: kebabCase(tag.fieldValue),
      name: tag.fieldValue,
      totalCount: tag.totalCount,
      postDate: tag.nodes.map(node => node.frontmatter.date)[0],
    };
  });
  const _columns = [
    {
      key: "name",
      name: "Name",
      fieldName: "name",
      minWidth: 100,
      maxWidth: 200,
      isResizable: false,
      onRender: item => <Link to={`/tags/${item.key}`}>{item.name}</Link>,
    },
    {
      key: "totalCount",
      name: "Post Count",
      fieldName: "totalCount",
      minWidth: 100,
      maxWidth: 100,
      isResizable: false,
    },
    {
      key: "postDate",
      name: "Last Post",
      fieldName: "postDate",
      minWidth: 100,
      maxWidth: 100,
      isResizable: false,
    },
  ];

  return (
    <Layout location={location} title={data.site.siteMetadata.title}>
      <h2>All Blog Post Tags</h2>
      <Seo
        title={`All Blog Post Tags`}
        keywords={[
          `gatsby`,
          `Ciaervo`,
          `Blog`,
          `Tags`,
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

export default TagsPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      filter: {frontmatter: {tags: {ne: ""}}}
      sort: {order: DESC, fields: frontmatter___date}
    ) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
        nodes {
          frontmatter {
            date(formatString: "yyyy-MM-DD")
          }
        }
      }
    }
  }  
`;
