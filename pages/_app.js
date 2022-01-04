import Footer from "@/components/footer";
import NavBar from "@/components/navbar";
import { client } from "@/lib/db";
import { useAuthStore } from "@/lib/state/auth";
import { useEffect } from "react";
import { SWRConfig } from "swr";

import "../styles/globals.css";

export default function Zone({ Component, pageProps }) {
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    // if user authenticates, also set header to authenticate requests against db
    if (!!token) client.setHeader("X-Tattoo-Nation-Auth", token);
  }, [token]);

  return (
    <SWRConfig value={{ fetcher: (...args) => client.request(...args) }}>
      <NavBar />
      <Component {...pageProps} />
      <Footer />
    </SWRConfig>
  );
}
