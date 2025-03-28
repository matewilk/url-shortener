import { FiShare2 } from "react-icons/fi";

type CopyToClipBtnProps = {
  url: string;
};

export const CopyToClipBtn = ({ url }: CopyToClipBtnProps) => (
  <button
    className="text-gray-500 hover:text-gray-700 focus:outline-none"
    onClick={() => navigator.clipboard.writeText(url)}
    aria-label="Copy URL to clipboard"
    type="button"
  >
    <FiShare2 size={20} />
  </button>
);

export default CopyToClipBtn;
