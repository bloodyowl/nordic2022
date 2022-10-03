import { useState } from "react";
import { render } from "react-dom";
import { match } from "ts-pattern";
import { BoxedApp } from "./BoxedApp";
import { NaiveApp } from "./NaiveApp";

const App = () => {
  const [page, setPage] = useState<"Boxed" | "Naive">("Naive");

  return (
    <div>
      <form>
        <label>
          <input
            name="page"
            type="radio"
            value="Naive"
            checked={page === "Naive"}
            onChange={() => setPage("Naive")}
          />{" "}
          Naive
        </label>{" "}
        <label>
          <input
            name="page"
            type="radio"
            value="Boxed"
            checked={page === "Boxed"}
            onChange={() => setPage("Boxed")}
          />{" "}
          Boxed
        </label>
      </form>
      <br />
      {match(page)
        .with("Boxed", () => <BoxedApp />)
        .with("Naive", () => <NaiveApp />)
        .exhaustive()}
    </div>
  );
};

let root = document.querySelector("#root");
if (root != null) {
  render(<App />, root);
}
