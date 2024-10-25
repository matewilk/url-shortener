"use client";
import { useFormState } from "react-dom";
import { submitUrlAction } from "@/urls/actions/formAction";

const initialState = {
  message: "",
};

export const Form = () => {
  const [state, formAction] = useFormState(submitUrlAction, initialState);
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
          <button className="rounded-full bg-foreground text-background dark:hover:bg-[#ccc] sm:text-base h-10 sm:h-12 px-4 sm:px-5 min-w-80 sm:min-w-0">
            Submit
          </button>
        </div>
        <span>{state.message}</span>
      </div>
    </form>
  );
};
