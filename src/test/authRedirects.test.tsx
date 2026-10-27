import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { isSafeInternalPath } from "@/lib/utils";
import SignIn from "@/pages/SignIn";

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    session: null,
    loading: false,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
  }),
}));

describe("isSafeInternalPath", () => {
  it.each(["/modules", "/module/introduction/lesson/what-is-disinfo"])("allows %s", (path) => {
    expect(isSafeInternalPath(path)).toBe(true);
  });

  it.each([
    "//evil.example",
    "/\\evil.example",
    "/\t/evil.example",
    "/\n/evil.example",
    "https://evil.example",
    "evil",
    "",
  ])("rejects %j", (path) => {
    expect(isSafeInternalPath(path)).toBe(false);
  });
});

describe("SignIn email-verification error from URL hash", () => {
  afterEach(() => {
    window.location.hash = "";
  });

  it("shows the expired-link message for otp_expired", () => {
    window.location.hash = "#error=access_denied&error_code=otp_expired&error_description=Email+link+expired";
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    expect(screen.getByRole("alert")).toHaveTextContent(/verification link is invalid or has expired/);
  });

  it("never renders attacker-supplied error_description text", () => {
    window.location.hash = "#error=x&error_description=Account+locked.+Call+555-0100+to+restore+access";
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    expect(screen.queryByText(/555-0100/)).toBeNull();
    expect(screen.getByRole("alert")).toHaveTextContent(/Something went wrong verifying your email/);
  });

  it("shows no error without hash params", () => {
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    expect(screen.queryByRole("alert")).toBeNull();
  });
});
