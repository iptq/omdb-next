export interface Props {
  userID: number;
  username?: string;
}

export default function UserProfilePicture({ userID, username }: Props) {
  return (
    <a href={`/profile/${userID}`}>
      <img src={`https://s.ppy.sh/a/${userID}`} title={username} />
    </a>
  );
}
