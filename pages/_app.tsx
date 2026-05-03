import type { AppProps } from "next/app";
import "../src/normalize.css";
import "../src/style.css";
import "prismjs/themes/prism.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
