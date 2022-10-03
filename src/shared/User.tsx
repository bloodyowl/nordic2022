import { User } from "./RandomUser";

export const UserCard = ({
  user,
}: {
  user: User;
}) => {
  return (
    <>
      {user.picture != null ? (
        <img
          src={user.picture.large}
          width="200"
          height="200"
          alt={`${user.name.first} ${user.name.last}`}
        />
      ) : (
        <div className="default-image" />
      )}
      <br />
      {user.email}
    </>
  );
};
