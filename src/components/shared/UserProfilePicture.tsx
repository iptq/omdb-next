import Link from "next/link";
import Image from "next/image";

export interface UserProfilePictureProps {
  userID: number;
  username?: string | null;
  size?: string;
}

export default function UserProfilePicture({ userID, username, size }: UserProfilePictureProps) {
  const description = username ? `${username}'s profile picture` : "Profile picture";

  return (
    <Link href={`/profile/${userID}`}>
      <Image src={`https://s.ppy.sh/a/${userID}`} width={24} height={24} alt={description} title={description} />
    </Link>
  );
}
