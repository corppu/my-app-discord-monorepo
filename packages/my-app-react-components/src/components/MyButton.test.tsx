import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  MyPrimaryButton,
  MySecondaryButton,
  MySubmitButton,
  MyCancelButton,
} from "./index";
import "@testing-library/jest-dom";

describe("MyButton", () => {
  it("renders MyPrimaryButton with the given label", () => {
    render(<MyPrimaryButton>Primary</MyPrimaryButton>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders MySecondaryButton with the given label", () => {
    render(<MySecondaryButton>Secondary</MySecondaryButton>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders MySubmitButton with the given label", () => {
    render(<MySubmitButton>Submit</MySubmitButton>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders MyCancelButton with the given label", () => {
    render(<MyCancelButton>Cancel</MyCancelButton>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
