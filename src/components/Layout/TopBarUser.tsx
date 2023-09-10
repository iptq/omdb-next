import useSWR from "swr";
import UserProfilePicture from "../shared/UserProfilePicture";
import Link from "next/link";
import { useRouter } from "next/navigation";

async function fetcher(url: RequestInfo | URL) {
  const resp = await fetch(url);
  return await resp.json();
}

export default function TopBarUser() {
  const router = useRouter();
  const { data, error, isLoading, mutate } = useSWR("/auth/user", fetcher);

  const logout = async () => {
    await fetch("/auth/logout");
    mutate();
    router.push("/");
  };

  if (isLoading) return "...";

  if (data)
    return (
      <>
        <UserProfilePicture userID={data.UserID} username={data.Username} />
        <Link href={`/profile/${data.UserID}`}>
          <b>{data.Username}</b>
        </Link>
        <button onClick={logout}>Logout</button>
      </>
    );
  else
    return (
      <>
        <Link href="/auth/login">Not logged in</Link>
      </>
    );
}
