export enum GameMode {
  Osu = 0,
  Taiko = 1,
  Fruits = 2,
  Mania = 3,
}

export async function getApiKey() {
  const body = new URLSearchParams({
    client_id: process.env.OSU_CLIENT_ID!,
    client_secret: process.env.OSU_CLIENT_SECRET!,
    grant_type: "client_credentials",
    scope: "public",
  });
  const resp = await fetch("https://osu.ppy.sh/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const result = await resp.json();
  console.log("Got api token.", result);
  return result["access_token"];
}

export interface FetchUserOpts {
  userId: number;
  mode?: GameMode;
}

export interface User {}

export async function fetchUser(
  apiKey: string,
  opts: FetchUserOpts
): Promise<User> {
  const resp = await fetch(
    `https://osu.ppy.sh/api/v2/users/${opts.userId}?key=id`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );
  return await resp.json();
}
