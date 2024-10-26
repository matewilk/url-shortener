"use client";
import { useFormState } from "react-dom";
import { submitUrlAction, Init } from "@/urls/actions/formAction";

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
      <div className="flex gap-4 flex-col items-center">
        <div className="flex gap-4 flex-col sm:flex-row">
          <input
            className="text-black bg-slate-100 rounded-full h-10 sm:h-12 px-4 sm:px-5 min-w-80"
            type="text"
            id="url"
            name="url"
            placeholder="Url"
            required
          />
          <button
            disabled={isPending}
            className="rounded-full bg-foreground text-background dark:hover:bg-[#ccc] sm:text-base h-10 sm:h-12 px-4 sm:px-5 min-w-80 sm:min-w-0"
          >
            {isPending ? "Submitting..." : "Submit"}
          </button>
        </div>
        {state.kind === "error" && (
          <div className="text-red-500 text-sm">{state.error.message}</div>
        )}
        {state.kind === "success" && (
          <div className="text-green-500 text-sm">{state.value.message}</div>
        )}
      </div>
    </form>
  );
};
