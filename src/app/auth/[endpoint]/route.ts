import { db } from "@/db";
import { Api } from "@/osuapi";
import { redirect } from "next/navigation";
import { getIronSession } from "iron-session";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  endpoint: string;
}

const redirect_uri = "http://localhost:3000/auth/callback";

export async function GET(req: NextRequest, { params }: { params: Params }): Response {
  const { endpoint } = params;
  const res = new Response();
  const getSession = getIronSession(req, res, { password: process.env.COOKIE_SECRET!, cookieName: "OMDB_COOKIE" });

  if (endpoint === "login") {
    const url = new URL("https://osu.ppy.sh/oauth/authorize");
    url.searchParams.append("client_id", process.env.OSU_CLIENT_ID!);
    url.searchParams.append("redirect_uri", redirect_uri);
    url.searchParams.append("response_type", "code");
    url.searchParams.append("scope", "public");
    return redirect(url.toString());
  } else if (endpoint === "callback") {
    const url = new URL(req.url);
    const code = url.searchParams.get("code")!;

    const params = new URLSearchParams();
    params.append("client_id", process.env.OSU_CLIENT_ID!);
    params.append("client_secret", process.env.OSU_CLIENT_SECRET!);
    params.append("code", code);
    params.append("grant_type", "authorization_code");
    params.append("redirect_uri", redirect_uri);

    const resp = await fetch("https://osu.ppy.sh/oauth/token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    if (resp.status !== 200) {
      const body = await resp.text();
      console.log("reason:", body);
      return redirect("/");
    }

    const data = await resp.json();
    const { access_token, refresh_token } = data;

    // Make a request for the user
    const api = new Api(access_token);
    const me = await api.fetchMe();

    await db
      .insertInto("OsuUser")
      .values({ UserID: me.id, Username: me.username, ApiInfo: JSON.stringify(me), LastFetched: new Date() })
      .onDuplicateKeyUpdate((eb) => ({
        Username: eb.ref("OsuUser.Username"),
        LastFetched: eb.ref("OsuUser.LastFetched"),
      }))
      .execute();

    await db
      .insertInto("OmdbUser")
      .values({
        UserID: me.id,
        AccessToken: access_token,
        RefreshToken: refresh_token,
        CustomRatings: JSON.stringify("{}"),
      })
      .onDuplicateKeyUpdate((eb) => ({
        AccessToken: eb.ref("OmdbUser.AccessToken"),
        RefreshToken: eb.ref("OmdbUser.RefreshToken"),
      }))
      .execute()!;

    const session = await getSession;
    session.user = { UserID: me.id, Username: me.username };
    await session.save();

    // TODO: Redirect to the correct page
    const redirUrl = req.nextUrl.clone();
    redirUrl.pathname = "/";
    redirUrl.search = "";
    return NextResponse.redirect(redirUrl, { headers: res.headers });
  } else if (endpoint === "user") {
    const session = await getSession;
    let user = null;
    if (session.user) {
      user = {
        UserID: session.user.UserID,
        Username: session.user.Username,
      };
    }
    return NextResponse.json(user);
  } else if (endpoint === "logout") {
    const session = await getSession;
    session.destroy();
    const redirUrl = req.nextUrl.clone();
    redirUrl.pathname = "/";
    return NextResponse.redirect(redirUrl, { headers: res.headers });
  }

  return new Response(null, { status: 404 });
}
