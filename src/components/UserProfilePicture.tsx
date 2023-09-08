export interface UserProfilePictureProps {
  userID: number;
  username?: string | null;
  size?: string;
}

export default function UserProfilePicture({
  userID,
  username,
  size,
}: UserProfilePictureProps) {
  const description = username
    ? `${username}'s profile picture`
    : "Profile picture";
  const picSize = size ?? "2em";

  return (
    <a href={`/profile/${userID}`}>
      <img
        src={`https://s.ppy.sh/a/${userID}`}
        alt={description}
        title={description}
        style={{ width: picSize, height: picSize }}
      />
    </a>
  );
}
