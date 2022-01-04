import { useAuthStore } from "@/lib/state/auth";
import { gql } from "graphql-request";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

const getArtist = gql`
  query Artist($user_id: Int64) {
    getArtist(user_id: $user_id) {
      username
      url
    }
  }
`;

export default function Profile() {
  const { query, push } = useRouter();
  const setToken = useAuthStore((state) => state.setToken);
  const setUserId = useAuthStore((state) => state.setUserId);
  const userId = useAuthStore((state) => state.userId);

  useEffect(() => {
    //jwt token was passed -> update client state (on sign in & on jwt-revalidation in getServerSideProps)
    if (!!query.token) setToken(query.token);
    //userId was passed -> update client state (only on sign in)
    if (!!query.userId) setUserId(query.userId);
  }, [query, setToken, setUserId]);

  const { data, error } = useSWR([
    userId ? getArtist : null,
    { user_id: userId },
  ]);

  return (
    <main className="pt-24 h-screen w-screen flex justify-center items-center flex-col">
      <section>
        {!data && !error ? (
          "loading..."
        ) : (
          <div className="flex flex-col space-y-10">
            <div>
              <Image
                src={data.getArtist.url}
                layout="responsive"
                width={10}
                height={10}
                className="rounded-md"
              />
            </div>
            <pre>
              {JSON.stringify({ username: data.getArtist.username }, null, 2)}
            </pre>
            <button
              className="btn"
              onClick={() => {
                setToken(null);
                push("/");
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
