import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useAsyncData } from "@/hooks/use-async-data";

function Probe({ fetcher }: { fetcher: () => Promise<string> }) {
  const { data, error, isLoading, retry } = useAsyncData(fetcher);
  return (
    <div>
      <span data-testid="state">
        {isLoading ? "loading" : error ? `error:${error.message}` : data}
      </span>
      <button type="button" onClick={retry}>
        retry
      </button>
    </div>
  );
}

describe("useAsyncData", () => {
  it("starts loading then resolves with data", async () => {
    render(<Probe fetcher={() => Promise.resolve("ok")} />);
    expect(screen.getByTestId("state")).toHaveTextContent("loading");
    await waitFor(() =>
      expect(screen.getByTestId("state")).toHaveTextContent("ok"),
    );
  });

  it("captures errors from the fetcher", async () => {
    render(<Probe fetcher={() => Promise.reject(new Error("boom"))} />);
    await waitFor(() =>
      expect(screen.getByTestId("state")).toHaveTextContent("error:boom"),
    );
  });

  it("refetches when retry is called", async () => {
    let calls = 0;
    const fetcher = () => {
      calls += 1;
      return calls === 1
        ? Promise.reject(new Error("first"))
        : Promise.resolve("recovered");
    };

    render(<Probe fetcher={fetcher} />);
    await waitFor(() =>
      expect(screen.getByTestId("state")).toHaveTextContent("error:first"),
    );

    await userEvent.click(screen.getByRole("button", { name: /retry/i }));
    await waitFor(() =>
      expect(screen.getByTestId("state")).toHaveTextContent("recovered"),
    );
  });
});
