import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SignUp from "../components/signUp";
import axios from "axios";
import axiosMock from "axios-mock-adapter";
import { ToastContainer } from "react-toastify";

const mock = new axiosMock(axios);

describe("SignUp Component", () => {
  beforeEach(() => {
    mock.reset();
  });

  test("renders sign up form", () => {
    render(<SignUp />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test("successful sign up", async () => {
    mock.onPost(`${process.env.BACKEND_URL}/signup`).reply(201, {
      user: { name: "Test User", email: "test@example.com" },
      token: "testtoken123",
    });

    render(<SignUp />);
    render(<ToastContainer />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText(/sign up/i));

    expect(await screen.findByText(/signup successful/i)).toBeInTheDocument();
  });

  test("sign up with existing email", async () => {
    mock.onPost("http://localhost:5000/signup").reply(400, {
      message: "User with this Email Already Exists",
    });

    render(<SignUp />);
    render(<ToastContainer />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText(/sign up/i));

    expect(
      await screen.findByText(/user with this email already exists/i)
    ).toBeInTheDocument();
  });
});
