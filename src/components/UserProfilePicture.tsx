export interface UserProfilePictureProps {
  userID: number;
  username?: string;
}

export default function UserProfilePicture({
  userID,
  username,
}: UserProfilePictureProps) {
  return (
    <a href={`/profile/${userID}`}>
      <img src={`https://s.ppy.sh/a/${userID}`} title={username} />
    </a>
  );
}
