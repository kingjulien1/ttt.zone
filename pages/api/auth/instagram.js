import { gql, server } from "@/lib/db";
import jwt from "jsonwebtoken";

const mutation = gql`
  mutation SignUp($expires_in: Int64, $access_token: String!, $user_id: Int64!, $username: String!, $url: String) {
    addArtist(
      input: { username: $username, user_id: $user_id, access_token: $access_token, expires_in: $expires_in, url: $url }
    ) {
      artist {
        user_id
      }
    }
  }
`;

export default async function instagram(req, res) {
  const { code } = req.query;
  if (!code) return res.status(400).send("no auth-code provided.");

  let [tokens, artist] = [{}].fill(2);

  // get short-lived access-token from instagram oath api
  try {
    const body = `client_id=${process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_SECRET}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}&code=${code}&grant_type=authorization_code`;
    const options = { method: "POST", body: new URLSearchParams(body) };
    const response = await fetch("https://api.instagram.com/oauth/access_token", options);
    const { access_token: short_access_token, user_id } = await response.json();
    tokens = { short_access_token };
    artist = { user_id };
  } catch (error) {
    console.error(`error in function 'instagram' @ getting short-lived access-token: ${error}`);
    return res.status(500).send("couldn't create short-lived access-token.");
  }

  // get long-lived access-token from instagram graph api
  try {
    const response = await fetch(
      `https://graph.instagram.com/access_token?client_secret=${process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_SECRET}&access_token=${tokens.short_access_token}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}&code=${code}&grant_type=ig_exchange_token`,
    );
    const { access_token, expires_in } = await response.json();
    tokens = { ...tokens, access_token, expires_in };
  } catch (error) {
    console.error(`error in function 'instagram' @ getting long-lived access-token: ${error}`);
    return res.status(500).send("couldn't create long-lived access-token.");
  }

  // fetch username from instagram graph api
  try {
    const response = await fetch(
      `https://graph.instagram.com/v12.0/me?access_token=${tokens.access_token}&fields=username`,
    );
    const { username } = await response.json();
    artist = { ...artist, username };
  } catch (error) {
    console.error(`error in function 'instagram' @ getting username: ${error}`);
    return res.status(500).send("couldn't fetch username.");
  }

  // fetch profile picture url from instagram directly
  try {
    // todo: send this request via a proxy, instagram rate limits calls to this url from same ip
    const response = await fetch(`https://www.instagram.com/${artist.username}/?__a=1`);
    const url = (await response.json())?.graphql?.user?.profile_pic_url || "";
    artist = { ...artist, url };
  } catch (error) {
    console.info(`error in function 'instagram' @ getting profile picture url: ${error}`);
    //return res.status(500).send("couldn't fetch profile pic.");
  }

  // create user in database
  try {
    // todo: check if user exists already
    await server.request(mutation, { ...artist, ...tokens });
  } catch (error) {
    console.error(`error in function 'instagram' @ creating in database: ${error}`);
    // don't return here, this function is also used to sign in already created users
    //return res.status(500).send("user already exists-");
  }

  // create json-webtoken to provide user-level access to db
  const claims = { "https://tttzone.com/jwt/claims": [{ role: "artist" }, artist, tokens] };
  const token = jwt.sign({ ...artist, ...tokens, ...claims }, process.env.NEXT_PUBLIC_DGRAPH_SECRET_KEY, {
    algorithm: "HS256",
  });

  // redirect to `profile` with jwt & userId as payload
  res.redirect(307, `/profile?token=${token}`);
}
