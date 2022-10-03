import { AsyncData, Option, Result } from "@swan-io/boxed";
import { useState } from "react";
import { match, P } from "ts-pattern";
import { query, User } from "./shared/RandomUser";
import { UserCard } from "./shared/User";

const { NotAsked, Loading, Done } = AsyncData.pattern;
const { Ok, Error } = Result.pattern;
const { Some, None } = Option.pattern;

type State = AsyncData<Result<Option<User>, number>>;

export const BoxedApp = () => {
  let [user, setUser] = useState<State>(AsyncData.NotAsked());

  let loadNewItem = () => {
    setUser(AsyncData.Loading());
    query().then(
      (data: User | undefined) =>
        setUser(AsyncData.Done(Result.Ok(Option.fromNullable(data)))),
      (error: number) => setUser(AsyncData.Done(Result.Error(error)))
    );
  };

  return (
    <>
      <button onClick={loadNewItem} disabled={user.isLoading()}>
        {match(user)
          .with(NotAsked, () => "Get a random person")
          .with(Loading, () => "Loading")
          .with(Done(Ok(None)), Done(Error(P.any)), () => "Try again")
          .with(Done(Ok(Some(P.any))), () => "Get another one")
          .exhaustive()}
      </button>

      <br />
      <br />

      {match(user)
        .with(NotAsked, Loading, () => null)
        .with(Done(Error(P.any)), () => "An error occurred")
        .with(Done(Ok(None)), () => "No result was received")
        .with(Done(Ok(Some(P.select()))), (user) => <UserCard user={user} />)
        .exhaustive()}
    </>
  );
};
