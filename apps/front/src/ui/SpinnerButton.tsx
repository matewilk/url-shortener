import { ReactNode } from "react";

import { CircleSpinner } from "@/ui/Spinner";

type SpinnerButtonProps = {
  disabled: boolean;
  onClick?: () => void;
  type: "button" | "submit" | "reset";
  isPending: boolean;
  children: ReactNode;
};

export const SpinnerButton = ({
  disabled,
  onClick,
  type = "button",
  isPending = false,
  children,
}: SpinnerButtonProps): ReactNode => {
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className="flex rounded-full bg-foreground text-background dark:hover:bg-[#ccc] sm:text-base h-10 sm:h-12 px-4 sm:px-5 min-w-80 sm:min-w-28 items-center justify-center"
    >
      {isPending ? <CircleSpinner /> : children}
    </button>
  );
};
