import type { Metadata } from "next";
import ExternalLink from "@/components/ExternalLink";
import { contactSocialKeys, social } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Where to find Chris Odegard online.",
};

export default function ContactPage() {
  return (
    <>
      <h1>Contact</h1>
      <p>Reach out or admire from afar</p>
      <ul>
        {contactSocialKeys.map((key) => (
          <li key={key}>
            <ExternalLink href={social[key].url}>{social[key].name}</ExternalLink>
          </li>
        ))}
      </ul>
    </>
  );
}
