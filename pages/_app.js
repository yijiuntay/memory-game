import { Atkinson_Hyperlegible } from "@next/font/google";
import "@/styles/globals.css";

const atkinsonHyperlegible = Atkinson_Hyperlegible({
  weight: "700",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }) {
  return (
    <main className={atkinsonHyperlegible.className}>
      <Component {...pageProps} />
    </main>
  );
}
