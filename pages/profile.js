import { useAuthStore } from "@/lib/state/auth";
import { gql } from "graphql-request";
import { decode } from "jsonwebtoken";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

const query = gql`
  query Artist($user_id: Int64!) {
    getArtist(user_id: $user_id) {
      username
      url
    }
  }
`;

export default function Profile() {
  const router = useRouter();
  const { token, setToken } = useAuthStore((state) => state);

  useEffect(() => {
    if (!!router.query?.token) setToken(router.query.token);
  }, [router.query]);

  const { data, error } = useSWR(!!token ? [query, { user_id: decode(token)?.user_id?.toString() }] : null);

  return (
    <main className="pt-24 h-screen w-screen flex justify-center items-center flex-col">
      <section>
        {!data && !error ? (
          "loading..."
        ) : (
          <div className="flex flex-col space-y-10">
            <div>
              {data?.getArtist?.url && (
                <Image
                  src={data?.getArtist?.url}
                  alt="profile pic"
                  layout="responsive"
                  width={10}
                  height={10}
                  className="rounded-md"
                />
              )}
            </div>
            <pre>{JSON.stringify({ username: data?.getArtist?.username }, null, 2)}</pre>
            <button
              className="btn"
              onClick={() => {
                // update client state
                setToken(null);
                router.push("/");
              }}
            >
              Sign Out
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
