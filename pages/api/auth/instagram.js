import { gql, request } from "@/lib/db";
import jwt from "jsonwebtoken";

const mutation = gql`
  mutation SignUp(
    $expires_in: Int64
    $access_token: String!
    $user_id: Int64!
    $username: String!
    $url: String
  ) {
    addArtist(
      input: {
        username: $username
        user_id: $user_id
        access_token: $access_token
        expires_in: $expires_in
        url: $url
      }
    ) {
      artist {
        user_id
      }
    }
  }
`;

export default async function instagram(req, res) {
  const { code } = req.query;
  if (!code) return res.status(400).json({ message: "no auth-code provided." });

  // get short-lived access-token from instagram
  let body = `client_id=${process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_SECRET}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}&code=${code}&grant_type=authorization_code`;
  let response = await fetch("https://api.instagram.com/oauth/access_token", {
    method: "POST",
    body: new URLSearchParams(body),
  });
  const { access_token: short_access_token, user_id } = await response.json();

  // get long-lived access-token from instagram
  response = await fetch(
    `https://graph.instagram.com/access_token?client_secret=${process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_SECRET}&access_token=${short_access_token}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}&code=${code}&grant_type=ig_exchange_token`
  );
  const { access_token, expires_in } = await response.json();

  // fetch username from instagram
  response = await fetch(
    `https://graph.instagram.com/v12.0/me?access_token=${access_token}&fields=username`
  );
  const { username } = await response.json();

  // fetch additional profile metadata
  response = await fetch(`https://www.instagram.com/${username}/?__a=1`);
  const { profile_pic_url: url } = (await response.json()).graphql.user;

  // create user in db
  const artist = {
    user_id,
    username,
    access_token,
    expires_in,
    url,
  };
  try {
    await request(mutation, artist);
  } catch (err) {
    console.error(err);
  }

  // create json-webtoken to provide user-level access to db
  const token = jwt.sign(artist, process.env.NEXT_PUBLIC_DGRAPH_SECRET_KEY);

  // redirect to `profile` with jwt & userId as payload
  res.redirect(307, `/profile?token=${token}&userId=${user_id}`);
}
