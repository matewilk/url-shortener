"use client";
import { useFormState } from "react-dom";

import { submitUrlAction, Init } from "@/urls/actions/formAction";
import { UrlBox } from "./UrlBox";
import { ErrorMessage } from "./Error";

const initialState: Init = {
  kind: "init",
};

export const SubmitUrlForm = () => {
  const [state, formAction, isPending] = useFormState(
    submitUrlAction,
    initialState
  );
  return (
    <form action={formAction}>
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
          />
          <button
            disabled={isPending}
            className="rounded-full bg-foreground text-background dark:hover:bg-[#ccc] sm:text-base h-10 sm:h-12 px-4 sm:px-5 min-w-80 sm:min-w-0"
          >
            {isPending ? "Submitting..." : "Submit"}
          </button>
        </div>
        {state.kind === "success" && (
          // TODO: get host from env?
          <UrlBox host={window.location.host} url={state.value.message} />
        )}
        {state.kind === "error" && (
          <ErrorMessage message={state.error.message} />
        )}
      </div>
    </form>
  );
};
