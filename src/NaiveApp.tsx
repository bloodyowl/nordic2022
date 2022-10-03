import { useState } from "react";
import { query, User } from "./shared/RandomUser";
import { UserCard } from "./shared/User";

type State = {
  isLoading: boolean;
  data?: User;
  error?: number;
};

export const NaiveApp = () => {
  let [user, setUser] = useState<State>({
    isLoading: false,
    data: undefined,
    error: undefined,
  });

  let loadNewItem = () => {
    setUser({
      isLoading: true,
      data: undefined,
      error: undefined,
    });
    query().then(
      (data) =>
        setUser({
          isLoading: false,
          data,
          error: undefined,
        }),
      (error) =>
        setUser({
          isLoading: false,
          data: undefined,
          error,
        })
    );
  };

  return (
    <>
      <button onClick={loadNewItem} disabled={user.isLoading}>
        {!user.isLoading && user.data == null && user.error == null
          ? "Get a random person"
          : user.isLoading
          ? "Loading"
          : user.error
          ? "Try again"
          : "Get another one"}
      </button>

      <br />
      <br />

      {user.isLoading ||
      (user.data == null && user.error == null) ? null : user.error != null ? (
        "An error occurred"
      ) : user.data != null ? (
        <UserCard user={user.data} />
      ) : (
        "No result was received"
      )}
    </>
  );
};
