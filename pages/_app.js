import "../styles/globals.css";

//INTERNAL IMPORT
import { TrackingProvider } from "../Context/Tracking";
import { NavBar, Footer } from "../Components";

export default function App({ Component, pageProps }) {
  return (
    <>
      <TrackingProvider>
        <NavBar />
        <Component {...pageProps} />
      </TrackingProvider>
      <Footer />
    </>
  );
}
