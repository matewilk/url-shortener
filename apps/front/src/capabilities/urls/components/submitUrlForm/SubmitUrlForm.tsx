"use client";
import { useActionState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Init } from "@/prelude/RemoteResult";
import { submitUrlAction } from "@/capabilities/urls/actions/submitUrlAction";
import { UrlBox } from "./UrlBox";
import { ErrorMessage } from "./ErrorBox";
import { SpinnerButton } from "@/ui/SpinnerButton";

const initialState: Init = {
  kind: "init",
};

export const SubmitUrlForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    submitUrlAction,
    initialState
  );

  useEffect(() => {
    if (state.kind === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form action={formAction} ref={formRef}>
      <Card className="flex gap-4 flex-col items-center max-w-2xl mx-auto">
        <CardHeader className="text-2xl font-semibold text-center">
          <CardTitle>Shorten Your Link</CardTitle>
          <CardDescription className="text-gray-600 font-normal text-base">
            Enter the URL you want to shorten below.
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full items-center flex flex-col gap-4">
          <div className="flex gap-4 flex-col sm:flex-row w-full items-center justify-center">
            <input
              className="text-slate-800 bg-slate-200 rounded-full h-10 sm:h-12 px-4 sm:px-5 w-full"
              type="text"
              id="url"
              name="url"
              placeholder="https://example.com/very-long-url"
              aria-label="Url"
              required
              disabled={isPending}
            />
            <SpinnerButton
              isPending={isPending}
              type="submit"
              disabled={isPending}
            >
              Shorten
            </SpinnerButton>
          </div>
          {state.kind === "success" && (
            // TODO: get host from env?
            <UrlBox
              host={window.location.host}
              path={"expand"}
              shortUrl={state.value.message}
            />
          )}
          {state.kind === "error" && (
            <ErrorMessage message={state.error.message} />
          )}
        </CardContent>
      </Card>
    </form>
  );
};
