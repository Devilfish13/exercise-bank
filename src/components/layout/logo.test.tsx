import { render, screen } from "@testing-library/react";

import { Logo } from "@/components/layout/logo";
import { siteConfig } from "@/config/site";

describe("Logo", () => {
  it("renders a home link labelled with the site name", () => {
    render(<Logo />);

    const link = screen.getByRole("link", {
      name: new RegExp(`${siteConfig.name} home`, "i"),
    });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("shows the wordmark by default and hides it when disabled", () => {
    const { rerender } = render(<Logo />);
    expect(screen.getByText(siteConfig.name)).toBeInTheDocument();

    rerender(<Logo showWordmark={false} />);
    expect(screen.queryByText(siteConfig.name)).not.toBeInTheDocument();
  });
});
