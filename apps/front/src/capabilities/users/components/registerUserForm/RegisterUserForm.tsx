"use client";

import { useActionState, useRef, useEffect, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Init } from "@/prelude/RemoteResult";
import { registerUserAction } from "@/capabilities/users/actions/registerUserAction";
import { userSchema } from "@/capabilities/users/User";

const initialState: Init = {
  kind: "init",
};

const registerFormSchema = userSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }
);

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const RegisterUserForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    registerUserAction,
    initialState
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (state.kind === "success") {
      reset();
      formRef.current?.reset();
    }
  }, [state, reset]);

  const onSubmit = (data: RegisterFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
      <div className="text-4xl">Register</div>

      <form
        id="register-form"
        onSubmit={handleSubmit(onSubmit)}
        ref={formRef}
        noValidate
      >
        <div className="flex gap-4 flex-col">
          <input
            className={`text-black bg-slate-100 rounded-full h-10 sm:h-12 px-4 sm:px-5 min-w-80 ${
              errors.name ? "border-2 border-red-500" : ""
            }`}
            type="text"
            placeholder="Name"
            aria-label="Name"
            disabled={isPending}
            {...register("name")}
          />
          {errors.name && (
            <span className="text-red-500 text-sm px-2">
              {errors.name.message}
            </span>
          )}

          <input
            className={`text-black bg-slate-100 rounded-full h-10 sm:h-12 px-4 sm:px-5 min-w-80 ${
              errors.email ? "border-2 border-red-500" : ""
            }`}
            type="email"
            placeholder="Email"
            aria-label="Email"
            disabled={isPending}
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-500 text-sm px-2">
              {errors.email.message}
            </span>
          )}

          <input
            className={`text-black bg-slate-100 rounded-full h-10 sm:h-12 px-4 sm:px-5 min-w-80 ${
              errors.password ? "border-2 border-red-500" : ""
            }`}
            type="password"
            placeholder="Password"
            aria-label="Password"
            disabled={isPending}
            {...register("password")}
          />
          {errors.password && (
            <span className="text-red-500 text-sm px-2">
              {errors.password.message}
            </span>
          )}

          <input
            className={`text-black bg-slate-100 rounded-full h-10 sm:h-12 px-4 sm:px-5 min-w-80 ${
              errors.confirmPassword ? "border-2 border-red-500" : ""
            }`}
            type="password"
            placeholder="Confirm Password"
            aria-label="Confirm Password"
            disabled={isPending}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm px-2">
              {errors.confirmPassword.message}
            </span>
          )}

          <button
            className="text-black bg-slate-100 rounded-full h-10 sm:h-12 px-4 sm:px-5 min-w-80"
            type="submit"
            disabled={isPending}
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
