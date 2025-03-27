"use client";
import { useActionState } from "react";

import { submitUrlAction, Init } from "@/urls/actions/submitUrlAction";
import { UrlBox } from "./UrlBox";
import { ErrorMessage } from "./ErrorBox";
import { useEffect, useRef } from "react";
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
      <div className="flex gap-4 flex-col items-center min-h-36">
        <div className="flex gap-4 flex-col sm:flex-row">
          <input
            className="text-black bg-slate-100 rounded-full h-10 sm:h-12 px-4 sm:px-5 min-w-80"
            type="text"
            id="url"
            name="url"
            placeholder="Url"
            aria-label="Url"
            required
            disabled={isPending}
          />
          <SpinnerButton
            isPending={isPending}
            type="submit"
            disabled={isPending}
          >
            Submit
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
      </div>
    </form>
  );
};
