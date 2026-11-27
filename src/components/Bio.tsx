import { site } from "../config/site";

export default function Bio() {
  return (
    <div id="bio-container">
      <img
        src="/images/profile-pic.jpg"
        width={50}
        height={50}
        alt="Profile picture"
      />
      <p>
        &copy; {new Date().getFullYear()} <strong>{site.author.name}</strong>
      </p>
    </div>
  );
}
