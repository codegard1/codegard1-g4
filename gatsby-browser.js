// custom typefaces
import "typeface-montserrat";
import "typeface-merriweather";
// normalize CSS across browsers
import "./src/normalize.css";
// custom CSS styles
import "./src/style.css";
// Highlighting for code blocks
import "prismjs/themes/prism.css";

// Logs when the gatsby browser API starts
export const onClientEntry = () => {
  console.log("We've started!");
}


// Logs when the client route changes
export const onRouteUpdate = ({ location, prevLocation }) => {
  console.log("new pathname", location.pathname);
  console.log("old pathname", prevLocation ? prevLocation.pathname : null);
}

export const onInitialClientRender = () => {
  console.log("ReactDOM.render has executed");
}

export const onServiceWorkerUpdateReady = () => {
  console.log("a service worker has been updated in the background and the page is ready to reload to apply changes");
}

