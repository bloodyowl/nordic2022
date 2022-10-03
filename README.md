# leveraging (algebraic data) types to make your UI rock solid

> A comparison between ways of structuring data in a UI app

## what to look for

> Instructions to run the project locally are at the end of this file

This repository aims to show the benefits of using typed functional languages.

The main feature we're seing there is the ability to use and create **sum types** using **variants**.

The app is just an action button thats triggers a call to an API that returns user profiles. To illustrate how the two solutions manage errors and edge-cases, the APIs has been artificially "broken", and returns three possible states:

- An error
- An empty response
- A user profile

Each of these possible states should be treated and the interface should reflect it.

### action button specification

The action button should:

1. Be labelled "Get a random person" initially
2. Be labelled "Loading" when a request is pending
3. Show "Try again" if the API error or returned an empty response
4. Show "Get another one" when a profile is successfully displayed

### user profile specification

The user profile should:

1. Show nothing initially
2. Show nothing when loading
3. Show "No result was received" when the API returned an empty profile
4. Show "An error occured" when the API errored
5. Show the received avatar and email when successful

## naive

The [naive implementation](./src/naive/App.tsx) represents its state using the following common structure:

```javascript
{
  isLoading: bool,
  data: response?,
  error: error?,
}
```

As visible in [App.js](./src/NaiveApp.tsx), this leads to complex ternary expressions, reducing readability, and leading to impossible states (as it's a **product type**, where its count of possible states is the **product** of its fields).

```javascript
<button onClick={loadNewItem} disabled={user.isLoading}>
  {!user.isLoading && user.data == null && user.error == null
    ? "Get a random person"
    : user.isLoading
    ? "Loading"
    : user.error
    ? "Try again"
    : "Get another one"}
</button>
```

Moreover, when trying the page, you'll notice that this naive implementation fails to respect the specification, as it makes different states indistinguishable (e.g. "received an empty response" vs "nothing happened yet"). These issues would require us to whether:

1. Manage additional state (e.g. a `receivedUserInput` boolean)
2. Wrap `data` in an additional data structure (e.g. `{payload: data}`, so that we're able to compare it to the initial `null` value)

As we can see, even though the typing checks out, we experience a bug due to the complexity of the product type we're using.

## [boxed](https://swan-io.github.io/boxed/)

The [Boxed implementation](./src/BoxedApp.tsx) represents its state as follows:

```ts
AsyncData<Result<Option<RandomUser.t>, error>>;
```

Let's break that down.

```ts
// pseudo-code:
// AsyncData
type AsyncData<T> = NotAsked | Loading | Done<T>;

// Result
type Result<A, E> = Ok<A> | Error<E>;

// Option
type Option<T> = Some<T> | None;
```

Those are all **sum types**: their possible state count is the **sum** of their branches. That enables two main benefits:

- It leads to **readable blocks** when exploding their values
- It enables the compiler to easily notice **unhandled cases** and make us fix those

```tsx
<button onClick={loadNewItem} disabled={user.isLoading()}>
  {match(user)
    .with(NotAsked, () => "Get a random person")
    .with(Loading, () => "Loading")
    .with(Done(Ok(None)), Done(Error(P.any)), () => "Try again")
    .with(Done(Ok(Some(P.any))), () => "Get another one")
    .exhaustive()}
</button>
```

There you go! Don't hesitate to play with this repository and move some code around to experiment.

---

## installation

```sh
$ git clone git@github.com:bloodyowl/nordic2022-demo.git
$ cd nordic2022-demo
$ yarn
```

## start

```sh
$ yarn start
```
