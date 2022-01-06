import Footer from "@/components/footer";
import NavBar from "@/components/navbar";
import { client } from "@/lib/db";
import { useAuthStore } from "@/lib/state/auth";
import { SWRConfig } from "swr";
import "../styles/globals.css";

export default function Zone({ Component, pageProps }) {
  const token = useAuthStore((state) => state.token);

  function fetcher(document, variables, headers) {
    return client.request(document, variables, { "x-tattoo-nation-auth": token, ...headers });
  }

  return (
    <SWRConfig value={{ fetcher }}>
      <NavBar />
      <Component {...pageProps} />
      <Footer />
    </SWRConfig>
  );
}
