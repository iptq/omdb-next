import { db } from "@/db";

export async function generateMetadata({ params }) {
  const { id } = params;
  const user = await getUser(parseInt(id));
  return {
    title: `Hellosu ${user?.Username}`,
  };
}

export default async function Page({ params }) {
  const { id } = params;
  const user = await getUser(parseInt(id));
  return <div>Hellosu {JSON.stringify(user)}</div>;
}

async function getUser(id: number) {
  return await db
    .selectFrom("OsuUser")
    .selectAll()
    .leftJoin("OmdbUser", "OsuUser.UserID", "OmdbUser.UserID")
    .where("OsuUser.UserID", "=", id)
    .executeTakeFirst();
}
