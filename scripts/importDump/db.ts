import { DB } from "@/db/types";
import { InsertObject, Kysely } from "kysely";

export async function insertOsuUsers(
  client: Kysely<DB>,
  osuUsers: InsertObject<DB, "OsuUser">[]
) {
  await client
    .insertInto("OsuUser")
    .values(osuUsers)
    .onDuplicateKeyUpdate((eb) => ({
      Username: eb.ref("OsuUser.Username"),
      LastFetched: eb.ref("OsuUser.LastFetched"),
      ApiInfo: eb.ref("OsuUser.ApiInfo"),
    }))
    .execute();
}
