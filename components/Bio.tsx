import Image from "next/image";
import { site } from "@/lib/site";

export default function Bio() {
  return (
    <div id="bio-container">
      <Image
        src="/images/profile-pic.jpg"
        width={50}
        height={50}
        quality={95}
        alt="Profile picture"
        priority
      />
      <p>
        &copy; {new Date().getFullYear()} <strong>{site.author.name}</strong>
      </p>
    </div>
  );
}
