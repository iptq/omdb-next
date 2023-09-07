import { Cache } from "file-system-cache";
import { RateLimiter } from "limiter";

const cache = new Cache({
  basePath: "./api-cache", // (optional) Path where cache files are stored (default).
  ns: "omdb-api-cache", // (optional) A grouping namespace for items.
  hash: "sha1", // (optional) A hashing algorithm used within the cache key.
  ttl: 21600, // 6 hours
});

export enum GameMode {
  Osu = 0,
  Taiko = 1,
  Fruits = 2,
  Mania = 3,
}

export class Api {
  private static baseUrl = "https://osu.ppy.sh/api/v2";
  private counter: RateLimiter;

  private constructor(private apiKey: string) {
    this.counter = new RateLimiter({
      tokensPerInterval: 1000,
      interval: "min",
    });
  }

  static async new() {
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

  async apiFetch(info: RequestInfo, init?: RequestInit): Promise<any> {
    await this.counter.removeTokens(1);

    let newInfo: RequestInfo;
    if (typeof info === "string") {
      newInfo = Api.baseUrl + info;
    } else {
      newInfo = new Request({
        ...info,
        url: Api.baseUrl + info.url,
      });
    }
    const newInit: RequestInit = {
      ...(init ?? {}),
      headers: {
        ...(init?.headers ?? {}),
        Authorization: `Bearer ${this.apiKey}`,
      },
    };
    await fetch(newInfo, newInit);
  }

  async fetchUser(userId: number, opts?: FetchUserOpts): Promise<User> {
    // See if it's in cache first
    const key = `/users/${userId}/${opts?.mode}`;
    const cacheGet = await cache.get(key);
    if (cacheGet) return cacheGet;

    const resp = await this.apiFetch(`/users/${userId}?key=id`);

    if (resp.status !== 200) {
      throw new Error(`Failed to fetch: ${resp.json()}`);
    }

    const user = await resp.json();
    await cache.set(key, user);
    return user;
  }
}

export interface FetchUserOpts {
  mode?: GameMode;
}

export interface UserCompact {
  avatar_url: string;
  country_code: string;
  default_group?: string;
  id: number;
  is_active: boolean;
  is_bot: boolean;
  is_deleted: boolean;
  is_online: boolean;
  is_supporter: boolean;
  last_visit?: Date;
  pm_friends_only: boolean;
  profile_colour?: string;
  username: string;
}

export interface User extends UserCompact {}
