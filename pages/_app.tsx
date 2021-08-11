import "../app/debug/wdyr";
import { AppProps } from "next/app";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSearch,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import "../app/styles/globals.scss";

library.add(faSearch, faTimes, faInfoCircle);

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return <Component {...pageProps} />;
}

export default MyApp;
