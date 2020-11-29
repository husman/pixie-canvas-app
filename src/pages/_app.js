import React from "react";
import "../styles/index.css";
import "../../thirdparty/impress-common.css";
import "../../thirdparty/classic-slides.css";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
