import type { Metadata } from "next";
import ExternalLink from "@/components/ExternalLink";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blackjack",
  description: "A minimal Blackjack game built with React.",
  keywords: ["javascript", "react", "web development", "blackjack"],
};

export default function BlackjackPage() {
  return (
    <>
      <h2>Chris&apos;s Blackjack</h2>
      <p>
        This is a &quot;fairly minimal&quot; version of the game Blackjack made with React, Flux,
        and Fluent UI. It stores game state in browser storage so that the player&apos;s
        statistics will persist across session.
        <br /> This is a perpetual work in progress, so not all features may work as expected.
        That is to say, a lot of things are always broken. Over the years, this project has been
        used to experiment with different technologies and it has become a disorganized hybrid
        creature, but it still looks fairly presentable.
      </p>
      <p>
        <ExternalLink href={site.blackjackRepoUrl}>Here&apos;s the github repo.</ExternalLink>
        <br />
        <ExternalLink href={site.blackjackUrl}>Open the app full-screen.</ExternalLink>
      </p>
      <div className="iframe-wrapper">
        <iframe title="Blackjack" src={site.blackjackUrl} width="100%" height="800"></iframe>
      </div>
    </>
  );
}
