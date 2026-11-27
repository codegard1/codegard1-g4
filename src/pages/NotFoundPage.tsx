import { Link } from "react-router-dom";
import { useDocumentTitle } from "../components/Layout";

export default function NotFoundPage() {
  useDocumentTitle("404: Not Found");
  return (
    <>
      <h1>404: Not Found</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
      <p>
        <Link to="/">Back to the home page</Link>
      </p>
    </>
  );
}
