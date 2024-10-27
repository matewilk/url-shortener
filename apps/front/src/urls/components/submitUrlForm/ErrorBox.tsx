// TODO: move somewhere generic - error feature/domain Error.tsx?
export const ErrorMessage = ({ message }: { message: string }) => (
  <div className="text-red-500 text-xl w-full flex justify-start px-4">
    {message}
  </div>
);
