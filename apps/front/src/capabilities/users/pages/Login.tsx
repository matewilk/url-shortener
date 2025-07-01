"use client";

import { useActionState, useEffect, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Init } from "@/prelude/RemoteResult";
import { loginUserAction } from "@/capabilities/users/actions/loginUserAction";
import { userSchema } from "@/capabilities/users/User";

const initialState: Init = {
  kind: "init",
};

const loginFormSchema = userSchema.pick({ email: true, password: true });
type LoginForm = z.infer<typeof loginFormSchema>;

export const Login = () => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    loginUserAction,
    initialState
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(loginFormSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (state.kind === "success") {
      reset();
      router.push("/");
    }
  }, [state, reset, router]);

  const onSubmit = (data: LoginForm) => {
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
      <div className="text-4xl">Login</div>
      <form id="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex gap-4 flex-col">
          <input
            className={`text-black bg-slate-100 rounded-full h-10 sm:h-12 px-4 sm:px-5 min-w-80 ${
              errors.email ? "border-red-500" : "border-slate-300"
            } border-2`}
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
              errors.password ? "border-red-500" : "border-slate-300"
            } border-2`}
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

          <button
            className="text-black bg-slate-100 rounded-full h-10 sm:h-12 px-4 sm:px-5 min-w-80"
            type="submit"
            form="login-form"
            disabled={isPending}
          >
            Login
          </button>
        </div>
      </form>

      {state.kind === "error" && (
        <div className="text-red-500 text-xl w-full flex justify-start px-4">
          {state.error.message}
        </div>
      )}

      <div className="text-sm">
        {`Don't have an account? `}
        <a href="/register" className="text-blue-500 hover:underline">
          Register
        </a>
      </div>
    </div>
  );
};
