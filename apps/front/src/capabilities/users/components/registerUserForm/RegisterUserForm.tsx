"use client";

import { useActionState, useRef, useEffect } from "react";

import { registerUser, Init } from "@/capabilities/users/actions/registerUser";

const initialState: Init = {
  kind: "init",
};

export const RegisterUserForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    registerUser,
    initialState
  );

  useEffect(() => {
    if (state.kind === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
      <div className="text-4xl">Register</div>

      <form id="register-form" action={formAction} ref={formRef}>
        <div className="flex gap-4 flex-col">
          <input
            className="text-black bg-slate-100 rounded-full h-10 sm:h-12 px-4 sm:px-5 min-w-80"
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            aria-label="Name"
            required
            disabled={isPending}
          />
          <input
            className="text-black bg-slate-100 rounded-full h-10 sm:h-12 px-4 sm:px-5 min-w-80"
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            aria-label="Email"
            required
            disabled={isPending}
          />
          <input
            className="text-black bg-slate-100 rounded-full h-10 sm:h-12 px-4 sm:px-5 min-w-80"
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            aria-label="Password"
            required
            disabled={isPending}
          />
          <input
            className="text-black bg-slate-100 rounded-full h-10 sm:h-12 px-4 sm:px-5 min-w-80"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            aria-label="Confirm Password"
            required
            disabled={isPending}
          />
          <button
            className="text-black bg-slate-100 rounded-full h-10 sm:h-12 px-4 sm:px-5 min-w-80"
            type="submit"
            disabled={isPending}
            form="register-form"
          >
            Register
          </button>
        </div>
      </form>
      {state.kind === "error" && (
        <div className="text-red-500 text-xl w-full flex justify-start px-4">
          {state.error.message}
        </div>
      )}
    </div>
  );
};
