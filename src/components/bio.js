import * as React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";


const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            bio
            summary
          }
          social {
            keybase
          }
        }
      }
    }
  `);

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author;
  const social = data.site.siteMetadata?.social;

  return (
    <div>
      <StaticImage
        layout="constrained"
        formats={["auto", "webp", "avif"]}
        src="../images/profile-pic.jpg"
        width={50}
        height={50}
        quality={95}
        alt="Profile picture"
      />
      {author?.name && (
        <p>
          Written by <strong>{author.name}</strong>
          <br />
          <a href={`${social?.keybase || ``}`}>
            You should follow them on Keybase
          </a>
        </p>
      )}
    </div>
  );
};

export default Bio;
